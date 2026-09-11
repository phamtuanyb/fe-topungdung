import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Báo thông tin sai, đề xuất ứng dụng nên có mặt hoặc góp ý về cách chúng tôi đánh giá. Phản hồi trong 7 ngày làm việc.',
  alternates: { canonical: '/lien-he' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
