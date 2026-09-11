"use client"

import PageHero from '@/components/common/PageHero';
import { getContactConfig, submitContact } from '@/lib/api/public';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ContactConfig } from '@/types';

const PROCESS_STEPS = [
  { num: '1', title: 'Bạn gửi nội dung', desc: 'Báo lỗi thông tin, đề xuất ứng dụng nên có mặt, hoặc góp ý về cách chúng tôi đánh giá', color: 'blue' },
  { num: '2', title: 'Chúng tôi kiểm chứng', desc: 'Với báo lỗi giá hoặc tính năng, chúng tôi mở trang chính thức của nhà cung cấp để đối chiếu', color: 'orange' },
  { num: '3', title: 'Cập nhật bài viết', desc: 'Nếu thông tin sai, bài được sửa và ngày cập nhật đổi theo. Sai lớn thì ghi chú rõ trong bài', color: 'blue' },
  { num: '4', title: 'Phản hồi lại bạn', desc: 'Chúng tôi trả lời trong vòng 7 ngày làm việc, kể cả khi kết luận là giữ nguyên nội dung cũ', color: 'orange' },
]

const FAQS = [
  { q: 'Tôi muốn phần mềm của mình được đánh giá thì làm thế nào?', a: 'Gửi cho chúng tôi tên và địa chỉ trang chủ. Chúng tôi ưu tiên những công cụ nhiều người Việt đang tìm và những nhóm còn thiếu lựa chọn. Xin nói trước: gửi yêu cầu không đảm bảo sẽ có bài, và chúng tôi không nhận tiền để viết.' },
  { q: 'Tôi trả tiền để được xếp hạng cao hơn có được không?', a: 'Không. Điểm số và thứ tự trong bài dựa trên đánh giá biên tập, không bán được. Nếu chúng tôi chấm sai, cách duy nhất để đổi là chỉ ra chỗ sai — chúng tôi sẽ kiểm chứng và sửa nếu bạn đúng.' },
  { q: 'Thông tin về giá trong bài không còn đúng thì báo ở đâu?', a: 'Gửi qua biểu mẫu này, nêu tên ứng dụng và chỗ sai. Bảng giá phần mềm thay đổi thường xuyên và chúng tôi không thể theo dõi hết — báo lỗi từ người đọc là cách sửa nhanh nhất.' },
  { q: 'Tôi là chủ sở hữu thương hiệu, muốn gỡ logo hoặc ảnh thì sao?', a: 'Gửi yêu cầu kèm thông tin xác nhận bạn là chủ sở hữu. Chúng tôi gỡ hoặc thay hình ảnh theo yêu cầu. Riêng phần nội dung đánh giá là quan điểm biên tập nên vẫn giữ, nhưng nếu có chi tiết sai thì chúng tôi sửa.' },
  { q: 'Các bạn có bán phần mềm hoặc hỗ trợ kỹ thuật không?', a: 'Không. Chúng tôi chỉ viết đánh giá. Khi bạn cần mua, dùng thử hay được hỗ trợ kỹ thuật, hãy liên hệ trực tiếp nhà cung cấp — mỗi bài đều có liên kết tới trang chính thức của họ.' },
]


/**
 * Cấu hình dự phòng khi chưa gọi được API.
 *
 * CHỈ khai báo kênh liên hệ thật sự tồn tại. Để trống hotline, văn phòng,
 * Zalo nếu chưa có — giao diện đã có điều kiện nên khối rỗng sẽ không hiện,
 * tốt hơn nhiều so với đăng một số điện thoại không ai nghe máy.
 */
const FALLBACK_CONFIG: ContactConfig = {
  form: {
    heading: 'Góp ý, báo lỗi hoặc đề xuất ứng dụng',
    description:
      'Thông tin phần mềm thay đổi liên tục và chúng tôi không theo dõi hết được. Nếu bạn thấy chỗ nào sai, báo cho chúng tôi là cách sửa nhanh nhất.',
    needs: [
      'Báo thông tin sai (giá, tính năng, phần mềm đã ngừng)',
      'Đề xuất ứng dụng nên có mặt trên trang',
      'Góp ý về cách đánh giá và chấm điểm',
      'Yêu cầu về hình ảnh, logo thương hiệu',
      'Yêu cầu liên quan tới dữ liệu cá nhân',
      'Hợp tác nội dung',
      'Khác',
    ],
    submitText: 'Gửi nội dung',
    noteText:
      'Chúng tôi phản hồi trong vòng 7 ngày làm việc. Thông tin của bạn chỉ dùng để trả lời chính yêu cầu này.',
    successHeading: 'Đã nhận nội dung!',
    successText:
      'Cảm ơn bạn. Chúng tôi sẽ kiểm chứng và phản hồi trong vòng 7 ngày làm việc.',
  },
  quickContact: {
    heading: 'Báo lỗi nội dung',
    description:
      'Giá đã đổi, tính năng bị nêu nhầm, hay phần mềm đã đóng cửa — đây là loại góp ý hữu ích nhất với chúng tôi.',
    zaloText: '',
    zaloHref: '',
    phoneText: '',
    phoneHref: '',
  },
  info: {
    sectionTitle: 'Thông tin liên hệ',
    offices: [],
    hotlines: [],
    emails: ['topungdung.net@gmail.com'],
  },
  workingHours: {
    sectionTitle: 'Thời gian phản hồi',
    slots: [
      { day: 'Báo lỗi nội dung', time: 'Trong 7 ngày làm việc' },
      { day: 'Yêu cầu về dữ liệu cá nhân', time: 'Trong 7 ngày làm việc' },
      { day: 'Đề xuất ứng dụng mới', time: 'Không cam kết thời hạn' },
    ],
    note: 'Chúng tôi không có tổng đài. Mọi trao đổi đi qua biểu mẫu này hoặc email.',
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
        title="Liên Hệ"
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
                      <label className="block text-[13px] font-bold text-vs-gray-700 mb-1.5">Số điện thoại <span className="text-vs-gray-400 font-normal">(không bắt buộc)</span></label>
                      <input {...register('phone', { pattern: { value: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' } })} type="tel" placeholder="0912 345 678" className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors" />
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
                    <input {...register('company')} type="text" placeholder="Công ty / Cửa hàng của bạn" className="w-full px-4 py-3 border-[1.5px] border-vs-gray-200 rounded-lg text-[14px] text-vs-dark bg-white outline-none focus:border-vs-blue transition-colors" />
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
                {/* Chỉ hiện kênh nào thực sự có cấu hình — tránh nút rỗng bấm không ra gì */}
                {(quickContact.zaloHref || quickContact.phoneHref) && (
                  <div className="flex flex-col gap-2.5">
                    {quickContact.zaloHref && (
                      <a href={quickContact.zaloHref} className="flex items-center gap-2.5 px-5 py-3.5 rounded-[10px] bg-white/15 text-white border border-white/20 font-extrabold text-[14px] no-underline hover:bg-white/25 transition-all">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        {quickContact.zaloText}
                      </a>
                    )}
                    {quickContact.phoneHref && (
                      <a href={quickContact.phoneHref} className="flex items-center gap-2.5 px-5 py-3.5 rounded-[10px] bg-vs-orange text-white font-extrabold text-[14px] no-underline hover:bg-vs-orange-dark transition-all">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        {quickContact.phoneText}
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-7 shadow-vs">
                <div className="text-[16px] font-extrabold text-vs-dark mb-5 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-vs-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {info.sectionTitle}
                </div>

                {info.offices.length > 0 && info.offices.map((office, i) => (
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
