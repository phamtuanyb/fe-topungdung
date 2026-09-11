import { ImageResponse } from 'next/og'

/**
 * Ảnh xem trước khi chia sẻ link lên Facebook, Zalo, X...
 *
 * Trước đây trường này trỏ tới /logo-ngang.png — vốn là logo của Vsoftware,
 * nên mọi link TopỨngDụng chia sẻ ra ngoài đều hiện thương hiệu của công ty khác.
 *
 * Nhận diện của trang là kiểu chữ chứ không phải ảnh logo, nên ảnh này dựng lại
 * đúng khối chữ ở đầu trang: "TOP" nền xanh, "ỨNGDỤNG" đen, dấu chấm và "net" cam.
 */
export const runtime = 'edge'
export const alt = 'TopỨngDụng — Tìm đúng ứng dụng. Làm việc tốt hơn.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BLUE = '#006FE6'
const BLUE_DEEP = '#0057D9'
const INK = '#0B1220'
const ORANGE = '#FF9700'
const BG = '#F5F8FC'
const MUTED = '#5A667A'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: BG,
          padding: '0 88px',
          position: 'relative',
        }}
      >
        {/* Vệt màu thương hiệu chạy dọc mép trái */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 20,
            background: `linear-gradient(180deg, ${BLUE} 0%, ${ORANGE} 100%)`,
            display: 'flex',
          }}
        />

        {/* Khối chữ thương hiệu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              background: `linear-gradient(135deg, ${BLUE}, ${BLUE_DEEP})`,
              color: '#FFFFFF',
              padding: '10px 22px 14px',
              borderRadius: 18,
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: -3,
            }}
          >
            TOP
          </div>
          <div
            style={{ display: 'flex', color: INK, fontSize: 68, fontWeight: 900, letterSpacing: -3 }}
          >
            ỨNGDỤNG
          </div>
          <div style={{ display: 'flex', color: ORANGE, fontSize: 68, fontWeight: 900 }}>.</div>
          <div style={{ display: 'flex', color: ORANGE, fontSize: 68, fontWeight: 900 }}>net</div>
        </div>

        <div
          style={{
            display: 'flex',
            color: INK,
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: -1.5,
            maxWidth: 940,
          }}
        >
          Tìm đúng ứng dụng. Làm việc tốt hơn.
        </div>

        <div
          style={{
            display: 'flex',
            color: MUTED,
            fontSize: 30,
            fontWeight: 500,
            marginTop: 26,
            maxWidth: 900,
          }}
        >
          Đánh giá và so sánh phần mềm — nêu rõ cả điểm yếu và ai không nên dùng.
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 46 }}>
          {['AI', 'Marketing', 'Bán hàng', 'Thiết kế', 'Video', 'Xây kênh'].map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                border: `2px solid rgba(0,111,230,.25)`,
                color: BLUE,
                borderRadius: 999,
                padding: '8px 20px',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
