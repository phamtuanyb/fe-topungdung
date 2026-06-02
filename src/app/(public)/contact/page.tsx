"use client"

import PageHero from '@/components/common/PageHero';
import { getContactConfig, submitContact } from '@/lib/api/public';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ContactConfig } from '@/types';

const PROCESS_STEPS = [
  { num: '1', title: 'Tư vấn phân tích', desc: '30 phút gặp mặt hoặc online — nghe bài toán, phân tích quy trình hiện tại, xác định phạm vi', color: 'blue' },
  { num: '2', title: 'Đề xuất giải pháp', desc: 'Vsoftware gửi đề xuất giải pháp và báo giá chi tiết trong vòng 24 giờ làm việc', color: 'orange' },
  { num: '3', title: 'Ký hợp đồng & build', desc: 'Chốt scope, ký hợp đồng rõ ràng — tiến hành phát triển có demo từng sprint', color: 'blue' },
  { num: '4', title: 'Nghiệm thu & go-live', desc: 'Test thực tế, đào tạo nhân viên, bàn giao và hỗ trợ 90 ngày sau go-live', color: 'orange' },
]

const FAQS = [
  { q: 'Chi phí tư vấn ban đầu là bao nhiêu?', a: 'Hoàn toàn miễn phí. Buổi tư vấn phân tích 30 phút đầu tiên không tốn bất kỳ chi phí nào, kể cả khi bạn quyết định không tiếp tục. Chúng tôi chỉ tính phí khi bắt đầu phát triển dự án theo hợp đồng đã ký.' },
  { q: 'Thời gian phát triển phần mềm mất bao lâu?', a: 'Phụ thuộc vào độ phức tạp. Gói đặt lịch + quản lý cơ bản: 5–10 ngày. CRM đầy đủ với tích hợp: 3–6 tuần. App mobile on-demand: 6–12 tuần. Vsoftware cam kết timeline cụ thể trước khi ký hợp đồng.' },
  { q: 'Phần mềm có tích hợp với MISA, Zalo, ngân hàng không?', a: 'Có. Vsoftware hỗ trợ tích hợp với MISA (kế toán), Zalo OA (nhắc lịch, CSKH), các cổng thanh toán nội địa (VNPay, MoMo, ZaloPay), sàn thương mại điện tử (Shopee, Lazada, TikTok Shop) và hầu hết ngân hàng thương mại tại Việt Nam.' },
  { q: 'Sau khi bàn giao, hỗ trợ như thế nào?', a: 'Vsoftware cung cấp 90 ngày hỗ trợ sau go-live miễn phí — bao gồm sửa lỗi, điều chỉnh nhỏ và đào tạo nhân viên mới. Sau đó có gói maintenance hàng tháng hoặc theo sự cố tùy nhu cầu.' },
  { q: 'Doanh nghiệp nhỏ < 10 người có phù hợp không?', a: 'Rất phù hợp. Nhiều khách hàng của Vsoftware là doanh nghiệp 3–5 nhân viên — spa, nha khoa, cửa hàng lẻ. Chúng tôi có gói vừa đủ với chi phí SaaS từ vài trăm nghìn/tháng, không ép mua tính năng không cần.' },
]

const FALLBACK_CONFIG: ContactConfig = {
  form: {
    heading: 'Nói chuyện 30 phút — biết ngay có làm được không',
    description:
      'Không ràng buộc. Không phí tư vấn. Vsoftware sẽ phân tích bài toán và đề xuất giải pháp phù hợp nhất — dù bạn có chọn chúng tôi hay không.',
    needs: [
      'Phần mềm quản lý theo ngành (spa, nhà hàng, phòng khám...)',
      'CRM & Quản lý bán hàng',
      'App bán hàng đa kênh / Mobile App',
      'AI Agent & Automation',
      'Website & Landing Page',
      'Tích hợp hệ thống (MISA, Zalo, ngân hàng...)',
      'Tư vấn chuyển đổi số toàn diện',
      'Khác',
    ],
    submitText: 'Gửi yêu cầu tư vấn',
    noteText:
      'Vsoftware phản hồi trong vòng 2 giờ làm việc. Thông tin của bạn được bảo mật tuyệt đối.',
    successHeading: 'Đã nhận yêu cầu!',
    successText: 'Đội Vsoftware sẽ liên hệ với bạn trong vòng 2 giờ làm việc.',
  },
  quickContact: {
    heading: 'Liên hệ ngay — không cần chờ',
    description: 'Cần trao đổi nhanh? Nhắn tin hoặc gọi trực tiếp đội tư vấn Vsoftware.',
    zaloText: 'Chat Zalo OA ngay',
    zaloHref: 'https://zalo.me/0914888678',
    phoneText: 'Gọi: 0914 888 678',
    phoneHref: 'tel:+84914888678',
  },
  info: {
    sectionTitle: 'Thông tin liên hệ',
    offices: [{ name: 'Văn phòng Hà Nội', address: '35 Lê Văn Thiêm, Thanh Xuân, Hà Nội' }],
    hotlines: ['0912 345 678', '0987 654 321'],
    emails: ['hello@vsoftware.vn', 'support@vsoftware.vn'],
  },
  workingHours: {
    sectionTitle: 'Giờ làm việc',
    slots: [
      { day: 'Thứ 2 – 6', time: '8:00 – 18:00' },
      { day: 'Thứ 7', time: '8:00 – 12:00' },
      { day: 'Chủ nhật', time: 'Nghỉ' },
      { day: 'Zalo / Email', time: '24/7 auto' },
    ],
    note: 'Ngoài giờ hành chính: nhắn Zalo, đội tư vấn phản hồi trong vòng 30 phút (7:00–22:00 tất cả các ngày).',
  },
}

