import { ANH_CHIA_SE_MAC_DINH } from '@/lib/anh-chia-se'
import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'

/**
 * THÔNG TIN ĐƠN VỊ VẬN HÀNH — cần điền trước khi phát hành chính thức.
 *
 * Chỉ khai báo ở một chỗ duy nhất này; toàn bộ trang lấy từ đây.
 * Nếu chưa có pháp nhân, giữ nguyên tên thương hiệu và địa chỉ email là đủ
 * cho một chính sách bảo mật hợp lệ — KHÔNG bịa mã số thuế hay địa chỉ.
 */
const DON_VI = {
  ten: 'TopỨngDụng',
  tenDayDu: 'TopỨngDụng (topungdung.net)',
  email: 'topungdung.net@gmail.com',
  capNhat: '08/09/2026',
}

const PROSE =
  'prose prose-vs max-w-none prose-headings:font-extrabold prose-headings:text-vs-dark prose-h2:text-[26px] prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-vs-gray-200 prose-h3:text-[19px] prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-vs-blue prose-p:text-[15.5px] prose-p:leading-[1.85] prose-p:text-vs-gray-700 prose-ul:text-[15.5px] prose-ul:leading-[1.85] prose-li:text-vs-gray-700 prose-li:my-1 prose-strong:text-vs-dark'

const TIEU_DE = 'Chính sách bảo mật'          // bố cục gốc tự thêm ' | TopỨngDụng'
const TIEU_DE_OG = 'Chính sách bảo mật | TopỨngDụng'
const MO_TA =
  'TopỨngDụng thu thập rất ít dữ liệu: chỉ thông tin bạn chủ động gửi qua biểu mẫu liên hệ và một chuỗi băm ẩn danh khi bạn chấm sao. Không bán dữ liệu cho bên thứ ba.'

export const metadata: Metadata = {
  title: TIEU_DE,
  description: MO_TA,
  keywords: [
    'chính sách bảo mật topungdung',
    'quyền riêng tư người dùng',
    'bảo vệ dữ liệu cá nhân',
    'cookie website',
  ],
  alternates: { canonical: '/chinh-sach-bao-mat' },
  openGraph: {
    // Khai openGraph ở đây thì Next thay hẳn khối của layout gốc, kéo theo
    // mất luôn ảnh chia sẻ mặc định, chia sẻ ra Facebook/Zalo
    // chỉ còn thẻ chữ. Trỏ lại đúng ảnh đó.
    images: [ANH_CHIA_SE_MAC_DINH],
    title: TIEU_DE_OG,
    description: MO_TA,
    type: 'article',
    url: '/chinh-sach-bao-mat',
  },
}

