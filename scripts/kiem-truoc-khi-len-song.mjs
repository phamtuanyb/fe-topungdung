#!/usr/bin/env node
/**
 * Kiểm bản dựng trước khi trỏ tên miền thật vào.
 *
 *   node scripts/kiem-truoc-khi-len-song.mjs https://topungdung.net
 *   npm run kiem:len-song -- https://topungdung.net
 *
 * Bắt đúng một loại lỗi mà mắt thường không thấy: NEXT_PUBLIC_* bị nướng cứng
 * giá trị localhost vào bundle lúc build. Trang vẫn hiện bình thường, chỉ có
 * canonical, og:image và sitemap là trỏ về máy cá nhân — và phải build lại mới
 * sửa được, nên phải phát hiện TRƯỚC khi mở cho người dùng vào.
 *
 * Thoát mã 1 nếu có lỗi, để cắm được vào script deploy.
 */

const goc = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '')
if (!goc) {
  console.error('Thiếu địa chỉ. Dùng: node scripts/kiem-truoc-khi-len-song.mjs https://topungdung.net')
  process.exit(1)
}

/** Trang đại diện cho từng loại bố cục — đủ để phủ mọi nhánh sinh metadata. */
const TRANG = [
  '/',
  '/ungdung',
  '/ungdung/ai/tao-anh',
  '/app/canva',
  '/ranking',
  '/topapp',
  '/prompt',
  '/prompt/tao-anh',
  '/tin-tuc',
  '/lien-he',
  '/introduction',
  '/dieu-khoan-su-dung',
  '/chinh-sach-bao-mat',
]

/** Tệp phải tồn tại, không phải trang HTML. */
const TEP = ['/favicon.ico', '/icon.png', '/apple-icon.png', '/manifest.webmanifest', '/robots.txt', '/sitemap.xml']

/**
 * Chạy thử ngay trên máy cá nhân thì chính địa chỉ gốc đã là localhost, nên mọi
 * phép so localhost mất nghĩa — hạ chúng xuống mức nhắc để script vẫn dùng được
 * làm phép kiểm khói lúc dev.
 */
const laCucBo = /localhost|127\.0\.0\.1/.test(goc)

const loi = []
const nhac = []

function bat(dieuKien, thongDiep) {
  if (!dieuKien) loi.push(thongDiep)
}

/** Phép so chỉ có nghĩa khi đang kiểm một tên miền thật. */
function batTenMien(dieuKien, thongDiep) {
  if (dieuKien) return
  ;(laCucBo ? nhac : loi).push(thongDiep)
}

async function lay(duong) {
  const res = await fetch(goc + duong, { redirect: 'follow' })
  return { ma: res.status, than: await res.text(), kieu: res.headers.get('content-type') || '' }
}

function tim(html, bieuThuc) {
  const m = html.match(bieuThuc)
  return m ? m[1] : ''
}

async function main() {
  console.log(`Kiểm ${goc}`)
  if (laCucBo) {
    console.log('(địa chỉ gốc là localhost — các phép so tên miền hạ xuống mức nhắc)')
  }
  console.log('')

  // ── 1. Trang chính phải sống, và metadata không được dính localhost ───────
  for (const d of TRANG) {
    let t
    try {
      t = await lay(d)
    } catch (e) {
      loi.push(`${d} — không gọi được: ${e.message}`)
      continue
    }
    if (t.ma !== 200) {
      loi.push(`${d} — trả mã ${t.ma}`)
      continue
    }

    const canon = tim(t.than, /<link rel="canonical" href="([^"]*)"/)
    const og = tim(t.than, /<meta property="og:image" content="([^"]*)"/)
    const tieuDe = tim(t.than, /<title[^>]*>([^<]*)<\/title>/)

    bat(canon, `${d} — thiếu canonical`)
    batTenMien(!/localhost|127\.0\.0\.1/.test(canon), `${d} — canonical còn localhost: ${canon}`)
    bat(og, `${d} — thiếu og:image`)
    batTenMien(!/localhost|127\.0\.0\.1/.test(og), `${d} — og:image còn localhost: ${og}`)
    bat(!tieuDe.startsWith('404'), `${d} — là trang 404 nhưng trả mã 200`)
    if (canon && !canon.startsWith(goc)) {
      nhac.push(`${d} — canonical trỏ sang tên miền khác: ${canon}`)
    }
    // Chỉ soi phần thân: <head> chứa canonical và og đã kiểm riêng ở trên, còn
    // Next thì nhúng sẵn khối lỗi vào payload của mọi trang nên phải bỏ script
    // đi trước khi dò.
    const than = (t.than.split(/<body[^>]*>/i)[1] || '').replace(/<script[\s\S]*?<\/script>/gi, '')
    batTenMien(!/localhost|127\.0\.0\.1/.test(than), `${d} — có "localhost" lọt vào phần thân trang`)

    console.log(`  ok  ${d}`)
  }

  // ── 2. Tệp tĩnh và tệp sinh ra ───────────────────────────────────────────
  console.log('')
  for (const d of TEP) {
    try {
      const t = await lay(d)
      bat(t.ma === 200, `${d} — trả mã ${t.ma}`)
      if (t.ma === 200) console.log(`  ok  ${d}  (${t.kieu})`)
    } catch (e) {
      loi.push(`${d} — không gọi được: ${e.message}`)
    }
  }

  // ── 3. robots.txt và sitemap.xml phải mang tên miền thật ─────────────────
  console.log('')
  const robots = await lay('/robots.txt')
  batTenMien(!/localhost|127\.0\.0\.1/.test(robots.than), 'robots.txt còn trỏ sitemap về localhost')
  bat(robots.than.includes('Disallow: /admin'), 'robots.txt không còn chặn /admin')

  const sm = await lay('/sitemap.xml')
  const urls = [...sm.than.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  bat(urls.length > 100, `sitemap chỉ có ${urls.length} URL — nghi là chưa nạp đủ dữ liệu`)
  const lac = urls.filter((u) => !u.startsWith(goc))
  batTenMien(lac.length === 0, `sitemap có ${lac.length} URL sai tên miền, ví dụ: ${lac[0]}`)
  console.log(`  ok  sitemap.xml — ${urls.length} URL`)

  // ── 4. Ảnh tải lên: phải phục vụ được qua đường dẫn tương đối ────────────
  const anh = tim((await lay('/app/canva')).than, /(\/uploads\/[0-9a-f-]+\.webp)/)
  if (anh) {
    const t = await lay(anh)
    bat(t.ma === 200, `${anh} — ảnh tải lên trả mã ${t.ma}`)
    if (t.ma === 200) console.log(`  ok  ${anh}`)
  } else {
    nhac.push('Không tìm thấy ảnh /uploads nào trên /app/canva để kiểm.')
  }

  // ── Kết ──────────────────────────────────────────────────────────────────
  console.log('')
  if (nhac.length) {
    console.log('Nhắc (không chặn):')
    nhac.forEach((x) => console.log('  · ' + x))
    console.log('')
  }
  if (loi.length) {
    console.error(`✗ ${loi.length} lỗi:`)
    loi.forEach((x) => console.error('  · ' + x))
    process.exit(1)
  }
  console.log('✓ Không có lỗi chặn. Bản dựng đi được.')
}

main().catch((e) => {
  console.error('Kiểm hỏng giữa chừng:', e)
  process.exit(1)
})
