import type { HomepageWhyConfig } from '@/types'
import { DynamicIcon } from '@/components/admin/IconPicker'
import { WHY_ITEMS, WHY_STATS } from "../_configs/constants"

function WhySection({ config }: { config?: HomepageWhyConfig }) {
    const label = config?.label ?? 'TẠI SAO VSOFTWARE'
    const heading = config?.heading ?? 'Không phải vì chúng tôi nói hay — mà vì chúng tôi làm được'
    const description = config?.description ?? 'Vsoftware thuộc hệ sinh thái ViTechGroup. Đội ngũ đã xây dựng và vận hành nhiều sản phẩm phần mềm thực tế — không phải team học việc.'
    const items = config?.items && config.items.length > 0
        ? config.items.map((it, i) => ({
            iconName: it.iconName,
            icon: it.icon,
            title: it.title,
            desc: it.description,
            color: i % 2 === 0 ? 'blue' : 'orange',
        }))
        : WHY_ITEMS.map((it) => ({ ...it, iconName: undefined as string | undefined }))
    const stats = config?.stats && config.stats.length > 0
        ? config.stats.map((s) => ({ num: s.value, label: s.label }))
        : WHY_STATS
    const quote = config?.quote ?? 'Vsoftware không chỉ viết code. Chúng tôi đồng hành cùng bạn xây dựng hệ thống — từ bài toán thực tế đến phần mềm vận hành thực sự.'
    const quoteAuthor = config?.quoteAuthor ?? '— Lê Đức Nam, Founder & CEO ViTechGroup'

    return (
        <section className="py-20 bg-white" id="why-us">
            <div className="max-w-8xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-[clamp(22px,3vw,34px)] font-extrabold text-vs-dark leading-[1.25] mb-4">
                            {heading}
                        </h2>
                        <p className="text-[15px] text-vs-gray-600 mb-8 leading-[1.65] whitespace-pre-line">
                            {description}
                        </p>
                        <div className="flex flex-col gap-6">
                            {items.map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${item.color === 'blue' ? 'bg-vs-blue-light text-vs-blue' : 'bg-vs-orange-light text-vs-orange'
                                            }`}
                                    >
                                        {item.iconName
                                            ? <DynamicIcon name={item.iconName} className="h-5 w-5" />
                                            : item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-extrabold text-vs-dark mb-1">{item.title}</h3>
                                        <p className="text-[13.5px] text-vs-gray-600 leading-[1.65] m-0 whitespace-pre-line">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="bg-[linear-gradient(135deg,_#1E5BC6_0%,_#2E6FD6_55%,_#F47920_100%)] rounded-2xl p-8">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="bg-white/10 rounded-xl p-5 text-center">
                                        <div className="text-[clamp(28px,4vw,36px)] font-extrabold text-white leading-none mb-2 whitespace-pre-line">
                                            {stat.num}
                                        </div>
                                        <div className="text-[12px] text-white/65 leading-[1.4]">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <blockquote className="mt-6 rounded-xl border-l-[3px] border-orange-500 bg-white/10 p-5">
                                <p className="text-[14px] text-white/80 italic leading-[1.7] mb-3">
                                    &ldquo;{quote}&rdquo;
                                </p>
                                <cite className="text-[12px] text-white/50 not-italic font-bold uppercase tracking-[0.05em]">
                                    {quoteAuthor}
                                </cite>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhySection