import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng Vsoftware | Quy Định Dịch Vụ Phần Mềm',
  description:
    'Điều khoản sử dụng Vsoftware quy định quyền, trách nhiệm, thanh toán, bảo mật, sở hữu trí tuệ và phạm vi sử dụng dịch vụ phần mềm.',
  keywords: ['điều khoản sử dụng Vsoftware', 'điều khoản dịch vụ', 'quy định sử dụng dịch vụ', 'điều kiện sử dụng website', 'điều khoản phần mềm'],
  alternates: { canonical: '/dieu-khoan-su-dung' },
  openGraph: {
    title: 'Điều Khoản Sử Dụng Vsoftware | Quy Định Dịch Vụ Phần Mềm',
    description: 'Điều khoản sử dụng Vsoftware quy định quyền, trách nhiệm, thanh toán, bảo mật, sở hữu trí tuệ và phạm vi sử dụng dịch vụ phần mềm.',
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
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-vs-gray-200">
              <span className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-[0.1em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full">
                📜 Văn bản pháp lý
              </span>
              <span className="text-[13px] text-vs-gray-500">
                Cập nhật lần cuối: <strong className="text-vs-dark">06/06/2026</strong>
              </span>
            </div>

            <div className="prose prose-vs max-w-none prose-headings:font-extrabold prose-headings:text-vs-dark prose-h2:text-[26px] prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-vs-gray-200 prose-h3:text-[19px] prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-vs-blue prose-p:text-[15.5px] prose-p:leading-[1.85] prose-p:text-vs-gray-700 prose-ul:text-[15.5px] prose-ul:leading-[1.85] prose-li:text-vs-gray-700 prose-li:my-1 prose-strong:text-vs-dark">
              <p className="text-[17px] leading-[1.8] text-vs-gray-700">
                <strong>Điều khoản sử dụng Vsoftware</strong> quy định các nguyên tắc, quyền và trách nhiệm của khách hàng khi truy cập website, đăng ký tư vấn, sử dụng phần mềm, dịch vụ triển khai hoặc các giải pháp công nghệ do Vsoftware cung cấp.
              </p>
              <p>
                Khi truy cập website, đăng ký tài khoản, gửi thông tin tư vấn hoặc sử dụng bất kỳ sản phẩm, phần mềm, nền tảng, công cụ, dịch vụ triển khai nào của Vsoftware, khách hàng được hiểu là đã đọc, hiểu và đồng ý tuân thủ các điều khoản được nêu trong văn bản này.
              </p>

              <h2>I. Phạm vi áp dụng</h2>

              <h3>1. Áp dụng cho website, phần mềm và dịch vụ của Vsoftware</h3>
              <p>
                Điều khoản sử dụng này áp dụng cho toàn bộ hoạt động truy cập, đăng ký, dùng thử, sử dụng phần mềm, dịch vụ tư vấn, dịch vụ triển khai, hỗ trợ kỹ thuật và các giải pháp công nghệ do Vsoftware cung cấp.
              </p>
              <p>
                Các điều khoản này cũng áp dụng cho những tính năng, module, bản cập nhật, tài liệu hướng dẫn, nội dung đào tạo, API, tích hợp hệ thống hoặc dịch vụ liên quan được Vsoftware phát triển, vận hành hoặc bàn giao cho khách hàng.
              </p>

              <h3>2. Đối tượng áp dụng</h3>
              <p>Điều khoản sử dụng áp dụng cho:</p>
              <ul>
                <li>Khách hàng cá nhân truy cập website Vsoftware.</li>
                <li>Doanh nghiệp đăng ký tư vấn hoặc sử dụng phần mềm của Vsoftware.</li>
                <li>Người dùng được doanh nghiệp cấp tài khoản truy cập hệ thống.</li>
                <li>Đối tác, đại lý hoặc đơn vị phối hợp triển khai dịch vụ.</li>
                <li>Bất kỳ tổ chức, cá nhân nào sử dụng sản phẩm, dịch vụ hoặc tài liệu của Vsoftware.</li>
              </ul>

              <h2>II. Chấp nhận điều khoản</h2>

              <h3>1. Đồng ý khi sử dụng dịch vụ</h3>
              <p>
                Khi sử dụng website, phần mềm hoặc dịch vụ của Vsoftware, khách hàng đồng ý tuân thủ điều khoản sử dụng này và các chính sách liên quan được công bố trên website hoặc trong hợp đồng, phụ lục, báo giá, đề xuất triển khai.
              </p>
              <p>
                Nếu khách hàng không đồng ý với bất kỳ nội dung nào trong điều khoản sử dụng, khách hàng nên ngừng truy cập, không đăng ký tài khoản và không tiếp tục sử dụng dịch vụ của Vsoftware.
              </p>

              <h3>2. Điều khoản có thể được cập nhật theo thời gian</h3>
              <p>
                Vsoftware có thể cập nhật điều khoản sử dụng để phù hợp với thay đổi về sản phẩm, dịch vụ, chính sách vận hành hoặc yêu cầu pháp luật. Phiên bản mới sẽ được đăng tải trên website hoặc thông báo qua kênh phù hợp.
              </p>
              <p>
                Việc khách hàng tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật được hiểu là khách hàng đã đọc và đồng ý với phiên bản mới trong phạm vi pháp luật cho phép.
              </p>

              <h2>III. Tài khoản và trách nhiệm của người dùng</h2>

              <h3>1. Cung cấp thông tin chính xác</h3>
              <p>
                Khi đăng ký tài khoản, đăng ký tư vấn hoặc sử dụng dịch vụ, khách hàng cần cung cấp thông tin chính xác, đầy đủ và cập nhật khi có thay đổi.
              </p>
              <p>
                Thông tin đăng ký có thể bao gồm họ tên, số điện thoại, email, tên doanh nghiệp, chức vụ, nhu cầu sử dụng dịch vụ hoặc các thông tin cần thiết khác để Vsoftware tư vấn, hỗ trợ và cung cấp dịch vụ phù hợp.
              </p>

              <h3>2. Bảo mật tài khoản đăng nhập</h3>
              <p>
                Khách hàng chịu trách nhiệm bảo mật tài khoản, mật khẩu, mã xác thực, khóa API hoặc các thông tin truy cập được Vsoftware cấp trong quá trình sử dụng dịch vụ.
              </p>
              <p>
                Khách hàng không nên chia sẻ tài khoản cho người không có thẩm quyền. Nếu phát hiện tài khoản bị truy cập trái phép, bị lộ thông tin đăng nhập hoặc có dấu hiệu bất thường, khách hàng cần thông báo ngay cho Vsoftware để được hỗ trợ xử lý.
              </p>

              <h3>3. Chịu trách nhiệm với hoạt động phát sinh từ tài khoản</h3>
              <p>
                Mọi thao tác được thực hiện thông qua tài khoản của khách hàng sẽ được xem là hoạt động phát sinh từ người dùng hoặc tổ chức sở hữu tài khoản, trừ khi có bằng chứng rõ ràng về lỗi hệ thống hoặc truy cập trái phép không do khách hàng gây ra.
              </p>
              <p>
                Khách hàng cần phân quyền nội bộ phù hợp, đặc biệt với các tài khoản quản trị, tài khoản có quyền xem dữ liệu, chỉnh sửa cấu hình, xuất dữ liệu hoặc kết nối hệ thống bên thứ ba.
              </p>

              <h2>IV. Phạm vi dịch vụ của Vsoftware</h2>

              <h3>1. Vsoftware cung cấp phần mềm và giải pháp công nghệ</h3>
              <p>
                Vsoftware cung cấp các sản phẩm phần mềm, giải pháp tự động hóa, dịch vụ thiết kế phần mềm theo yêu cầu, dịch vụ thiết kế AI Agent theo yêu cầu, tích hợp hệ thống, tư vấn vận hành và hỗ trợ triển khai công nghệ cho doanh nghiệp.
              </p>
              <p>
                Tùy từng sản phẩm hoặc gói dịch vụ, phạm vi cung cấp có thể bao gồm phần mềm SaaS, hệ thống tùy chỉnh, dashboard quản trị, API, workflow tự động hóa, module AI, tài liệu hướng dẫn, đào tạo sử dụng hoặc hỗ trợ kỹ thuật.
              </p>

              <h3>2. Tính năng có thể được cập nhật hoặc điều chỉnh</h3>
              <p>
                Vsoftware có quyền cập nhật, nâng cấp, bổ sung, thay đổi hoặc tạm ngừng một số tính năng nhằm cải thiện chất lượng dịch vụ, tăng tính bảo mật, tối ưu hiệu suất hoặc đáp ứng yêu cầu vận hành.
              </p>
              <p>
                Với những thay đổi lớn có thể ảnh hưởng trực tiếp đến quá trình sử dụng dịch vụ của khách hàng, Vsoftware sẽ cố gắng thông báo trước qua website, email, hệ thống phần mềm hoặc kênh liên hệ phù hợp.
              </p>

              <h3>3. Dịch vụ triển khai theo thỏa thuận riêng</h3>
              <p>
                Với các dự án phần mềm theo yêu cầu, AI Agent theo yêu cầu, tích hợp hệ thống hoặc dịch vụ triển khai riêng, phạm vi công việc, thời gian thực hiện, chi phí, đầu việc bàn giao, điều kiện nghiệm thu và trách nhiệm hai bên sẽ được quy định trong hợp đồng, báo giá hoặc phụ lục triển khai.
              </p>
              <p>
                Điều khoản sử dụng này đóng vai trò nguyên tắc chung. Trong trường hợp có nội dung khác biệt giữa điều khoản sử dụng và hợp đồng đã ký, nội dung trong hợp đồng hoặc phụ lục cụ thể sẽ được ưu tiên áp dụng cho dự án đó.
              </p>

              <h2>V. Quy định sử dụng dịch vụ</h2>

              <h3>1. Sử dụng dịch vụ đúng mục đích</h3>
              <p>
                Khách hàng chỉ được sử dụng website, phần mềm, tài khoản, tài liệu và dịch vụ của Vsoftware cho mục đích hợp pháp, phù hợp với thỏa thuận giữa hai bên và không vi phạm quyền lợi của Vsoftware, người dùng khác hoặc bên thứ ba.
              </p>
              <p>
                Khách hàng không được sử dụng dịch vụ để thực hiện hành vi gian lận, phát tán nội dung độc hại, thu thập dữ liệu trái phép, tấn công hệ thống, spam, lừa đảo hoặc bất kỳ hoạt động nào vi phạm quy định pháp luật.
              </p>

              <h3>2. Không can thiệp trái phép vào hệ thống</h3>
              <p>
                Khách hàng không được thực hiện các hành vi gây ảnh hưởng đến hạ tầng, máy chủ, cơ sở dữ liệu, mã nguồn, giao diện, API hoặc hệ thống vận hành của Vsoftware. Các hành vi bị nghiêm cấm bao gồm:
              </p>
              <ul>
                <li>Dò quét lỗ hổng bảo mật.</li>
                <li>Tấn công từ chối dịch vụ.</li>
                <li>Tải lên mã độc hoặc phần mềm gây hại.</li>
                <li>Cố tình vượt quyền truy cập.</li>
                <li>Can thiệp trái phép vào dữ liệu.</li>
                <li>Sao chép, khai thác hoặc phân phối mã nguồn khi chưa được phép.</li>
                <li>Sử dụng công cụ tự động để gây quá tải hệ thống.</li>
              </ul>

              <h3>3. Tuân thủ giới hạn sử dụng</h3>
              <p>
                Một số gói dịch vụ có thể đi kèm giới hạn về số người dùng, dung lượng lưu trữ, số lượt xử lý, số tin nhắn, số workflow, số API call, số tài khoản hoặc các thông số kỹ thuật khác.
              </p>
              <p>
                Khách hàng cần sử dụng dịch vụ trong phạm vi gói đã đăng ký hoặc thỏa thuận đã ký với Vsoftware. Trường hợp nhu cầu sử dụng vượt giới hạn, khách hàng có thể cần nâng cấp gói, bổ sung tài nguyên hoặc ký thỏa thuận mở rộng.
              </p>

              <h2>VI. Nội dung và dữ liệu do khách hàng cung cấp</h2>

              <h3>1. Khách hàng chịu trách nhiệm về dữ liệu đầu vào</h3>
              <p>
                Trong quá trình sử dụng dịch vụ, khách hàng có thể cung cấp dữ liệu như thông tin khách hàng, tài liệu nội bộ, dữ liệu sản phẩm, dữ liệu bán hàng, dữ liệu marketing, nội dung đào tạo AI, kịch bản tư vấn hoặc dữ liệu vận hành.
              </p>
              <p>
                Khách hàng chịu trách nhiệm đảm bảo dữ liệu cung cấp cho Vsoftware là hợp pháp, có quyền sử dụng và không vi phạm quyền riêng tư, quyền sở hữu trí tuệ hoặc quyền lợi hợp pháp của bên thứ ba.
              </p>

              <h3>2. Vsoftware xử lý dữ liệu để cung cấp dịch vụ</h3>
              <p>
                Vsoftware có thể xử lý dữ liệu khách hàng trong phạm vi cần thiết để cung cấp dịch vụ, vận hành phần mềm, cấu hình hệ thống, hỗ trợ kỹ thuật, đào tạo AI Agent, tích hợp workflow hoặc xử lý yêu cầu của khách hàng.
              </p>
              <p>
                Vsoftware không bán dữ liệu khách hàng cho bên thứ ba vì mục đích thương mại. Việc xử lý dữ liệu được thực hiện theo <Link href="/chinh-sach-bao-mat" className="text-vs-blue hover:text-vs-blue-dark">chính sách bảo mật</Link> và các thỏa thuận liên quan giữa hai bên.
              </p>

              <h3>3. Khách hàng cần kiểm duyệt nội dung trước khi sử dụng</h3>
              <p>
                Với các tính năng có sử dụng AI, tự động hóa hoặc tạo nội dung, khách hàng cần rà soát, kiểm chứng và chịu trách nhiệm với nội dung trước khi xuất bản, gửi cho khách hàng cuối hoặc sử dụng trong hoạt động kinh doanh.
              </p>
              <p>
                Vsoftware cung cấp công cụ hỗ trợ, không thay thế hoàn toàn trách nhiệm kiểm duyệt, phê duyệt, tuân thủ pháp lý và quản trị thương hiệu của khách hàng.
              </p>

              <h2>VII. Thanh toán và phí dịch vụ</h2>

              <h3>1. Phí dịch vụ được quy định theo gói hoặc thỏa thuận</h3>
              <p>
                Phí sử dụng phần mềm, phí triển khai, phí tích hợp, phí tư vấn, phí đào tạo, phí bảo trì hoặc các khoản phí liên quan sẽ được công bố trên website, báo giá, hợp đồng, phụ lục hoặc thỏa thuận riêng giữa Vsoftware và khách hàng.
              </p>
              <p>
                Tùy từng dịch vụ, phí có thể được tính theo tháng, theo năm, theo số lượng tài khoản, số lượng tính năng, số lượng workflow, số lượt xử lý, phạm vi triển khai hoặc khối lượng công việc thực tế.
              </p>

              <h3>2. Kích hoạt dịch vụ sau khi thanh toán</h3>
              <p>
                Các gói trả phí hoặc dự án triển khai sẽ được kích hoạt theo điều kiện thanh toán đã thống nhất. Vsoftware có thể tạm ngừng kích hoạt, tạm dừng dịch vụ hoặc giới hạn quyền sử dụng nếu khách hàng chưa hoàn tất nghĩa vụ thanh toán đúng hạn.
              </p>
              <p>
                Đối với các dự án triển khai theo hợp đồng, tiến độ thực hiện có thể phụ thuộc vào lịch thanh toán, việc cung cấp dữ liệu, phản hồi nghiệm thu và phối hợp từ phía khách hàng.
              </p>

              <h3>3. Gia hạn, nâng cấp hoặc hạ gói dịch vụ</h3>
              <p>
                Việc gia hạn, nâng cấp, hạ gói hoặc thay đổi phạm vi dịch vụ sẽ tuân theo chính sách hiện hành tại thời điểm khách hàng thực hiện giao dịch hoặc theo thỏa thuận cụ thể giữa hai bên.
              </p>
              <p>
                Khách hàng nên kiểm tra kỹ chi phí, quyền lợi, giới hạn sử dụng và điều kiện áp dụng trước khi thay đổi gói dịch vụ.
              </p>

              <h2>VIII. Quyền sở hữu trí tuệ</h2>

              <h3>1. Tài sản trí tuệ của Vsoftware</h3>
              <p>
                Toàn bộ thương hiệu, logo, giao diện, mã nguồn, tài liệu kỹ thuật, thiết kế hệ thống, quy trình triển khai, nội dung hướng dẫn, cấu trúc phần mềm, mô hình vận hành và các tài sản trí tuệ khác do Vsoftware phát triển thuộc quyền sở hữu của Vsoftware hoặc bên cấp quyền hợp pháp cho Vsoftware.
              </p>
              <p>
                Khách hàng không được sao chép, chỉnh sửa, phân phối, bán lại, cho thuê, chuyển nhượng hoặc khai thác các tài sản này ngoài phạm vi được Vsoftware cho phép bằng văn bản.
              </p>

              <h3>2. Dữ liệu và nội dung của khách hàng</h3>
              <p>
                Dữ liệu, tài liệu, nội dung, thông tin doanh nghiệp hoặc nội dung do khách hàng tạo ra trong quá trình sử dụng dịch vụ vẫn thuộc quyền sở hữu hoặc quyền sử dụng hợp pháp của khách hàng.
              </p>
              <p>
                Vsoftware chỉ được quyền xử lý dữ liệu đó trong phạm vi cần thiết để cung cấp dịch vụ, hỗ trợ kỹ thuật, vận hành hệ thống hoặc thực hiện các nghĩa vụ đã thỏa thuận.
              </p>

              <h3>3. Nội dung tạo ra bằng công cụ AI hoặc phần mềm</h3>
              <p>
                Với các nội dung được tạo ra bằng công cụ AI, phần mềm hoặc workflow do Vsoftware cung cấp, khách hàng có trách nhiệm kiểm tra, chỉnh sửa và đảm bảo việc sử dụng nội dung không vi phạm pháp luật, quyền sở hữu trí tuệ, quyền riêng tư hoặc quy định nền tảng bên thứ ba.
              </p>
              <p>
                Vsoftware không chịu trách nhiệm cho việc khách hàng sử dụng nội dung tạo ra từ hệ thống vào mục đích vi phạm pháp luật hoặc gây tranh chấp với bên thứ ba.
              </p>

              <h2>IX. Bảo mật, an toàn dữ liệu và quyền riêng tư</h2>

              <h3>1. Vsoftware áp dụng biện pháp bảo mật phù hợp</h3>
              <p>
                Vsoftware nỗ lực áp dụng các biện pháp kỹ thuật và quản trị phù hợp để bảo vệ dữ liệu khách hàng, tài khoản người dùng và hệ thống vận hành.
              </p>
              <p>
                Các biện pháp bảo mật có thể bao gồm phân quyền truy cập, mã hóa truyền tải, giám sát nhật ký hệ thống, giới hạn quyền truy cập nội bộ, sao lưu dữ liệu và kiểm tra bảo mật định kỳ.
              </p>

              <h3>2. Khách hàng cần phối hợp bảo mật</h3>
              <p>
                Bảo mật hệ thống không chỉ phụ thuộc vào Vsoftware mà còn phụ thuộc vào cách khách hàng quản lý tài khoản, phân quyền nhân sự, lưu trữ mật khẩu, chia sẻ khóa API và sử dụng thiết bị truy cập.
              </p>
              <p>
                Khách hàng cần chủ động bảo vệ thông tin đăng nhập, không chia sẻ tài khoản cho người không có thẩm quyền và thông báo kịp thời nếu phát hiện rủi ro bảo mật.
              </p>

              <h3>3. Chính sách bảo mật là tài liệu liên quan</h3>
              <p>
                Việc thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân, dữ liệu doanh nghiệp hoặc dữ liệu phát sinh trong quá trình sử dụng dịch vụ được quy định chi tiết hơn trong <Link href="/chinh-sach-bao-mat" className="text-vs-blue hover:text-vs-blue-dark">Chính Sách Bảo Mật của Vsoftware</Link>.
              </p>
              <p>
                Khách hàng nên đọc chính sách bảo mật cùng với điều khoản sử dụng này để hiểu đầy đủ quyền và trách nhiệm liên quan đến dữ liệu.
              </p>

              <h2>X. Tạm ngừng hoặc chấm dứt dịch vụ</h2>

              <h3>1. Trường hợp Vsoftware có thể tạm ngừng dịch vụ</h3>
              <p>Vsoftware có thể tạm ngừng hoặc giới hạn dịch vụ trong một số trường hợp cần thiết, bao gồm:</p>
              <ul>
                <li>Bảo trì, nâng cấp hoặc xử lý sự cố hệ thống.</li>
                <li>Khách hàng vi phạm điều khoản sử dụng.</li>
                <li>Khách hàng chậm thanh toán hoặc không hoàn tất nghĩa vụ tài chính.</li>
                <li>Có dấu hiệu tài khoản bị lạm dụng, tấn công hoặc truy cập trái phép.</li>
                <li>Có yêu cầu từ cơ quan có thẩm quyền.</li>
                <li>Dịch vụ bị ảnh hưởng bởi sự cố ngoài khả năng kiểm soát.</li>
              </ul>

              <h3>2. Chấm dứt sử dụng dịch vụ</h3>
              <p>
                Trong trường hợp phù hợp, Vsoftware sẽ cố gắng thông báo trước cho khách hàng về việc tạm ngừng dịch vụ, trừ các tình huống khẩn cấp liên quan đến bảo mật, pháp lý hoặc an toàn hệ thống.
              </p>
              <p>
                Khách hàng có thể chấm dứt sử dụng dịch vụ theo điều kiện của gói dịch vụ, hợp đồng hoặc thỏa thuận đã ký với Vsoftware.
              </p>
              <p>
                Vsoftware có thể chấm dứt hoặc từ chối tiếp tục cung cấp dịch vụ nếu khách hàng vi phạm nghiêm trọng điều khoản sử dụng, sử dụng dịch vụ cho mục đích trái pháp luật hoặc gây ảnh hưởng đến hệ thống, khách hàng khác hoặc uy tín của Vsoftware.
              </p>

              <h2>XI. Giới hạn trách nhiệm</h2>

              <h3>1. Vsoftware nỗ lực duy trì dịch vụ ổn định</h3>
              <p>
                Vsoftware nỗ lực đảm bảo hệ thống vận hành ổn định, an toàn và đáp ứng nhu cầu sử dụng hợp lý của khách hàng. Tuy nhiên, Vsoftware không cam kết dịch vụ sẽ luôn không gián đoạn, không lỗi hoặc phù hợp tuyệt đối với mọi mục đích riêng biệt nếu các mục đích đó chưa được thỏa thuận rõ.
              </p>

              <h3>2. Không chịu trách nhiệm cho thiệt hại gián tiếp ngoài phạm vi kiểm soát</h3>
              <p>
                Vsoftware không chịu trách nhiệm cho các thiệt hại gián tiếp, mất doanh thu, mất lợi nhuận, mất dữ liệu do lỗi từ phía khách hàng, sự cố hạ tầng bên thứ ba, lỗi mạng, thiên tai, tấn công mạng, thay đổi chính sách nền tảng bên thứ ba hoặc các sự kiện bất khả kháng khác ngoài khả năng kiểm soát hợp lý của Vsoftware.
              </p>

              <h3>3. Trách nhiệm được giới hạn theo thỏa thuận</h3>
              <p>
                Trong trường hợp phát sinh tranh chấp hoặc yêu cầu bồi thường, trách nhiệm của Vsoftware sẽ được xem xét theo hợp đồng, báo giá, chính sách dịch vụ, mức độ lỗi thực tế và quy định pháp luật áp dụng.
              </p>

              <h2>XII. Nghiêm cấm</h2>

              <h3>1. Nghiêm cấm sử dụng dịch vụ cho mục đích vi phạm pháp luật</h3>
              <p>
                Khách hàng không được sử dụng dịch vụ của Vsoftware để thực hiện, hỗ trợ hoặc che giấu các hành vi vi phạm pháp luật. Các hành vi bị nghiêm cấm bao gồm:
              </p>
              <ul>
                <li>Lừa đảo, giả mạo, phát tán thông tin sai lệch.</li>
                <li>Spam, quấy rối hoặc gửi nội dung không được người nhận đồng ý.</li>
                <li>Thu thập, mua bán hoặc xử lý dữ liệu cá nhân trái phép.</li>
                <li>Phát tán mã độc, tấn công mạng hoặc phá hoại hệ thống.</li>
                <li>Vi phạm bản quyền, nhãn hiệu, quyền sở hữu trí tuệ.</li>
                <li>Sử dụng phần mềm để vượt quyền, khai thác lỗ hổng hoặc đánh cắp dữ liệu.</li>
              </ul>

              <h3>2. Nghiêm cấm sao chép hoặc bán lại dịch vụ trái phép</h3>
              <p>
                Khách hàng không được sao chép, phân phối, bán lại, cho thuê, nhượng quyền, đóng gói lại hoặc khai thác thương mại phần mềm, tài liệu, giao diện, mã nguồn, API hoặc hệ thống của Vsoftware nếu chưa được Vsoftware cho phép bằng văn bản.
              </p>

              <h2>XIII. Luật áp dụng và giải quyết tranh chấp</h2>

              <h3>1. Ưu tiên thương lượng và thiện chí</h3>
              <p>
                Nếu phát sinh tranh chấp trong quá trình sử dụng dịch vụ, Vsoftware và khách hàng ưu tiên giải quyết thông qua trao đổi, thương lượng và thiện chí hợp tác.
              </p>
              <p>
                Hai bên cần cung cấp thông tin đầy đủ, chính xác và phối hợp xử lý trên tinh thần tôn trọng quyền lợi hợp pháp của nhau.
              </p>

              <h3>2. Cơ quan có thẩm quyền</h3>
              <p>
                Trong trường hợp không thể giải quyết thông qua thương lượng, tranh chấp sẽ được xử lý theo quy định pháp luật Việt Nam và bởi cơ quan có thẩm quyền phù hợp.
              </p>

              <h2>XIV. Liên hệ về điều khoản sử dụng</h2>
              <p>
                Nếu có câu hỏi về điều khoản sử dụng, phạm vi dịch vụ, tài khoản, thanh toán, dữ liệu hoặc các vấn đề liên quan, khách hàng có thể liên hệ Vsoftware qua các kênh chính thức:
              </p>
              <ul>
                <li><strong>Hotline:</strong> 0914 888 678</li>
                <li><strong>Website:</strong> vsoftware.vn</li>
                <li><strong>Trụ sở:</strong> 35 Lê Văn Thiêm, Thanh Xuân, Hà Nội</li>
                <li><strong>Form liên hệ:</strong> <Link href="/lien-he" className="text-vs-blue hover:text-vs-blue-dark">vsoftware.vn/lien-he</Link></li>
              </ul>
              <p>
                Vsoftware sẽ tiếp nhận và phản hồi yêu cầu trong phạm vi phù hợp với quy định pháp luật, điều kiện vận hành dịch vụ và thông tin khách hàng cung cấp.
              </p>
            </div>

            {/* Related */}
            <div className="mt-12 pt-8 border-t border-vs-gray-200">
              <div className="text-[13px] font-extrabold tracking-[0.1em] uppercase text-vs-gray-500 mb-3">Tài liệu liên quan</div>
              <Link href="/chinh-sach-bao-mat" className="inline-flex items-center gap-2 text-[15px] font-extrabold text-vs-blue hover:text-vs-blue-dark no-underline">
                🔒 Chính sách bảo mật Vsoftware →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CTASection
        title="Cần tư vấn về dịch vụ hoặc hợp đồng?"
        description="Đội ngũ Vsoftware sẵn sàng giải đáp các thắc mắc liên quan đến phạm vi dịch vụ, thanh toán, sở hữu trí tuệ và quyền lợi khách hàng."
        primaryLabel="Liên hệ Vsoftware"
        primaryHref="/lien-he"
        secondaryLabel="Chat Zalo ngay"
        secondaryHref="https://zalo.me/vsoftware"
      />
    </>
  )
}
