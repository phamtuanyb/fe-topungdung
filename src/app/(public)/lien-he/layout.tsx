import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ tư vấn giải pháp phần mềm',
  description: 'Liên hệ Vsoftware để nhận tư vấn và thiết kế giải pháp phần mềm theo yêu cầu miễn phí trong 30 phút: CRM, App Mobile, AI Agent & Automation.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