type FormValues = {
  name: string
  phone: string
  email: string
  company: string
  need: string
  message: string
}

export default function LienHePage() {
  const [config, setConfig] = useState<ContactConfig>(FALLBACK_CONFIG)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>()

  useEffect(() => {
    getContactConfig()
      .then((res) => { if (res.data) setConfig(res.data) })
      .catch(() => { /* keep fallback */ })
  }, [])

  async function onSubmit(data: FormValues) {
    const payload = {
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      company: data.company || '',
      need: data.need || '',
      description: data.message || '',
    }

    setLoading(true)
    try {
      const res = await submitContact(payload)
      const msg = res?.data?.message || config.form.successText
      setServerMessage(msg)
      setSubmitted(true)
      reset()
    } catch {
      setServerMessage('Không thể gửi yêu cầu. Vui lòng thử lại sau.')
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const { form, quickContact, info, workingHours } = config

  return (
    <>
      <PageHero
        title="Liên Hệ Vsoftware"
        titleEm="Hệ"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]}
      />

      <section className="py-16 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

            <div className="bg-white rounded-[20px] p-10 shadow-vs-md">
              <h2 className="text-[24px] font-extrabold text-vs-dark mb-2">{form.heading}</h2>
              <p className="text-[14.5px] text-vs-gray-600 mb-8 leading-[1.65] whitespace-pre-line">{form.description}</p>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-[48px] mb-4">✅</div>
                  <h3 className="text-[20px] font-extrabold text-vs-dark mb-2.5">{form.successHeading}</h3>
                  <p className="text-[15px] text-vs-gray-600 leading-[1.65]">{serverMessage ?? form.successText}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-[18px]">

                    <div>
                      <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Họ và tên <span className="text-vs-orange">*</span></label>
                      <input {...register('name', { required: 'Họ và tên là bắt buộc' })} type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors" />
                      {errors.name && <div className="text-[13px] text-red-500 mt-1">{errors.name.message}</div>}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Số điện thoại <span className="text-vs-orange">*</span></label>
                      <input {...register('phone', { required: 'Số điện thoại là bắt buộc', pattern: { value: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' } })} type="tel" placeholder="0912 345 678" className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors" />
                      {errors.phone && <div className="text-[13px] text-red-500 mt-1">{errors.phone.message}</div>}
                    </div>

                  </div>

                  <div className="mb-[18px]">
                    <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Email</label>
                    <input {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' } })} type="email" placeholder="email@doanhnghiep.vn" className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors" />
                    {errors.email && <div className="text-[13px] text-red-500 mt-1">{errors.email.message}</div>}
                  </div>

                  <div className="mb-[18px]">
                    <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Tên doanh nghiệp</label>
                    <input {...register('company', { required: 'Tên doanh nghiệp là bắt buộc' })} type="text" placeholder="Công ty / Cửa hàng của bạn" className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors" />
                    {errors.company && <div className="text-[13px] text-red-500 mt-1">{errors.company.message}</div>}
                  </div>

                  <div className="mb-[18px]">
                    <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Bạn đang cần <span className="text-vs-orange">*</span></label>
                    <select {...register('need', { required: 'Vui lòng chọn nhu cầu' })} className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors">
                      <option value="" disabled defaultValue="">Chọn nhu cầu...</option>
                      {form.needs.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    {errors.need && <div className="text-[13px] text-red-500 mt-1">{errors.need.message}</div>}
                  </div>

                  <div className="mb-[18px]">
                    <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Mô tả bài toán của bạn</label>
                    <textarea {...register('message', { required: 'Vui lòng mô tả ngắn gọn bài toán' })} placeholder="Doanh nghiệp bạn đang gặp vấn đề gì? Quy mô bao nhiêu người? Đang dùng công cụ nào?..." rows={4} className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors resize-y" />
                    {errors.message && <div className="text-[13px] text-red-500 mt-1">{errors.message.message}</div>}
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-4 bg-vs-blue text-white rounded-lg text-[16px] font-extrabold cursor-pointer border-none flex items-center justify-center gap-2.5 hover:bg-vs-blue-dark hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(30,91,198,0.25)] transition-all mt-2 disabled:opacity-60">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>
                    {loading ? 'Đang gửi...' : form.submitText}
                  </button>

                  <p className="text-[12px] text-vs-gray-400 text-center mt-3 leading-[1.5]">{form.noteText}</p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              <div className="bg-vs-gradient rounded-2xl p-7 text-center">
                <h3 className="text-[17px] font-extrabold text-white mb-2">{quickContact.heading}</h3>
                <p className="text-[13px] text-white/75 mb-5 leading-[1.5] whitespace-pre-line">{quickContact.description}</p>
                <div className="flex flex-col gap-2.5">
                  <a href={quickContact.zaloHref} className="flex items-center gap-2.5 px-5 py-3.5 rounded-[10px] bg-white/15 text-white border border-white/20 font-extrabold text-[14px] no-underline hover:bg-white/25 transition-all">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    {quickContact.zaloText}
                  </a>
                  <a href={quickContact.phoneHref} className="flex items-center gap-2.5 px-5 py-3.5 rounded-[10px] bg-vs-orange text-white font-extrabold text-[14px] no-underline hover:bg-vs-orange-dark transition-all">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    {quickContact.phoneText}
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-7 shadow-vs">
                <div className="text-[16px] font-extrabold text-vs-dark mb-5 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-vs-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {info.sectionTitle}
                </div>

                {info.offices.map((office, i) => (
                  <div key={i} className="flex items-start gap-3.5 mb-[18px]">
                    <div className="w-11 h-11 rounded-xl bg-vs-blue-light flex items-center justify-center flex-shrink-0 text-vs-blue">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div>
                      <strong className="text-[14px] font-extrabold text-vs-dark block mb-0.5">{office.name}</strong>
                      <span className="text-[13.5px] text-vs-gray-600">{office.address}</span>
                    </div>
                  </div>
                ))}

                {info.hotlines.length > 0 && (
                  <div className="flex items-start gap-3.5 mb-[18px]">
                    <div className="w-11 h-11 rounded-xl bg-vs-blue-light flex items-center justify-center flex-shrink-0 text-vs-blue">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <div>
                      <strong className="text-[14px] font-extrabold text-vs-dark block mb-0.5">Hotline tư vấn</strong>
                      {info.hotlines.map((tel) => (
                        <a
                          key={tel}
                          href={`tel:${tel.replace(/\s/g, '')}`}
                          className="text-[13.5px] text-vs-gray-600 no-underline block hover:text-vs-blue"
                        >
                          {tel}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {info.emails.length > 0 && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-vs-orange-light flex items-center justify-center flex-shrink-0 text-vs-orange">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div>
                      <strong className="text-[14px] font-extrabold text-vs-dark block mb-0.5">Email</strong>
                      {info.emails.map((em) => (
                        <a
                          key={em}
                          href={`mailto:${em}`}
                          className="text-[13.5px] text-vs-gray-600 no-underline block hover:text-vs-blue"
                        >
                          {em}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-7 shadow-vs">
                <div className="text-[16px] font-extrabold text-vs-dark mb-5 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-vs-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {workingHours.sectionTitle}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {workingHours.slots.map((h, i) => (
                    <div key={i} className="bg-vs-bg rounded-lg px-3.5 py-3">
                      <div className="text-[12px] font-bold text-vs-gray-400 uppercase tracking-[0.06em] mb-1">{h.day}</div>
                      <div className={`text-[14px] font-extrabold ${h.time.toLowerCase() === 'nghỉ' ? 'text-vs-gray-400' : 'text-vs-dark'}`}>{h.time}</div>
                    </div>
                  ))}
                </div>
                {workingHours.note && (
                  <p className="text-[12.5px] text-vs-gray-400 mt-4 leading-[1.5]">{workingHours.note}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-[clamp(20px,2.5vw,28px)] font-extrabold text-vs-dark mb-10">
            Quy trình từ liên hệ đến <em className="not-italic text-vs-blue">go-live</em>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            <div className='absolute top-[32px] left-[12.5%] right-[12.5%] h-[2px] bg-[#E5E7EB] z-0' />
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="text-center px-4 z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[22px] font-extrabold text-white border-4 border-white ${step.color === 'blue' ? 'bg-vs-blue shadow-[0_0_0_2px_#1E5BC6]' : 'bg-vs-orange shadow-[0_0_0_2px_#F47920]'}`}>
                  {step.num}
                </div>
                <div className="text-[15px] font-extrabold text-vs-dark mb-2">{step.title}</div>
                <div className="text-[13px] text-vs-gray-600 leading-[1.6]">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-[clamp(20px,2.5vw,28px)] font-extrabold text-vs-dark mb-9">Câu hỏi thường gặp</h2>
          <div className="flex flex-col gap-3 mx-auto">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-vs-bg rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-[22px] py-[18px] cursor-pointer text-[15px] font-bold text-vs-dark gap-4 text-left bg-transparent border-none"
                >
                  {faq.q}
                  <svg className={`w-[18px] h-[18px] flex-shrink-0 text-vs-blue transition-transform ${openFaq === i ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {openFaq === i && (
                  <div className="text-[14px] text-vs-gray-600 leading-[1.75] px-[22px] pb-[18px]">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