export default function ChinhSachBaoMatPage() {
  return (
    <>
      <PageHero
        title="Chính Sách Bảo Mật"
        titleEm="Bảo Mật"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Chính sách bảo mật' }]}
        titleTag="h1"
      />

      <article className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-vs-gray-200">
              <span className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-[0.1em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full">
                🔒 Văn bản pháp lý
              </span>
              <span className="text-[13px] text-vs-gray-500">
                Cập nhật lần cuối: <strong className="text-vs-dark">{DON_VI.capNhat}</strong>
              </span>
            </div>

            <div className={PROSE}>
              <p className="text-[17px] leading-[1.8] text-vs-gray-700">
                {DON_VI.tenDayDu} là một trang nội dung biên tập: chúng tôi viết bài đánh giá và
                so sánh phần mềm. Chúng tôi không bán phần mềm, không mở tài khoản cho bạn ở bất kỳ
                ứng dụng nào, và <strong>không cần bạn đăng ký để đọc bất cứ nội dung nào</strong>.
              </p>
              <p>
                Vì mô hình đó, lượng dữ liệu cá nhân chúng tôi chạm tới rất nhỏ. Trang này nói rõ
                phần nhỏ đó gồm những gì, dùng để làm gì, giữ trong bao lâu và bạn yêu cầu xoá bằng
                cách nào.
              </p>

              <h2>I. Chúng tôi thu thập những gì</h2>

              <h3>1. Thông tin bạn chủ động gửi qua biểu mẫu liên hệ</h3>
              <p>
                Khi bạn điền biểu mẫu ở trang <Link href="/lien-he">Liên hệ</Link>, chúng tôi nhận
                và lưu đúng các trường bạn nhập: <strong>họ tên, số điện thoại, email, tên đơn vị,
                nội dung cần trao đổi</strong>. Không trường nào trong số này là bắt buộc phải đúng
                — bạn có thể liên hệ bằng email mà không cần cung cấp số điện thoại.
              </p>
              <p>
                Dữ liệu này chỉ dùng để trả lời chính yêu cầu bạn gửi. Chúng tôi không thêm bạn vào
                danh sách gửi thư quảng cáo và không gửi bản tin định kỳ.
              </p>

              <h3>2. Phiếu chấm sao cho ứng dụng</h3>
              <p>
                Bạn chấm sao cho một ứng dụng mà không cần đăng nhập. Để mỗi người chỉ chấm được
                một lần cho mỗi ứng dụng, hệ thống tạo một mã nhận diện bằng cách{' '}
                <strong>băm SHA-256 địa chỉ IP cùng chuỗi nhận dạng trình duyệt</strong>.
              </p>
              <p>
                Điều quan trọng: <strong>địa chỉ IP thô của bạn không được lưu lại</strong>. Thứ nằm
                trong cơ sở dữ liệu chỉ là chuỗi băm một chiều — từ chuỗi đó không khôi phục ngược
                lại được IP, và chúng tôi không dùng nó để nhận ra bạn là ai.
              </p>

              <h3>3. Số liệu truy cập tổng hợp</h3>
              <p>
                Nếu công cụ đo lượt truy cập được bật, nó ghi nhận các số liệu tổng hợp như số lượt
                xem trang, nguồn dẫn tới và loại thiết bị. Đây là số liệu ở mức tổng thể, không gắn
                với danh tính người đọc cụ thể.
              </p>

              <h3>4. Những gì chúng tôi KHÔNG thu thập</h3>
              <ul>
                <li>Không yêu cầu tài khoản, nên không có mật khẩu của bạn.</li>
                <li>Không nhận và không lưu bất kỳ thông tin thanh toán nào.</li>
                <li>Không thu thập vị trí chính xác của thiết bị.</li>
                <li>Không đọc danh bạ, ảnh hay tệp trên máy bạn.</li>
                <li>Không tạo hồ sơ hành vi để bán cho mạng quảng cáo.</li>
              </ul>

              <h2>II. Cookie và bộ nhớ trình duyệt</h2>
              <p>
                Trang sử dụng bộ nhớ trình duyệt cho các tiện ích nhỏ như ghi nhớ ứng dụng bạn đã
                chấm sao. Phần dữ liệu này nằm trên chính máy bạn và bạn xoá được bất cứ lúc nào
                bằng cách xoá dữ liệu duyệt web của trình duyệt.
              </p>
              <p>
                Nếu công cụ đo lượt truy cập được bật, nó đặt thêm cookie riêng của bên cung cấp
                công cụ đó. Bạn chặn được toàn bộ nhóm này trong phần cài đặt trình duyệt mà không
                ảnh hưởng gì tới việc đọc nội dung.
              </p>

              <h2>III. Chúng tôi chia sẻ dữ liệu với ai</h2>
              <p>
                <strong>Chúng tôi không bán, không cho thuê và không trao đổi dữ liệu cá nhân của
                bạn với bên thứ ba.</strong>
              </p>
              <p>Dữ liệu chỉ rời khỏi hệ thống trong hai trường hợp:</p>
              <ul>
                <li>
                  <strong>Nhà cung cấp hạ tầng kỹ thuật</strong> — đơn vị cho thuê máy chủ và công
                  cụ đo lượt truy cập, trong phạm vi cần thiết để trang chạy được.
                </li>
                <li>
                  <strong>Yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền</strong>, khi pháp luật
                  buộc phải cung cấp.
                </li>
              </ul>

              <h2>IV. Liên kết ra trang ngoài</h2>
              <p>
                Mỗi bài đánh giá có nút dẫn tới trang chủ của ứng dụng được nói tới. Các liên kết
                này <strong>trỏ thẳng tới trang chính thức của nhà cung cấp, không kèm mã theo dõi
                và không phải liên kết tiếp thị hưởng hoa hồng</strong>.
              </p>
              <p>
                Khi bạn bấm sang, bạn rời khỏi phạm vi của trang này. Chính sách bảo mật của họ áp
                dụng cho phần đó, không phải chính sách này — chúng tôi không kiểm soát và không
                chịu trách nhiệm về cách họ xử lý dữ liệu.
              </p>

              <h2>V. Thời gian lưu trữ</h2>
              <ul>
                <li>
                  <strong>Thông tin từ biểu mẫu liên hệ:</strong> giữ trong thời gian cần thiết để
                  xử lý và theo dõi yêu cầu, sau đó xoá. Bạn yêu cầu xoá sớm hơn thì chúng tôi xoá
                  ngay.
                </li>
                <li>
                  <strong>Phiếu chấm sao:</strong> giữ cùng bài viết vì nó là một phần của điểm
                  tổng hợp hiển thị công khai. Dữ liệu này đã ở dạng băm, không gắn với danh tính.
                </li>
                <li>
                  <strong>Số liệu truy cập tổng hợp:</strong> theo thời hạn mặc định của công cụ đo.
                </li>
              </ul>

              <h2>VI. Quyền của bạn</h2>
              <p>Bạn có quyền yêu cầu chúng tôi:</p>
              <ul>
                <li>Cho biết chúng tôi đang giữ dữ liệu gì của bạn.</li>
                <li>Sửa lại thông tin sai.</li>
                <li>Xoá thông tin bạn đã gửi qua biểu mẫu liên hệ.</li>
                <li>Ngừng liên hệ với bạn.</li>
              </ul>
              <p>
                Gửi yêu cầu tới <strong>{DON_VI.email}</strong>. Chúng tôi phản hồi trong vòng{' '}
                <strong>7 ngày làm việc</strong>. Vì không có hệ thống tài khoản, bạn chỉ cần nêu
                địa chỉ email hoặc số điện thoại đã dùng khi gửi biểu mẫu để chúng tôi tìm đúng bản
                ghi.
              </p>

              <h2>VII. Trẻ em</h2>
              <p>
                Trang không hướng tới trẻ em dưới 13 tuổi và không cố ý thu thập dữ liệu của nhóm
                tuổi này. Nếu bạn là phụ huynh và phát hiện con mình đã gửi thông tin qua biểu mẫu,
                hãy báo cho chúng tôi để xoá.
              </p>

              <h2>VIII. An toàn dữ liệu</h2>
              <p>
                Toàn bộ kết nối tới trang đi qua giao thức mã hoá HTTPS. Quyền truy cập vào phần
                quản trị được giới hạn cho người phụ trách nội dung.
              </p>
              <p>
                Chúng tôi nói thẳng: không hệ thống nào an toàn tuyệt đối. Đó là lý do chúng tôi
                chọn cách thu thập càng ít càng tốt — thứ không được lưu thì không thể bị lộ.
              </p>

              <h2>IX. Thay đổi chính sách</h2>
              <p>
                Khi chính sách được cập nhật, ngày ở đầu trang sẽ đổi theo. Với thay đổi làm ảnh
                hưởng đáng kể tới quyền của bạn, chúng tôi ghi chú rõ ngay tại đây thay vì sửa lặng
                lẽ.
              </p>

              <h2>X. Liên hệ</h2>
              <p>
                Mọi câu hỏi về quyền riêng tư, gửi tới <strong>{DON_VI.email}</strong> hoặc qua{' '}
                <Link href="/lien-he">biểu mẫu liên hệ</Link>.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-vs-gray-200">
              <div className="text-[13px] font-extrabold tracking-[0.1em] uppercase text-vs-gray-500 mb-3">
                Tài liệu liên quan
              </div>
              <Link
                href="/dieu-khoan-su-dung"
                className="inline-flex items-center gap-2 text-[15px] font-extrabold text-vs-blue hover:text-vs-blue-dark no-underline"
              >
                📜 Điều khoản sử dụng →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CTASection
        title="Còn câu hỏi về dữ liệu của bạn?"
        description="Gửi yêu cầu xem, sửa hoặc xoá dữ liệu — chúng tôi phản hồi trong 7 ngày làm việc."
        primaryLabel="Gửi câu hỏi"
        primaryHref="/lien-he"
        secondaryLabel="Xem điều khoản sử dụng"
        secondaryHref="/dieu-khoan-su-dung"
      />
    </>
  )
}
