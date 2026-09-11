import { timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Làm mới cache ISR ngay lập tức sau khi admin lưu cấu hình.
 *
 *   POST /api/revalidate?path=/
 *   POST /api/revalidate?path=/,/topapp,/ranking   (nhiều đường, ngăn bằng dấu phẩy)
 *
 * Khoá bằng REVALIDATE_SECRET, gửi qua header `x-revalidate-secret`.
 *
 * Trước đây điều kiện là `if (secret && ...)` — nghĩa là KHÔNG khai biến thì bỏ
 * qua kiểm tra và ai cũng gọi được. Mà biến đó chưa từng được khai, nên endpoint
 * mở cho mọi người: gọi liên tục là mọi lượt truy cập đều phải dựng lại trang,
 * đập thẳng vào backend. Giờ thiếu cấu hình thì CHẶN chứ không mở.
 */

/** Số đường tối đa mỗi lần gọi, tránh một yêu cầu xoá cache cả site. */
const MAX_PATHS = 25

/** So sánh theo thời gian cố định để không lộ thông tin qua độ trễ phản hồi. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json(
      { ok: false, message: 'Chưa cấu hình REVALIDATE_SECRET nên endpoint bị khoá.' },
      { status: 503 },
    )
  }

  // Ưu tiên header: tham số trên URL bị ghi vào nhật ký máy chủ và lịch sử trình duyệt.
  const sent = req.headers.get('x-revalidate-secret') ?? req.nextUrl.searchParams.get('secret') ?? ''

  if (!safeEqual(sent, secret)) {
    return NextResponse.json({ ok: false, message: 'Sai secret' }, { status: 401 })
  }

  // Nhận nhiều đường cùng lúc: một lần lưu cấu hình có thể ảnh hưởng vài trang.
  const paths = (req.nextUrl.searchParams.get('path') || '/')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    // Chỉ nhận đường dẫn nội bộ, chặn kiểu "https://..." hay "//example.com".
    .filter((p) => p.startsWith('/') && !p.startsWith('//'))

  if (!paths.length) {
    return NextResponse.json({ ok: false, message: 'Không có đường dẫn hợp lệ' }, { status: 400 })
  }

  if (paths.length > MAX_PATHS) {
    return NextResponse.json(
      { ok: false, message: `Tối đa ${MAX_PATHS} đường mỗi lần gọi` },
      { status: 400 },
    )
  }

  for (const path of paths) revalidatePath(path)

  return NextResponse.json({ ok: true, paths, revalidatedAt: new Date().toISOString() })
}
