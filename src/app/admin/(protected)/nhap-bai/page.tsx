'use client'

import { useState } from 'react'
import { adminImportPosts, type ImportResult } from '@/lib/api/admin'

/**
 * Nạp bài viết từ tệp JSON soạn sẵn.
 *
 * Cách trình bày bài của site — khối trả lời nhanh, 3 bảng so sánh, 8 mục H2,
 * 9 câu hỏi đáp, khối metadata bên phải — không dựng được bằng trình soạn thảo
 * thông thường. Nên quy trình là soạn ngoài rồi nạp qua trang này.
 *
 * Luôn chạy thử trước: backend kiểm chuẩn và báo cáo từng bài, chỉ khi bấm nạp
 * thật mới ghi vào cơ sở dữ liệu.
 */
export default function NhapBaiPage() {
  const [raw, setRaw] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  function readFile(f: File) {
    setFileName(f.name)
    const reader = new FileReader()
    reader.onload = () => setRaw(String(reader.result ?? ''))
    reader.readAsText(f, 'utf-8')
  }

  function parseItems(): unknown[] | null {
    try {
      const obj = JSON.parse(raw)
      // Chấp nhận cả hai dạng: {items:[...]} hoặc thẳng một mảng.
      const items = Array.isArray(obj) ? obj : obj?.items
      if (!Array.isArray(items) || !items.length) {
        setErr('Tệp không có mục nào. Cần dạng {"items":[...]} hoặc một mảng bài viết.')
        return null
      }
      return items
    } catch {
      setErr('Tệp không phải JSON hợp lệ.')
      return null
    }
  }

  async function run(dryRun: boolean) {
    setErr('')
    setResult(null)
    const items = parseItems()
    if (!items) return

    setBusy(true)
    try {
      const res = await adminImportPosts(items, dryRun)
      setResult(res.data)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Nạp không thành công.')
    } finally {
      setBusy(false)
    }
  }

  /** Xuất báo cáo ra tệp văn bản để lưu lại hoặc gửi cho người khác. */
  function downloadReport() {
    if (!result) return
    const lines: string[] = []
    lines.push(`BÁO CÁO NẠP BÀI — ${new Date().toLocaleString('vi-VN')}`)
    lines.push(result.dryRun ? 'Chế độ: kiểm tra thử (chưa ghi)' : 'Chế độ: đã nạp thật')
    lines.push(
      `Tổng ${result.total} · Đạt ${result.passed} · Hỏng ${result.failed}` +
        (result.dryRun ? '' : ` · Tạo mới ${result.created} · Cập nhật ${result.updated}`),
    )
    lines.push('')
    for (const r of result.reports) {
      lines.push(`[${r.action.toUpperCase()}] ${r.slug}`)
      lines.push(
        `  ${r.stats.words} từ · H2 ${r.stats.h2} · H3 ${r.stats.h3} · bảng ${r.stats.tables} · link ${r.stats.links} · FAQ ${r.stats.faq}`,
      )
      if (r.url) lines.push(`  Đường dẫn: ${r.url}`)
      for (const e of r.errors) lines.push(`  LỖI: ${e}`)
      for (const d of r.duplicates ?? []) {
        lines.push(`  TRÙNG với ${d.withSlug}: "${d.sentence}"`)
      }
      lines.push('')
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bao-cao-nap-bai-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const canWrite = result?.dryRun === true && result.passed > 0
  const imported = result && !result.dryRun ? result.reports.filter((r) => r.url) : []

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Nạp bài từ tệp JSON</h1>
      <p className="mt-2 text-sm text-slate-600">
        Chọn tệp JSON đã soạn sẵn. Hệ thống luôn kiểm chuẩn trước và báo cáo từng bài; chỉ ghi
        vào cơ sở dữ liệu khi bạn bấm nút nạp thật.
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-semibold text-slate-800">Tệp JSON</label>
        <input
          type="file"
          accept=".json,application/json"
          className="mt-2 block w-full text-sm"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) readFile(f)
          }}
        />
        {fileName && <p className="mt-2 text-xs text-slate-500">Đã chọn: {fileName}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-800">
          Hoặc dán trực tiếp nội dung JSON
        </label>
        <textarea
          className="mt-2 h-40 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='{"items":[{"slug":"ten-app","content":"<div class=\"answer\">...","seoTitle":"...","app":{...},"faq":[...]}]}'
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!raw.trim() || busy}
            onClick={() => run(true)}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Đang kiểm tra...' : 'Kiểm tra trước'}
          </button>
          <button
            type="button"
            disabled={!canWrite || busy}
            onClick={() => run(false)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Nạp thật {result?.passed ? `(${result.passed} bài)` : ''}
          </button>
          {!canWrite && result?.dryRun && (
            <span className="text-xs text-slate-500">Sửa hết lỗi rồi kiểm tra lại mới nạp được.</span>
          )}
        </div>

        {err && <p className="mt-3 text-sm font-semibold text-red-600">{err}</p>}
      </div>

      {result && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="font-semibold">
              {result.dryRun ? 'Kết quả kiểm tra' : 'Đã nạp xong'}
            </span>
            <span>Tổng: {result.total}</span>
            <span className="text-emerald-700">Đạt: {result.passed}</span>
            <span className={result.failed ? 'text-red-600' : ''}>Hỏng: {result.failed}</span>
            {!result.dryRun && (
              <>
                <span>Tạo mới: {result.created}</span>
                <span>Cập nhật: {result.updated}</span>
              </>
            )}
            <button
              type="button"
              onClick={downloadReport}
              className="ml-auto rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-500"
            >
              Tải báo cáo
            </button>
          </div>

          {imported.length > 0 && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <b className="text-sm text-emerald-900">Bài đã nạp — bấm để xem trên web</b>
              <ul className="mt-2 space-y-1">
                {imported.map((r) => (
                  <li key={r.slug} className="text-sm">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-700 underline"
                    >
                      {r.url}
                    </a>
                    <span className="ml-2 text-xs text-slate-600">({r.action})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-600">
                Nhớ làm mới cache để trang hiện nội dung mới, và đừng quên cả{' '}
                <code>/sitemap.xml</code>.
              </p>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {result.reports.map((r) => (
              <div
                key={r.slug}
                className={`rounded-lg border p-3 ${
                  r.errors.length ? 'border-red-200 bg-red-50' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                  <b>{r.slug}</b>
                  <span className="text-xs text-slate-500">{r.action}</span>
                  <span className="text-xs text-slate-500">
                    {r.stats.words} từ · H2 {r.stats.h2} · H3 {r.stats.h3} · bảng {r.stats.tables} ·
                    link {r.stats.links} · FAQ {r.stats.faq}
                  </span>
                </div>
                {r.url && !r.errors.length && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs font-semibold text-blue-700 underline"
                  >
                    {r.url}
                  </a>
                )}
                {r.errors.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-red-700">
                    {r.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
                {(r.duplicates?.length ?? 0) > 0 && (
                  <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2">
                    <b className="text-xs text-amber-900">Câu trùng với bài đã đăng</b>
                    <ul className="mt-1 space-y-1 text-xs text-amber-900">
                      {r.duplicates!.map((d, i) => (
                        <li key={i}>
                          <a
                            href={`/app/${d.withSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline"
                          >
                            {d.withSlug}
                          </a>
                          <span className="ml-1 italic">&ldquo;{d.sentence}&rdquo;</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <b className="text-slate-900">Chuẩn bài mà hệ thống kiểm</b>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
          <li>Tối thiểu 1.200 từ, ít nhất 7 mục H2, 2 bảng và 3 link nội bộ</li>
          <li>Không có thẻ H1, không nhảy bậc heading, thẻ p phải cân đối</li>
          <li>Thân bài không được chứa mục &quot;Câu hỏi thường gặp&quot; — trang tự render khối này</li>
          <li>seoTitle tối đa 60 ký tự, seoDescription tối đa 160 ký tự</li>
          <li>Đủ metadata: pricingSummary, ctaText, languages, pros, cons, bestFor, verdict</li>
          <li>scoreBreakdown đúng 5 mục; pros, cons, bestFor mỗi mục ít nhất 4 dòng; FAQ ít nhất 9 câu</li>
          <li>Bài mới cần thêm <code>title</code> và <code>categorySlug</code></li>
        </ul>
      </div>
    </div>
  )
}
