import { ANH_CHIA_SE_MAC_DINH } from '@/lib/anh-chia-se'
import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'

/** Thông tin đơn vị vận hành — điền trước khi phát hành chính thức. */
const DON_VI = {
  ten: 'TopỨngDụng',
  tenDayDu: 'TopỨngDụng (topungdung.net)',
  email: 'topungdung.net@gmail.com',
  capNhat: '08/09/2026',
}

const PROSE =
  'prose prose-vs max-w-none prose-headings:font-extrabold prose-headings:text-vs-dark prose-h2:text-[26px] prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-vs-gray-200 prose-h3:text-[19px] prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-vs-blue prose-p:text-[15.5px] prose-p:leading-[1.85] prose-p:text-vs-gray-700 prose-ul:text-[15.5px] prose-ul:leading-[1.85] prose-li:text-vs-gray-700 prose-li:my-1 prose-strong:text-vs-dark'

const TIEU_DE = 'Điều khoản sử dụng'          // bố cục gốc tự thêm ' | TopỨngDụng'
const TIEU_DE_OG = 'Điều khoản sử dụng | TopỨngDụng'
const MO_TA =
  'Điều kiện sử dụng nội dung TopỨngDụng: bài đánh giá là quan điểm biên tập, thông tin về giá và tính năng có thể thay đổi, quyết định mua là của bạn.'

export const metadata: Metadata = {
  title: TIEU_DE,
  description: MO_TA,
  keywords: [
    'điều khoản sử dụng topungdung',
    'quy định sử dụng nội dung',
    'bản quyền bài đánh giá',
    'miễn trừ trách nhiệm',
  ],
  alternates: { canonical: '/dieu-khoan-su-dung' },
  openGraph: {
    // Khai openGraph ở đây thì Next thay hẳn khối của layout gốc, kéo theo
    // mất luôn ảnh chia sẻ mặc định, chia sẻ ra Facebook/Zalo
    // chỉ còn thẻ chữ. Trỏ lại đúng ảnh đó.
    images: [ANH_CHIA_SE_MAC_DINH],
    title: TIEU_DE_OG,
    description: MO_TA,
    type: 'article',
    url: '/dieu-khoan-su-dung',
  },
}

