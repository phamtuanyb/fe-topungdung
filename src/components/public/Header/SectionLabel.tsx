
type Props = {
    children: React.ReactNode

}
const SectionLabel = ({ children }: Props) => (
    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-vs-gray-400 py-4 px-4 pb-1.5">
        {children}
    </div>
)

export default SectionLabel