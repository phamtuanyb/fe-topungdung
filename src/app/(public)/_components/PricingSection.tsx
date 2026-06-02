import type { HomepagePricingConfig } from "@/types"
import { PLANS } from "../_configs/constants"
import { Plan } from "../_configs/types"
import { PriceCard } from "./PriceCard"

function PricingSection({ config }: { config?: HomepagePricingConfig }) {
    const heading = config?.heading ?? 'Bảng giá minh bạch'
    const description = config?.description ?? 'Vsoftware báo giá theo module thực tế sau khi nghe bài toán. Dưới đây là khung tham khảo để bạn chủ động ngân sách.'
    const disclaimer = config?.disclaimer ?? '* Giá cuối xác nhận sau buổi tư vấn phân tích bài toán. Không có phí ẩn.'

    const plans: Plan[] = config?.plans && config.plans.length > 0
        ? config.plans.map((p) => ({
            name: p.name,
            sub: p.subtitle,
            price: p.price,
            period: p.period,
            features: p.features,
            cta: { label: p.ctaText, href: p.ctaHref, variant: p.featured ? 'solid' : 'ghost' },
            badge: p.badge,
            featured: p.featured,
        }))
        : PLANS

    return (
        <section className="py-14 bg-[#F5F7FA]" id="pricing">
            <div className="max-w-8xl mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] uppercase tracking-tight mb-4">
                        {heading}
                    </h2>
                    <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                        {description}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[960px] mx-auto items-start">
                    {plans.map((plan: Plan) => (
                        <PriceCard key={plan.name} plan={plan} />
                    ))}
                </div>
                <p className="text-center mt-6 text-[13px] text-gray-500">
                    {disclaimer}
                </p>
            </div>
        </section>
    )
}

export default PricingSection