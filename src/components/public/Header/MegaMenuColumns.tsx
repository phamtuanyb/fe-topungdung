import { cn } from "@/lib/utils";
import Link from "next/link";
import { MegaMenuColumn } from "./config";

type Props = {
    columns: MegaMenuColumn[]
}

const MegaMenuColumns = ({ columns }: Props) => columns.map((col, ci) => (
    <div
        key={ci}
        className={cn('pb-3.5', {
            'border-r border-vs-gray-200 pr-8': ci < columns.length - 1,
            'pl-6': ci > 0,
        })}
    >
        <div
            className={
                cn("text-[11px] font-extrabold uppercase tracking-[0.1em] mb-2 flex items-center gap-2 before:content-[''] before:inline-block before:w-[3px] before:h-[14px] before:rounded-sm before:bg-current",
                    col.color === 'blue' ? 'text-vs-blue' : 'text-vs-orange',
                )
            }
        >
            {col.title}
        </div>

        {col.items.map((item, ii) => (
            <Link
                key={ii}
                href={item.href}
                className="group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-vs-bg mb-0.5"
            >
                <div
                    className={cn(
                        'w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0 overflow-hidden mt-0.5',
                        item.logoUrl ? 'bg-white border border-vs-gray-200' : col.color === 'blue' ? 'bg-vs-blue' : 'bg-vs-orange',
                    )}
                >
                    {item.logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.logoUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                        item.icon
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-vs-dark block leading-snug break-words transition-colors group-hover:text-vs-blue">
                        {item.name}
                    </span>
                    <span className="text-[12px] text-vs-gray-600 block mt-0.5 leading-snug break-words">
                        {item.sub}
                    </span>
                </div>
            </Link>
        ))}
    </div>
))

export default MegaMenuColumns