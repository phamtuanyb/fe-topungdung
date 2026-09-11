/**
 * Bóc nội dung một bài prompt thành các phần rời để trang chi tiết xếp vào
 * đúng ô của bố cục hai cột, thay vì đổ cả khối HTML ra một mạch.
 *
 * Hai dạng bài đang có trong kho:
 *
 *   Bài lẻ (20 bài) — `<div class="answer">` ghi "Dùng để" và "Hợp với", rồi
 *   `<h2>Prompt</h2>` + một `<pre class="prompt-box">`, `<h2>Cách dùng</h2>` +
 *   danh sách, `<h2>Mẹo tinh chỉnh</h2>` + một đoạn. Mỗi phần chạy vào một ô:
 *   dải "Dùng để" và khối prompt nằm cột trái, các bước và công cụ nằm cột phải.
 *
 *   Bài gom nhóm — cũng có `answer` nhưng phần thân là bài viết dài với mười
 *   `<h3>` kèm mười đoạn prompt. Không có "Cách dùng" hay "Mẹo tinh chỉnh", bù
 *   lại có `muc` để cột phải dựng mục lục.
 *
 * Bài không theo khuôn nào thì các trường rời trả về rỗng và toàn bộ nội dung
 * rơi vào `sections` — trang vẫn hiện đầy đủ chứ không vỡ.
 */
export type PromptSection =
  | { kind: 'html'; html: string }
  | { kind: 'prompt'; text: string }

export interface PromptParts {
  /** Câu trả lời cho "prompt này dùng làm gì", lấy từ dòng đầu khối `answer`. */
  dungDe: string
  /** Nhãn đứng trước câu đó. Bài lẻ ghi "Dùng để:", bài gom nhóm ghi tên nhóm. */
  dungDeNhan: string
  /** Tên các công cụ ở dòng "Hợp với", đã tách thành danh sách. */
  hopVoi: string[]
  /** Các gạch đầu dòng của mục "Cách dùng", dựng thành các bước có đánh số. */
  buoc: string[]
  /** HTML của mục "Mẹo tinh chỉnh". */
  meo: string
  /** Các mốc `<h3>` trong bài gom nhóm, dùng làm mục lục cột phải. */
  muc: { id: string; ten: string }[]
  /** Ghép mọi đoạn prompt, dùng cho `articleBody` trong dữ liệu có cấu trúc. */
  promptText: string
  sections: PromptSection[]
}

/** Giải mã thực thể HTML để chuỗi chép ra là prompt thật, không phải &lt; &amp;. */
function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&') // để cuối, tránh giải mã hai lần
}

/** Bóc thẻ để lấy phần chữ trần. */
function chu(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

const BOX = /<pre class="prompt-box">([\s\S]*?)<\/pre>/gi

/**
 * "Midjourney, ChatGPT, Gemini — mọi công cụ nhận mô tả bằng chữ." → ba tên.
 * Phần sau gạch dài là câu giải thích chứ không phải tên công cụ nên cắt bỏ;
 * mảnh nào dài quá một cái tên thì cũng bỏ, tránh nhét cả câu vào viên nhỏ.
 */
function tachCongCu(html: string): string[] {
  return chu(html)
    .split('—')[0]
    .split(/[,;]|\bvà\b/)
    .map((s) => s.trim().replace(/[.。]$/, '').trim())
    .filter((s) => s.length > 0 && s.length <= 26)
    .slice(0, 6)
}

export function splitPromptContent(html: string): PromptParts {
  let rest = html ?? ''

  // ── Khối `answer`: "Dùng để" và "Hợp với" ──────────────────────────────
  let dungDe = ''
  let dungDeNhan = ''
  let hopVoi: string[] = []
  const answer = rest.match(/<div class="answer">([\s\S]*?)<\/div>/i)
  if (answer) {
    rest = rest.replace(answer[0], '')
    const doan = answer[1].match(/<p>[\s\S]*?<\/p>/gi) ?? []
    for (const p of doan) {
      const m = p.match(/<b>([\s\S]*?)<\/b>([\s\S]*)/i)
      if (!m) continue
      const nhan = chu(m[1])
      const than = m[2]
      if (/hợp với/i.test(nhan)) hopVoi = tachCongCu(than)
      // Bài lẻ ghi "Dùng để:", bài gom nhóm ghi thẳng tên nhóm — cả hai đều là
      // câu trả lời cho "prompt này dùng làm gì" nên nhận chung một ô.
      else if (!dungDe) {
        dungDeNhan = nhan.endsWith(':') ? nhan : `${nhan}:`
        // Trong bài, câu này nối tiếp nhãn nên viết thường; tách ra đứng riêng
        // thì phải viết hoa chữ đầu.
        const t = chu(than)
        dungDe = t.charAt(0).toUpperCase() + t.slice(1)
      }
    }
  }

  // ── Mục "Cách dùng" → các bước có đánh số ở cột phải ────────────────────
  const buoc: string[] = []
  const cachDung = rest.match(/<h2>\s*Cách dùng\s*<\/h2>\s*<ul>([\s\S]*?)<\/ul>/i)
  if (cachDung) {
    rest = rest.replace(cachDung[0], '')
    for (const li of cachDung[1].match(/<li>[\s\S]*?<\/li>/gi) ?? []) {
      const t = chu(li)
      if (t) buoc.push(t)
    }
  }

  // ── Mục "Mẹo tinh chỉnh" → thẻ riêng dưới khối prompt ───────────────────
  let meo = ''
  const meoBlock = rest.match(/<h2>\s*Mẹo tinh chỉnh\s*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i)
  if (meoBlock) {
    rest = rest.replace(meoBlock[0], '')
    meo = meoBlock[1].trim()
  }

  // Tiêu đề "Prompt" đứng một mình là thừa vì khối chép nhanh đã có nhãn riêng.
  rest = rest.replace(/<h2>\s*Prompt\s*<\/h2>/gi, '')

  // ── Mốc `<h3>` → mục lục, đồng thời gắn neo để bấm nhảy tới ─────────────
  const muc: { id: string; ten: string }[] = []
  rest = rest.replace(/<h3>([\s\S]*?)<\/h3>/gi, (_all, t: string) => {
    const id = `muc-${muc.length + 1}`
    muc.push({ id, ten: chu(t) })
    return `<h3 id="${id}">${t}</h3>`
  })

  // ── Phần còn lại: diễn giải và các đoạn prompt xen kẽ ───────────────────
  const sections: PromptSection[] = []
  const texts: string[] = []
  let cuoi = 0
  // Dùng exec trong vòng lặp thay cho matchAll: matchAll đòi downlevelIteration.
  BOX.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = BOX.exec(rest)) !== null) {
    const truoc = rest.slice(cuoi, m.index).trim()
    if (truoc) sections.push({ kind: 'html', html: truoc })
    const text = decodeEntities(m[1]).trim()
    if (text) {
      sections.push({ kind: 'prompt', text })
      texts.push(text)
    }
    cuoi = m.index + m[0].length
  }
  const sau = rest.slice(cuoi).trim()
  if (sau) sections.push({ kind: 'html', html: sau })

  return {
    dungDe,
    dungDeNhan,
    hopVoi,
    buoc,
    meo,
    muc,
    promptText: texts.join('\n\n'),
    sections,
  }
}
