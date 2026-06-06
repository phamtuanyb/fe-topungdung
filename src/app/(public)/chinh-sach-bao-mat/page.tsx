import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật Vsoftware | Bảo Vệ Dữ Liệu Khách Hàng',
  description:
    'Chính sách bảo mật Vsoftware cam kết bảo vệ thông tin cá nhân, dữ liệu doanh nghiệp và quy trình xử lý dữ liệu của khách hàng khi sử dụng dịch vụ.',
  keywords: ['chính sách bảo mật Vsoftware', 'bảo mật thông tin khách hàng', 'bảo vệ dữ liệu cá nhân', 'chính sách quyền riêng tư', 'bảo mật dữ liệu doanh nghiệp'],
  alternates: { canonical: '/chinh-sach-bao-mat' },
  openGraph: {
    title: 'Chính Sách Bảo Mật Vsoftware | Bảo Vệ Dữ Liệu Khách Hàng',
    description: 'Chính sách bảo mật Vsoftware cam kết bảo vệ thông tin cá nhân, dữ liệu doanh nghiệp và quy trình xử lý dữ liệu của khách hàng khi sử dụng dịch vụ.',
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
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-vs-gray-200">
              <span className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-[0.1em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full">
                🔒 Văn bản pháp lý
              </span>
              <span className="text-[13px] text-vs-gray-500">
                Cập nhật lần cuối: <strong className="text-vs-dark">06/06/2026</strong>
              </span>
            </div>

            {/* Intro */}
            <div className="prose prose-vs max-w-none prose-headings:font-extrabold prose-headings:text-vs-dark prose-h2:text-[26px] prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-vs-gray-200 prose-h3:text-[19px] prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-vs-blue prose-p:text-[15.5px] prose-p:leading-[1.85] prose-p:text-vs-gray-700 prose-ul:text-[15.5px] prose-ul:leading-[1.85] prose-li:text-vs-gray-700 prose-li:my-1 prose-strong:text-vs-dark">
              <p className="text-[17px] leading-[1.8] text-vs-gray-700">
                <strong>Vsoftware</strong> cam kết bảo vệ thông tin cá nhân, dữ liệu doanh nghiệp và các dữ liệu phát sinh trong quá trình khách hàng truy cập website, đăng ký tư vấn, sử dụng phần mềm hoặc triển khai dịch vụ cùng Vsoftware.
              </p>
              <p>
                Chính sách bảo mật này giúp khách hàng hiểu rõ Vsoftware thu thập dữ liệu nào, sử dụng dữ liệu vào mục đích gì, lưu trữ và bảo vệ dữ liệu ra sao, trong trường hợp nào dữ liệu có thể được chia sẻ, cũng như quyền của khách hàng đối với thông tin cá nhân của mình.
              </p>

              <h2>I. Phạm vi áp dụng của chính sách bảo mật</h2>

              <h3>1. Áp dụng cho website, phần mềm và dịch vụ của Vsoftware</h3>
              <p>
                Chính sách bảo mật này áp dụng cho toàn bộ thông tin cá nhân và dữ liệu doanh nghiệp được thu thập khi khách hàng truy cập website Vsoftware, điền form tư vấn, đăng ký dùng thử, liên hệ qua hotline, email, fanpage hoặc sử dụng các phần mềm, giải pháp và dịch vụ do Vsoftware cung cấp.
              </p>
              <p>
                Chính sách này cũng áp dụng cho các dữ liệu phát sinh trong quá trình Vsoftware tư vấn, triển khai, bảo trì, hỗ trợ kỹ thuật hoặc tích hợp hệ thống cho khách hàng.
              </p>

              <h3>2. Đối tượng áp dụng</h3>
              <p>Chính sách bảo mật áp dụng cho:</p>
              <ul>
                <li>Khách hàng cá nhân truy cập website Vsoftware.</li>
                <li>Doanh nghiệp đăng ký tư vấn hoặc sử dụng phần mềm của Vsoftware.</li>
                <li>Người dùng được doanh nghiệp cấp quyền sử dụng hệ thống.</li>
                <li>Đối tác, đại lý hoặc đơn vị phối hợp triển khai dịch vụ cùng Vsoftware.</li>
                <li>Người liên hệ với Vsoftware thông qua website, email, hotline, mạng xã hội hoặc các kênh hỗ trợ khác.</li>
              </ul>

              <h2>II. Thông tin Vsoftware có thể thu thập</h2>

              <h3>1. Thông tin định danh cá nhân</h3>
              <p>
                Khi khách hàng liên hệ, đăng ký tư vấn hoặc sử dụng dịch vụ, Vsoftware có thể thu thập một số thông tin định danh cơ bản, bao gồm:
              </p>
              <ul>
                <li>Họ và tên.</li>
                <li>Số điện thoại.</li>
                <li>Email.</li>
                <li>Tên doanh nghiệp hoặc tổ chức.</li>
                <li>Chức vụ hoặc bộ phận làm việc.</li>
                <li>Nội dung yêu cầu tư vấn hoặc hỗ trợ.</li>
              </ul>
              <p>
                Thông tin được khách hàng chủ động cung cấp qua form, email, tin nhắn hoặc cuộc gọi. Các thông tin này giúp Vsoftware xác định đúng người liên hệ, phản hồi yêu cầu nhanh hơn và hỗ trợ khách hàng phù hợp với nhu cầu thực tế.
              </p>

              <h3>2. Thông tin doanh nghiệp và nhu cầu sử dụng dịch vụ</h3>
              <p>
                Trong quá trình tư vấn hoặc triển khai phần mềm, Vsoftware có thể ghi nhận thêm các thông tin liên quan đến doanh nghiệp như:
              </p>
              <ul>
                <li>Lĩnh vực kinh doanh.</li>
                <li>Quy mô nhân sự.</li>
                <li>Quy trình đang vận hành.</li>
                <li>Phần mềm hoặc hệ thống doanh nghiệp đang sử dụng.</li>
                <li>Nhu cầu triển khai phần mềm, tự động hóa hoặc AI Agent.</li>
                <li>Các khó khăn doanh nghiệp đang gặp trong quản lý, marketing, bán hàng, chăm sóc khách hàng hoặc vận hành.</li>
              </ul>
              <p>
                Những thông tin này được sử dụng để Vsoftware tư vấn giải pháp phù hợp hơn, không dùng để bán hoặc trao đổi cho bên thứ ba vì mục đích thương mại.
              </p>

              <h3>3. Dữ liệu sử dụng phần mềm và dịch vụ</h3>
              <p>
                Khi khách hàng sử dụng phần mềm hoặc hệ thống do Vsoftware cung cấp, hệ thống có thể ghi nhận dữ liệu sử dụng để phục vụ vận hành, hỗ trợ và cải thiện chất lượng dịch vụ. Dữ liệu này có thể bao gồm:
              </p>
              <ul>
                <li>Lịch sử đăng nhập và thao tác trên hệ thống.</li>
                <li>Cấu hình tài khoản, phân quyền và thiết lập sử dụng.</li>
                <li>Dữ liệu khách hàng nhập vào phần mềm theo nhu cầu vận hành.</li>
                <li>Nhật ký lỗi, trạng thái xử lý và dữ liệu kỹ thuật phục vụ hỗ trợ.</li>
                <li>Nội dung trao đổi với bộ phận chăm sóc khách hàng hoặc kỹ thuật.</li>
              </ul>
              <p>
                Vsoftware chỉ xử lý các dữ liệu này trong phạm vi cần thiết để cung cấp dịch vụ, hỗ trợ khách hàng và đảm bảo hệ thống hoạt động ổn định.
              </p>

              <h3>4. Dữ liệu kỹ thuật khi truy cập website</h3>
              <p>
                Khi khách hàng truy cập website Vsoftware, hệ thống có thể tự động ghi nhận một số dữ liệu kỹ thuật như:
              </p>
              <ul>
                <li>Địa chỉ IP.</li>
                <li>Loại trình duyệt.</li>
                <li>Thiết bị truy cập.</li>
                <li>Hệ điều hành.</li>
                <li>Thời gian truy cập.</li>
                <li>Trang đã xem.</li>
                <li>Cookie và dữ liệu tương tác trên website.</li>
              </ul>
              <p>
                Các dữ liệu này được sử dụng để phân tích hiệu suất website, cải thiện trải nghiệm người dùng, tăng cường bảo mật và phát hiện hành vi bất thường.
              </p>

              <h2>III. Mục đích sử dụng thông tin</h2>

              <h3>1. Cung cấp và vận hành dịch vụ</h3>
              <p>
                Vsoftware sử dụng thông tin khách hàng để cung cấp phần mềm, dịch vụ tư vấn, hỗ trợ kỹ thuật, triển khai giải pháp và duy trì hoạt động ổn định của hệ thống. Các hoạt động này có thể bao gồm:
              </p>
              <ul>
                <li>Tạo tài khoản sử dụng.</li>
                <li>Xác nhận thông tin đăng ký.</li>
                <li>Tư vấn giải pháp phù hợp.</li>
                <li>Cấu hình phần mềm theo nhu cầu.</li>
                <li>Hỗ trợ kỹ thuật trong quá trình sử dụng.</li>
                <li>Xử lý lỗi, bảo trì và nâng cấp hệ thống.</li>
              </ul>

              <h3>2. Chăm sóc khách hàng và xử lý yêu cầu hỗ trợ</h3>
              <p>
                Thông tin khách hàng giúp Vsoftware phản hồi đúng người, đúng nhu cầu và đúng tình trạng sử dụng dịch vụ. Vsoftware có thể sử dụng thông tin liên hệ để:
              </p>
              <ul>
                <li>Gọi điện tư vấn.</li>
                <li>Gửi email hỗ trợ.</li>
                <li>Phản hồi yêu cầu qua tin nhắn hoặc form liên hệ.</li>
                <li>Thông báo tiến độ xử lý yêu cầu.</li>
                <li>Gửi tài liệu hướng dẫn sử dụng.</li>
                <li>Nhắc lịch demo, đào tạo hoặc bàn giao hệ thống.</li>
              </ul>

              <h3>3. Cải thiện chất lượng sản phẩm và trải nghiệm người dùng</h3>
              <p>
                Dữ liệu sử dụng giúp Vsoftware hiểu khách hàng đang dùng phần mềm như thế nào, gặp khó khăn ở đâu và tính năng nào cần được tối ưu thêm. Vsoftware có thể sử dụng dữ liệu tổng hợp để:
              </p>
              <ul>
                <li>Cải thiện giao diện người dùng.</li>
                <li>Tối ưu tốc độ và độ ổn định của hệ thống.</li>
                <li>Phát hiện lỗi thường gặp.</li>
                <li>Nâng cấp tính năng.</li>
                <li>Cải thiện tài liệu hướng dẫn.</li>
                <li>Đề xuất giải pháp phù hợp hơn cho từng nhóm khách hàng.</li>
              </ul>

              <h3>4. Gửi thông báo dịch vụ và thông tin liên quan</h3>
              <p>Vsoftware có thể gửi cho khách hàng các thông báo liên quan đến dịch vụ, bao gồm:</p>
              <ul>
                <li>Thông báo bảo trì hệ thống.</li>
                <li>Cập nhật tính năng mới.</li>
                <li>Hướng dẫn sử dụng phần mềm.</li>
                <li>Cảnh báo bảo mật hoặc thay đổi quan trọng.</li>
                <li>Thông tin liên quan đến hợp đồng, tài khoản hoặc dịch vụ đang sử dụng.</li>
              </ul>
              <p>
                Trong trường hợp gửi nội dung marketing, khách hàng có thể từ chối nhận thông tin theo hướng dẫn trong email hoặc liên hệ trực tiếp với Vsoftware.
              </p>

              <h3>5. Tuân thủ nghĩa vụ pháp lý</h3>
              <p>
                Vsoftware có thể xử lý hoặc lưu trữ dữ liệu khi cần thiết để tuân thủ quy định pháp luật, yêu cầu của cơ quan có thẩm quyền, giải quyết tranh chấp, bảo vệ quyền lợi hợp pháp của Vsoftware, khách hàng hoặc bên liên quan.
              </p>

              <h2>IV. Bảo mật và lưu trữ dữ liệu</h2>

              <h3>1. Cam kết bảo vệ dữ liệu khách hàng</h3>
              <p>
                Vsoftware áp dụng các biện pháp kỹ thuật và quản trị phù hợp để bảo vệ thông tin cá nhân, dữ liệu doanh nghiệp và dữ liệu sử dụng dịch vụ của khách hàng. Các biện pháp bảo mật có thể bao gồm:
              </p>
              <ul>
                <li>Mã hóa dữ liệu khi truyền tải qua giao thức bảo mật.</li>
                <li>Phân quyền truy cập theo vai trò.</li>
                <li>Kiểm soát tài khoản nội bộ có quyền xử lý dữ liệu.</li>
                <li>Theo dõi nhật ký truy cập và thao tác hệ thống.</li>
                <li>Sao lưu dữ liệu theo chính sách vận hành.</li>
                <li>Cập nhật và kiểm tra hệ thống định kỳ.</li>
                <li>Giới hạn quyền truy cập dữ liệu theo nhu cầu công việc.</li>
              </ul>

              <h3>2. Nguyên tắc truy cập dữ liệu nội bộ</h3>
              <p>
                Không phải toàn bộ nhân sự Vsoftware đều có quyền truy cập dữ liệu khách hàng. Việc truy cập chỉ được giới hạn cho các bộ phận hoặc nhân sự có trách nhiệm liên quan, ví dụ như kỹ thuật, chăm sóc khách hàng, triển khai dự án hoặc quản trị hệ thống.
              </p>
              <p>
                Nhân sự được cấp quyền truy cập dữ liệu phải tuân thủ nguyên tắc bảo mật nội bộ và chỉ được sử dụng dữ liệu trong phạm vi công việc được giao.
              </p>

              <h3>3. Thời gian lưu trữ dữ liệu</h3>
              <p>
                Vsoftware lưu trữ dữ liệu trong thời gian cần thiết để cung cấp dịch vụ, hỗ trợ khách hàng, đáp ứng nghĩa vụ hợp đồng, nghĩa vụ pháp lý hoặc xử lý các vấn đề phát sinh liên quan đến dịch vụ.
              </p>
              <p>
                Khi dữ liệu không còn cần thiết hoặc khách hàng có yêu cầu hợp lệ về việc xóa dữ liệu, Vsoftware sẽ xem xét và thực hiện theo quy trình phù hợp, trừ trường hợp pháp luật yêu cầu tiếp tục lưu trữ.
              </p>

              <h2>V. Chia sẻ thông tin với bên thứ ba</h2>

              <h3>1. Vsoftware không bán dữ liệu khách hàng</h3>
              <p>
                Vsoftware không bán, trao đổi hoặc chuyển nhượng thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại. Dữ liệu khách hàng chỉ được sử dụng trong phạm vi phục vụ dịch vụ, hỗ trợ vận hành, cải thiện sản phẩm hoặc tuân thủ quy định pháp luật.
              </p>

              <h3>2. Trường hợp có thể chia sẻ dữ liệu</h3>
              <p>Trong một số trường hợp cần thiết, Vsoftware có thể chia sẻ dữ liệu với bên thứ ba trong phạm vi giới hạn, bao gồm:</p>
              <ul>
                <li>Nhà cung cấp hạ tầng lưu trữ.</li>
                <li>Đơn vị gửi email, tin nhắn hoặc thông báo hệ thống.</li>
                <li>Cổng thanh toán hoặc đơn vị xử lý giao dịch.</li>
                <li>Đối tác kỹ thuật hỗ trợ triển khai hoặc bảo trì hệ thống.</li>
                <li>Cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp.</li>
              </ul>
              <p>
                Việc chia sẻ dữ liệu, nếu có, chỉ được thực hiện trong phạm vi cần thiết để vận hành dịch vụ hoặc tuân thủ nghĩa vụ pháp lý.
              </p>

              <h3>3. Trách nhiệm của bên thứ ba</h3>
              <p>
                Vsoftware ưu tiên làm việc với các nhà cung cấp và đối tác có năng lực bảo mật phù hợp. Tuy nhiên, trong trường hợp khách hàng tự kết nối phần mềm Vsoftware với nền tảng bên ngoài, khách hàng cần đọc và hiểu chính sách bảo mật của nền tảng đó trước khi sử dụng.
              </p>

              <h2>VI. Cookie và công nghệ theo dõi</h2>

              <h3>1. Cookie được sử dụng để cải thiện trải nghiệm website</h3>
              <p>
                Website Vsoftware có thể sử dụng cookie hoặc công nghệ tương tự để ghi nhớ tùy chọn người dùng, phân tích hành vi truy cập và cải thiện trải nghiệm website. Cookie có thể hỗ trợ:
              </p>
              <ul>
                <li>Ghi nhớ phiên truy cập.</li>
                <li>Phân tích lưu lượng truy cập.</li>
                <li>Đo hiệu quả nội dung.</li>
                <li>Tối ưu giao diện website.</li>
                <li>Tăng cường bảo mật.</li>
                <li>Cá nhân hóa trải nghiệm trong phạm vi phù hợp.</li>
              </ul>

              <h3>2. Người dùng có thể quản lý cookie</h3>
              <p>
                Người dùng có thể điều chỉnh cài đặt trình duyệt để từ chối hoặc xóa cookie. Tuy nhiên, một số tính năng trên website có thể hoạt động không đầy đủ nếu cookie bị tắt.
              </p>

              <h2>VII. Quyền của khách hàng đối với dữ liệu cá nhân</h2>

              <h3>1. Quyền truy cập và chỉnh sửa thông tin</h3>
              <p>
                Khách hàng có quyền yêu cầu Vsoftware cung cấp thông tin liên quan đến dữ liệu cá nhân đang được lưu trữ trong phạm vi phù hợp.
              </p>
              <p>
                Nếu thông tin cá nhân không chính xác hoặc cần cập nhật, khách hàng có thể yêu cầu chỉnh sửa để đảm bảo dữ liệu được xử lý đúng.
              </p>

              <h3>2. Quyền yêu cầu xóa hoặc hạn chế xử lý dữ liệu</h3>
              <p>
                Khách hàng có thể yêu cầu Vsoftware xóa, hạn chế xử lý hoặc ngừng sử dụng một số dữ liệu cá nhân trong trường hợp phù hợp với quy định pháp luật và điều kiện vận hành dịch vụ.
              </p>
              <p>
                Một số dữ liệu có thể cần được lưu trữ trong thời gian nhất định để phục vụ nghĩa vụ pháp lý, bảo mật, kế toán, hợp đồng hoặc giải quyết tranh chấp.
              </p>

              <h3>3. Quyền rút lại sự đồng ý</h3>
              <p>
                Trong trường hợp việc xử lý dữ liệu dựa trên sự đồng ý của khách hàng, khách hàng có quyền rút lại sự đồng ý đó bằng cách liên hệ với Vsoftware.
              </p>
              <p>
                Việc rút lại sự đồng ý có thể ảnh hưởng đến một số tính năng, dịch vụ hoặc khả năng hỗ trợ của Vsoftware.
              </p>

              <h3>4. Quyền từ chối nhận thông tin marketing</h3>
              <p>
                Khách hàng có thể từ chối nhận email marketing, thông tin khuyến mại hoặc thông báo không liên quan trực tiếp đến dịch vụ đang sử dụng.
              </p>
              <p>
                Vsoftware vẫn có thể gửi các thông báo bắt buộc liên quan đến tài khoản, bảo mật, vận hành hệ thống hoặc nghĩa vụ hợp đồng.
              </p>

              <h2>VIII. Trách nhiệm của khách hàng khi sử dụng dịch vụ</h2>

              <h3>1. Bảo vệ tài khoản truy cập</h3>
              <p>
                Khách hàng có trách nhiệm bảo mật tài khoản, mật khẩu và các thông tin đăng nhập được cấp khi sử dụng phần mềm hoặc dịch vụ của Vsoftware.
              </p>
              <p>
                Khách hàng không nên chia sẻ tài khoản cho người không có thẩm quyền và cần thông báo ngay cho Vsoftware nếu phát hiện dấu hiệu truy cập trái phép.
              </p>

              <h3>2. Cung cấp dữ liệu hợp pháp</h3>
              <p>
                Khách hàng chịu trách nhiệm đảm bảo dữ liệu cung cấp cho Vsoftware hoặc nhập vào hệ thống là dữ liệu hợp pháp, có quyền sử dụng và không vi phạm quyền riêng tư, quyền sở hữu trí tuệ hoặc quy định pháp luật liên quan.
              </p>

              <h3>3. Phân quyền người dùng nội bộ</h3>
              <p>
                Với các doanh nghiệp sử dụng phần mềm nhiều tài khoản, khách hàng cần phân quyền phù hợp cho nhân sự nội bộ. Việc cấp quyền quá rộng có thể làm tăng rủi ro lộ lọt dữ liệu hoặc thao tác sai trên hệ thống.
              </p>

              <h2>IX. Nghiêm cấm</h2>

              <h3>1. Nghiêm cấm sử dụng dịch vụ để thu thập dữ liệu trái phép</h3>
              <p>
                Khách hàng không được sử dụng website, phần mềm hoặc dịch vụ của Vsoftware để thu thập, lưu trữ, xử lý hoặc phát tán dữ liệu cá nhân trái phép. Các hành vi bị nghiêm cấm bao gồm:
              </p>
              <ul>
                <li>Thu thập dữ liệu người dùng khi chưa có quyền hợp pháp.</li>
                <li>Sử dụng dữ liệu cho mục đích lừa đảo, spam hoặc quấy rối.</li>
                <li>Tải lên hệ thống dữ liệu vi phạm pháp luật.</li>
                <li>Sử dụng phần mềm để xâm nhập, khai thác hoặc làm gián đoạn hệ thống khác.</li>
                <li>Cố tình vượt quyền truy cập hoặc khai thác lỗ hổng bảo mật.</li>
              </ul>

              <h3>2. Nghiêm cấm can thiệp trái phép vào hệ thống</h3>
              <p>
                Khách hàng không được thực hiện các hành vi gây hại đến hạ tầng, phần mềm, máy chủ hoặc dữ liệu của Vsoftware và người dùng khác.
              </p>
              <p>
                Các hành vi như tấn công mạng, dò quét lỗ hổng, phát tán mã độc, giả mạo tài khoản hoặc cố tình làm gián đoạn dịch vụ đều bị nghiêm cấm.
              </p>

              <h2>X. Bảo mật dữ liệu khi tích hợp hệ thống</h2>

              <h3>1. Tích hợp cần tuân thủ nguyên tắc phân quyền</h3>
              <p>
                Khi khách hàng kết nối phần mềm Vsoftware với hệ thống khác như CRM, website, fanpage, email, công cụ quản lý bán hàng hoặc nền tảng bên thứ ba, dữ liệu có thể được trao đổi giữa các hệ thống theo cấu hình của khách hàng.
              </p>
              <p>
                Vsoftware khuyến nghị khách hàng chỉ cấp quyền cần thiết, không chia sẻ khóa API hoặc tài khoản quản trị cho người không có trách nhiệm.
              </p>

              <h3>2. Dữ liệu từ nền tảng bên thứ ba</h3>
              <p>
                Khi sử dụng tích hợp với nền tảng bên thứ ba, một phần dữ liệu có thể chịu sự điều chỉnh bởi chính sách bảo mật và điều khoản của nền tảng đó.
              </p>
              <p>
                Khách hàng cần kiểm tra quyền truy cập, phạm vi dữ liệu và điều kiện sử dụng trước khi kích hoạt các tích hợp bên ngoài.
              </p>

              <h2>XI. Thay đổi chính sách bảo mật</h2>

              <h3>1. Chính sách có thể được cập nhật theo thời gian</h3>
              <p>
                Vsoftware có thể cập nhật chính sách bảo mật này để phù hợp với thay đổi về sản phẩm, dịch vụ, quy trình vận hành hoặc yêu cầu pháp luật.
              </p>
              <p>
                Phiên bản cập nhật sẽ được đăng tải trên website Vsoftware và có hiệu lực kể từ thời điểm được công bố, trừ khi có thông báo khác.
              </p>

              <h3>2. Khách hàng nên kiểm tra chính sách định kỳ</h3>
              <p>
                Khách hàng nên kiểm tra chính sách bảo mật định kỳ để nắm được các thay đổi mới nhất. Việc tiếp tục sử dụng website, phần mềm hoặc dịch vụ của Vsoftware sau khi chính sách được cập nhật được hiểu là khách hàng đã đọc và đồng ý với nội dung mới trong phạm vi pháp luật cho phép.
              </p>

              <h2>XII. Liên hệ về chính sách bảo mật</h2>
              <p>
                Nếu có câu hỏi, yêu cầu chỉnh sửa dữ liệu, yêu cầu xóa thông tin hoặc cần hỗ trợ liên quan đến chính sách bảo mật, khách hàng có thể liên hệ Vsoftware qua các kênh chính thức:
              </p>
              <ul>
                <li><strong>Hotline:</strong> 0914 888 678</li>
                <li><strong>Website:</strong> vsoftware.vn</li>
                <li><strong>Trụ sở:</strong> 35 Lê Văn Thiêm, Thanh Xuân, Hà Nội</li>
                <li><strong>Form liên hệ:</strong> <Link href="/lien-he" className="text-vs-blue hover:text-vs-blue-dark">vsoftware.vn/lien-he</Link></li>
              </ul>
              <p>
                Vsoftware sẽ tiếp nhận và xử lý yêu cầu trong phạm vi phù hợp với quy định pháp luật, điều kiện vận hành dịch vụ và thông tin khách hàng cung cấp.
              </p>
            </div>

            {/* Related */}
            <div className="mt-12 pt-8 border-t border-vs-gray-200">
              <div className="text-[13px] font-extrabold tracking-[0.1em] uppercase text-vs-gray-500 mb-3">Tài liệu liên quan</div>
              <Link href="/dieu-khoan-su-dung" className="inline-flex items-center gap-2 text-[15px] font-extrabold text-vs-blue hover:text-vs-blue-dark no-underline">
                📜 Điều khoản sử dụng Vsoftware →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CTASection
        title="Cần hỗ trợ thêm về dữ liệu cá nhân?"
        description="Đội ngũ Vsoftware sẵn sàng tư vấn các vấn đề liên quan đến bảo mật, quyền riêng tư và xử lý dữ liệu của khách hàng."
        primaryLabel="Liên hệ Vsoftware"
        primaryHref="/lien-he"
        secondaryLabel="Chat Zalo ngay"
        secondaryHref="https://zalo.me/vsoftware"
      />
    </>
  )
}
