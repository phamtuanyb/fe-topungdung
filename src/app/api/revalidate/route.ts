import { timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Làm mới cache ISR ngay lập tức sau khi admin lưu cấu hình.
 *
 *   POST /api/revalidate?path=/
 *   POST /api/revalidate?path=/,/topapp,/ranking   (nhiều đường, ngăn bằng dấu phẩy)
 *
 * Hai cách xác thực, cách nào đúng cũng được:
 *   - header `x-revalidate-secret` khớp REVALIDATE_SECRET (cho script, CI)
 *   - header `Authorization: Bearer <token admin>` — token được hỏi lại backend
 *     qua /api/admin/auth/me. Trang admin chạy ở trình duyệt nên không thể giữ
 *     REVALIDATE_SECRET; trước đây nó gọi mà không có gì, bị 401, nuốt lỗi, và
 *     mọi thay đổi trong admin đều phải chờ hết vòng cache mới hiện.
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

// Route này chạy ở máy chủ nên đi đường nội bộ nếu có, giống lib/api/client.ts.
const API_URL = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

/** Token admin có thật không — hỏi backend, vì Next không giữ JWT_SECRET. */
async function laAdmin(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  // Ưu tiên header: tham số trên URL bị ghi vào nhật ký máy chủ và lịch sử trình duyệt.
  const sent = req.headers.get('x-revalidate-secret') ?? req.nextUrl.searchParams.get('secret') ?? ''
  const bearer = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')

  let hopLe = false
  if (sent) {
    if (!secret) {
      return NextResponse.json(
        { ok: false, message: 'Chưa cấu hình REVALIDATE_SECRET nên không nhận secret.' },
        { status: 503 },
      )
    }
    hopLe = safeEqual(sent, secret)
  } else if (bearer) {
    hopLe = await laAdmin(bearer)
  }

  if (!hopLe) {
    return NextResponse.json({ ok: false, message: 'Không có quyền' }, { status: 401 })
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