export default function DieuKhoanSuDungPage() {
  return (
    <>
      <PageHero
        title="Điều Khoản Sử Dụng"
        titleEm="Sử Dụng"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Điều khoản sử dụng' }]}
        titleTag="h1"
      />

      <article className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-vs-gray-200">
              <span className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-[0.1em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full">
                📜 Văn bản pháp lý
              </span>
              <span className="text-[13px] text-vs-gray-500">
                Cập nhật lần cuối: <strong className="text-vs-dark">{DON_VI.capNhat}</strong>
              </span>
            </div>

            <div className={PROSE}>
              <p className="text-[17px] leading-[1.8] text-vs-gray-700">
                Khi bạn đọc nội dung trên {DON_VI.tenDayDu}, bạn đồng ý với các điều khoản dưới đây.
                Nếu có điểm nào bạn không đồng ý, cách xử lý đơn giản là ngừng sử dụng trang.
              </p>

              <h2>I. Trang này là gì và không là gì</h2>
              <p>
                {DON_VI.ten} là <strong>trang nội dung biên tập độc lập</strong>: chúng tôi viết bài
                đánh giá, so sánh và phân loại phần mềm để người đọc chọn được công cụ phù hợp.
              </p>
              <p>Chúng tôi không phải, và không hoạt động như:</p>
              <ul>
                <li>Đại lý bán hàng hay nhà phân phối của bất kỳ phần mềm nào.</li>
                <li>Đơn vị cung cấp hỗ trợ kỹ thuật cho các phần mềm được nhắc tới.</li>
                <li>Bên trung gian nhận tiền hay xử lý giao dịch giữa bạn và nhà cung cấp.</li>
              </ul>
              <p>
                Khi bạn quyết định dùng một phần mềm, bạn giao dịch trực tiếp với nhà cung cấp phần
                mềm đó. Hợp đồng, hoá đơn, chính sách hoàn tiền và hỗ trợ đều thuộc về họ.
              </p>

              <h2>II. Về nội dung đánh giá</h2>

              <h3>1. Điểm số là quan điểm biên tập</h3>
              <p>
                Điểm số và nhận định trong mỗi bài là <strong>đánh giá của người biên tập</strong>{' '}
                dựa trên tiêu chí chúng tôi công bố, không phải kết quả đo lường khoa học và không
                phải bình chọn của số đông.
              </p>
              <p>
                Cùng một công cụ, người khác có thể chấm khác — điều đó bình thường. Hãy đọc phần
                lý giải thay vì chỉ nhìn con số.
              </p>

              <h3>2. Thông tin giá và tính năng thay đổi liên tục</h3>
              <p>
                Các nhà cung cấp phần mềm đổi bảng giá, giới hạn gói miễn phí và danh sách tính năng
                bất cứ lúc nào mà không báo trước. Chúng tôi cập nhật khi phát hiện, nhưng{' '}
                <strong>không cam kết mọi con số trên trang luôn khớp với hiện trạng</strong>.
              </p>
              <p>
                Vì vậy mỗi bài đều dẫn tới trang chính thức của nhà cung cấp. Trước khi trả tiền,
                hãy kiểm tra lại giá và điều khoản tại đó.
              </p>

              <h3>3. Quyết định là của bạn</h3>
              <p>
                Chúng tôi cung cấp thông tin để bạn cân nhắc. Chúng tôi{' '}
                <strong>không chịu trách nhiệm về thiệt hại phát sinh từ việc bạn chọn hoặc không
                chọn một phần mềm</strong> sau khi đọc bài viết ở đây — bao gồm chi phí thuê bao,
                thời gian chuyển đổi hệ thống hay mất mát dữ liệu.
              </p>

              <h2>III. Tính độc lập của nội dung</h2>
              <p>
                Các liên kết dẫn ra ngoài trong bài viết{' '}
                <strong>trỏ thẳng tới trang chính thức của nhà cung cấp, không gắn mã tiếp thị liên
                kết và không mang lại hoa hồng</strong> cho chúng tôi.
              </p>
              <p>
                Nếu điều này thay đổi trong tương lai, chúng tôi sẽ ghi rõ ngay trong bài viết có
                liên quan chứ không giấu ở cuối trang điều khoản.
              </p>

              <h2>IV. Bản quyền</h2>

              <h3>1. Nội dung của chúng tôi</h3>
              <p>
                Bài viết, bảng so sánh, cách phân loại và điểm đánh giá trên trang thuộc bản quyền
                của {DON_VI.ten}.
              </p>
              <p>
                Bạn <strong>được phép</strong> trích dẫn một đoạn ngắn kèm ghi nguồn và liên kết trỏ
                về bài gốc. Bạn <strong>không được phép</strong> sao chép toàn bộ hay phần lớn bài
                viết để đăng lại ở nơi khác, kể cả khi có ghi nguồn.
              </p>

              <h3>2. Thương hiệu của bên thứ ba</h3>
              <p>
                Tên sản phẩm, logo và ảnh chụp màn hình thuộc về chủ sở hữu tương ứng. Chúng tôi sử
                dụng chúng nhằm mục đích nhận diện và minh hoạ trong bài đánh giá.
              </p>
              <p>
                Việc một phần mềm xuất hiện trên trang <strong>không có nghĩa nhà cung cấp đó tài
                trợ, hợp tác hay xác nhận nội dung bài viết</strong>.
              </p>
              <p>
                Nếu bạn là chủ sở hữu thương hiệu và muốn chúng tôi gỡ hoặc thay hình ảnh, gửi yêu
                cầu tới <strong>{DON_VI.email}</strong>.
              </p>

              <h2>V. Quy tắc khi sử dụng trang</h2>
              <p>Bạn không được:</p>
              <ul>
                <li>Dùng công cụ tự động thu thập nội dung ở quy mô gây ảnh hưởng tới hệ thống.</li>
                <li>Tìm cách truy cập phần quản trị hoặc can thiệp vào hoạt động của trang.</li>
                <li>Thao túng điểm chấm sao bằng cách bỏ phiếu hàng loạt.</li>
                <li>Đăng lại nội dung dưới danh nghĩa của mình.</li>
              </ul>

              <h2>VI. Tính sẵn sàng của dịch vụ</h2>
              <p>
                Trang được cung cấp theo hiện trạng. Chúng tôi không cam kết trang luôn truy cập
                được, không có lỗi hay không bị gián đoạn khi bảo trì.
              </p>
              <p>
                Chúng tôi có thể sửa, gỡ hoặc thay đổi bất kỳ bài viết nào mà không báo trước — ví
                dụ khi một phần mềm ngừng hoạt động hoặc thông tin trong bài không còn đúng.
              </p>

              <h2>VII. Báo lỗi nội dung</h2>
              <p>
                Nếu bạn phát hiện thông tin sai — giá đã đổi, tính năng bị nêu nhầm, phần mềm đã
                đóng cửa — hãy báo cho chúng tôi qua <strong>{DON_VI.email}</strong> hoặc{' '}
                <Link href="/lien-he">biểu mẫu liên hệ</Link>. Báo lỗi là cách trực tiếp nhất giúp
                trang chính xác hơn.
              </p>

              <h2>VIII. Thay đổi điều khoản</h2>
              <p>
                Điều khoản có thể được cập nhật. Ngày ở đầu trang phản ánh lần sửa gần nhất, và việc
                bạn tiếp tục sử dụng trang sau đó được hiểu là bạn đồng ý với bản mới.
              </p>

              <h2>IX. Luật áp dụng</h2>
              <p>
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp phát sinh sẽ
                được ưu tiên giải quyết bằng thương lượng trước khi đưa ra cơ quan có thẩm quyền.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-vs-gray-200">
              <div className="text-[13px] font-extrabold tracking-[0.1em] uppercase text-vs-gray-500 mb-3">
                Tài liệu liên quan
              </div>
              <Link
                href="/chinh-sach-bao-mat"
                className="inline-flex items-center gap-2 text-[15px] font-extrabold text-vs-blue hover:text-vs-blue-dark no-underline"
              >
                🔒 Chính sách bảo mật →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CTASection
        title="Thấy thông tin nào chưa đúng?"
        description="Giá thay đổi, tính năng bị nêu nhầm, phần mềm đã đóng cửa — báo cho chúng tôi để sửa."
        primaryLabel="Báo lỗi nội dung"
        primaryHref="/lien-he"
        secondaryLabel="Xem chính sách bảo mật"
        secondaryHref="/chinh-sach-bao-mat"
      />
    </>
  )
}
