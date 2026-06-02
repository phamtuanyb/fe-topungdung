'use client'

interface Props {
  /** Section đang ẨN nếu = true */
  hidden: boolean
  /** Callback đổi trạng thái */
  onChange: (nextHidden: boolean) => void
  /** Tên section để hiện trong cảnh báo */
  sectionLabel?: string
}

const SectionVisibilityToggle = ({ hidden, onChange, sectionLabel }: Props) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border-2 px-4 py-3 mb-5 transition-colors ${
        hidden
          ? 'border-amber-300 bg-amber-50'
          : 'border-emerald-200 bg-emerald-50/60'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl">{hidden ? '🚫' : '👁️'}</span>
        <div className="min-w-0">
          <div className={`text-[13px] font-bold ${hidden ? 'text-amber-800' : 'text-emerald-800'}`}>
            {hidden ? 'Section đang ẨN khỏi trang chủ' : 'Section đang hiển thị trên trang chủ'}
          </div>
          <div className="text-[11.5px] text-slate-500 mt-0.5">
            {hidden
              ? `Nội dung ${sectionLabel ?? 'section'} vẫn được giữ trong DB. Bật lại để hiển thị.`
              : `${sectionLabel ?? 'Section'} đang hiện cho mọi khách truy cập. Tắt để ẩn tạm thời.`}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!hidden)}
        role="switch"
        aria-checked={!hidden}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
          hidden ? 'bg-slate-300' : 'bg-emerald-500'
        }`}
        title={hidden ? 'Bấm để HIỆN section' : 'Bấm để ẨN section'}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
            hidden ? 'translate-x-1' : 'translate-x-6'
          }`}
        />
      </button>
    </div>
  )
}

export default SectionVisibilityToggle
