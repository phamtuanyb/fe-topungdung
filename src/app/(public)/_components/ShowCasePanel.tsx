import type { PillColor } from '../_configs/types'
import { WindowDots, Sidebar, KpiRow, BarRow, Pill } from './Index'

// ─── PhoneCard (used in PanelMobile) ─────────────────────────────────────────

function PhoneCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 w-[175px] shadow-md overflow-hidden shrink-0">
      <div className="bg-[#1E5BC6] text-white text-[10px] font-bold px-3 py-2 text-center">
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── PanelCRM ─────────────────────────────────────────────────────────────────

export function PanelCRM() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
        <WindowDots />
        <span className="text-white/40 text-[11px] ml-2">
          CRM Vsoftware · Quản lý khách hàng &amp; doanh số
        </span>
      </div>
      <div className="flex min-h-[360px]">
        <Sidebar
          logo="⚡ CRM Pro"
          items={[
            { icon: '📊', label: 'Dashboard', active: true },
            { icon: '👥', label: 'Khách hàng' },
            { icon: '💼', label: 'Cơ hội' },
            { icon: '📅', label: 'Lịch hẹn' },
            { icon: '📋', label: 'Báo giá' },
            { icon: '📈', label: 'Báo cáo' },
            { icon: '⚙️', label: 'Cài đặt' },
          ]}
        />
        <div className="flex-1 p-5 bg-[#F5F7FA] overflow-auto">
          <div className="text-[15px] font-extrabold text-[#1A1A1A] mb-4">Dashboard tổng quan</div>
          <KpiRow
            items={[
              { label: 'Doanh thu tháng', val: '₫1.2B', trend: '↑ 23% vs T4' },
              { label: 'Leads mới', val: '384', trend: '↑ 47 leads' },
              { label: 'Tỉ lệ chốt', val: '41%', trend: '↑ 3%' },
              { label: 'Chưa follow', val: '12', trend: '⚠ Cần xử lý', down: true },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs font-bold text-[#1A1A1A] mb-3">Pipeline theo giai đoạn</div>
              <BarRow label="Mới tiếp cận" pct={90} color="#1E5BC6" value="142" />
              <BarRow label="Đang tư vấn" pct={62} color="#2E6FD6" value="98" />
              <BarRow label="Chờ báo giá" pct={45} color="#F47920" value="71" />
              <BarRow label="Sắp chốt" pct={30} color="#10B981" value="47" />
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs font-bold text-[#1A1A1A] mb-3">Cơ hội gần đây</div>
              <table className="w-full text-[11px]">
                <tbody>
                  {(
                    [
                      ['Minh Hùng Corp', '₫85M', 'blue', 'Tư vấn'],
                      ['Anh Tú Foods', '₫120M', 'green', 'Chốt hôm nay'],
                      ['Thanh Bình Co.', '₫55M', 'orange', 'Chờ báo giá'],
                      ['Hoàng Gia SME', '₫200M', 'blue', 'Demo'],
                    ] as [string, string, PillColor, string][]
                  ).map(([name, price, color, status], i) => (
                    <tr key={i} className="border-b border-[#F5F7FA]">
                      <td className="py-1.5 pr-2 font-semibold text-gray-700">{name}</td>
                      <td className="py-1.5 pr-2 font-bold text-[#1E5BC6]">{price}</td>
                      <td className="py-1.5">
                        <Pill color={color}>{status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PanelWMS ─────────────────────────────────────────────────────────────────

export function PanelWMS() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
        <WindowDots />
        <span className="text-white/40 text-[11px] ml-2">
          WMS Vsoftware · Quản lý kho &amp; xuất nhập tồn
        </span>
      </div>
      <div className="flex min-h-[360px]">
        <Sidebar
          logo="📦 Kho Pro"
          items={[
            { icon: '📊', label: 'Tổng quan', active: true },
            { icon: '📥', label: 'Nhập kho' },
            { icon: '📤', label: 'Xuất kho' },
            { icon: '📋', label: 'Tồn kho' },
            { icon: '🔍', label: 'Barcode' },
            { icon: '📈', label: 'Báo cáo' },
            { icon: '⚙️', label: 'Cài đặt' },
          ]}
        />
        <div className="flex-1 p-5 bg-[#F5F7FA] overflow-auto">
          <div className="text-[15px] font-extrabold text-[#1A1A1A] mb-4">Tổng quan kho hàng</div>
          <KpiRow
            items={[
              { label: 'Tổng SKU', val: '1,247', trend: '↑ 18 SKU mới' },
              { label: 'Xuất hôm nay', val: '38', trend: '↑ 12% vs hôm qua' },
              { label: 'Nhập hôm nay', val: '12', trend: '4 đơn đang xử lý' },
              { label: 'Cảnh báo tồn', val: '5', trend: '⚠ Sắp hết hàng', down: true },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs font-bold text-[#1A1A1A] mb-3">Hàng sắp hết tồn</div>
              <table className="w-full text-[11px]">
                <tbody>
                  {(
                    [
                      ['Cà phê Arabica 500g', '23', 'orange', 'Sắp hết'],
                      ['Hộp đựng nắp trong', '8', 'red', 'Hết hàng'],
                      ['Túi giấy kraft M', '41', 'orange', 'Sắp hết'],
                      ['Nước uống Vital 350ml', '67', 'orange', 'Sắp hết'],
                    ] as [string, string, PillColor, string][]
                  ).map(([name, qty, color, status], i) => (
                    <tr key={i} className="border-b border-[#F5F7FA]">
                      <td className="py-1.5 pr-2 font-semibold text-gray-700">{name}</td>
                      <td
                        className={`py-1.5 pr-2 font-bold ${
                          color === 'red' ? 'text-red-600' : 'text-orange-500'
                        }`}
                      >
                        {qty}
                      </td>
                      <td className="py-1.5">
                        <Pill color={color}>{status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs font-bold text-[#1A1A1A] mb-3">Xuất nhập theo ngày</div>
              <BarRow label="Thứ Hai" pct={70} color="#1E5BC6" value="28" />
              <BarRow label="Thứ Ba" pct={55} color="#2E6FD6" value="22" />
              <BarRow label="Thứ Tư" pct={95} color="#F47920" value="38" />
              <BarRow label="Thứ Năm" pct={45} color="#10B981" value="18" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PanelMobile ─────────────────────────────────────────────────────────────

export function PanelMobile() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
        <WindowDots />
        <span className="text-white/40 text-[11px] ml-2">
          App Mobile Vsoftware · Quản lý &amp; bán hàng trên điện thoại
        </span>
      </div>
      <div className="flex min-h-[360px]">
        <Sidebar
          logo="📱 App Pro"
          items={[
            { icon: '🏠', label: 'Trang chủ', active: true },
            { icon: '🛒', label: 'Đơn hàng' },
            { icon: '👥', label: 'Khách hàng' },
            { icon: '📦', label: 'Sản phẩm' },
            { icon: '📊', label: 'Báo cáo' },
            { icon: '🔔', label: 'Thông báo' },
            { icon: '⚙️', label: 'Cài đặt' },
          ]}
        />
        <div className="flex-1 p-5 bg-[#F5F7FA] overflow-auto">
          <div className="text-[15px] font-extrabold text-[#1A1A1A] mb-5">Giao diện app mobile</div>
          <div className="flex flex-wrap gap-5 justify-center">
            <PhoneCard title="📊 Dashboard hôm nay">
              <div className="grid grid-cols-3 border-b border-gray-200">
                {[
                  ['₫48M', 'Doanh thu'],
                  ['23', 'Đơn mới'],
                  ['94%', 'Giao thành công'],
                ].map(([v, l], i) => (
                  <div
                    key={i}
                    className={`text-center py-2 px-1 ${i < 2 ? 'border-r border-gray-200' : ''}`}
                  >
                    <div className="text-[12px] font-extrabold text-[#1A1A1A]">{v}</div>
                    <div className="text-[8px] text-gray-500 mt-0.5 leading-tight">{l}</div>
                  </div>
                ))}
              </div>
              <div className="p-2 flex flex-col gap-1">
                {[
                  {
                    dot: '🟢',
                    name: '#DH2851 — Minh Hùng Corp',
                    sub: '₫2.4M · Đang giao',
                    pill: 'Giao',
                    color: 'green' as PillColor,
                  },
                  {
                    dot: '🟡',
                    name: '#DH2850 — Thanh Bình Co.',
                    sub: '₫890K · Đang xử lý',
                    pill: 'Xử lý',
                    color: 'orange' as PillColor,
                  },
                  {
                    dot: '🔵',
                    name: '#DH2849 — Lan Anh Foods',
                    sub: '₫5.2M · Mới',
                    pill: 'Mới',
                    color: 'blue' as PillColor,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 py-1.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-xs">{item.dot}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-bold text-[#1A1A1A] leading-tight truncate">
                        {item.name}
                      </div>
                      <div className="text-[8px] text-gray-500">{item.sub}</div>
                    </div>
                    <Pill color={item.color}>{item.pill}</Pill>
                  </div>
                ))}
              </div>
            </PhoneCard>

            <PhoneCard title="🛒 Bán hàng nhanh / POS">
              <div className="p-2 flex flex-col gap-1">
                {[
                  { icon: '☕', name: 'Cà phê sữa đá', price: '₫35,000 / ly', qty: 2 },
                  { icon: '🧋', name: 'Trà sữa taro', price: '₫45,000 / ly', qty: 1 },
                  { icon: '🥤', name: 'Sinh tố xoài', price: '₫40,000 / ly', qty: 3 },
                  { icon: '🍰', name: 'Bánh tiramisu', price: '₫65,000 / cái', qty: 1 },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 py-1.5 border-b border-gray-100">
                    <span className="text-base leading-none">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-bold text-[#1A1A1A] truncate">{p.name}</div>
                      <div className="text-[8px] text-gray-500">{p.price}</div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#1E5BC6] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {p.qty}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-[#F5F7FA] border-t border-gray-200">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-600">Tổng cộng:</span>
                  <strong className="text-[#1E5BC6]">₫290,000</strong>
                </div>
                <div className="mt-1.5 bg-[#1E5BC6] text-white text-center text-[10px] font-bold rounded-md py-1.5">
                  💳 Thanh toán ngay
                </div>
              </div>
            </PhoneCard>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PanelAnalytics ───────────────────────────────────────────────────────────

export function PanelAnalytics() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
        <WindowDots />
        <span className="text-white/40 text-[11px] ml-2">
          Analytics Vsoftware · Báo cáo kinh doanh realtime
        </span>
      </div>
      <div className="flex min-h-[360px]">
        <Sidebar
          logo="📈 Analytics"
          items={[
            { icon: '📊', label: 'Tổng quan', active: true },
            { icon: '💰', label: 'Doanh thu' },
            { icon: '👥', label: 'Khách hàng' },
            { icon: '📦', label: 'Sản phẩm' },
            { icon: '🏆', label: 'Nhân viên' },
            { icon: '📤', label: 'Xuất báo cáo' },
            { icon: '⚙️', label: 'Cài đặt' },
          ]}
        />
        <div className="flex-1 p-5 bg-[#F5F7FA] overflow-auto">
          <div className="text-[15px] font-extrabold text-[#1A1A1A] mb-4">
            Tổng quan tháng 5/2026
          </div>
          <KpiRow
            items={[
              { label: 'Doanh thu', val: '₫3.8B', trend: '↑ 18% vs T4' },
              { label: 'Đơn hàng', val: '1,892', trend: '↑ 241 đơn' },
              { label: 'Khách mới', val: '438', trend: '↑ 23%' },
              { label: 'Lợi nhuận', val: '34%', trend: '↑ 2%' },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs font-bold text-[#1A1A1A] mb-3">Doanh thu theo tháng</div>
              {[
                { label: 'T1', pct: 52, color: '#1E5BC6', value: '2.1B' },
                { label: 'T2', pct: 58, color: '#1E5BC6', value: '2.4B' },
                { label: 'T3', pct: 62, color: '#2E6FD6', value: '2.5B' },
                { label: 'T4', pct: 78, color: '#2E6FD6', value: '3.2B' },
                { label: 'T5', pct: 95, color: '#F47920', value: '3.8B' },
              ].map((r, i) => (
                <BarRow key={i} {...r} />
              ))}
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs font-bold text-[#1A1A1A] mb-3">Top nhân viên tháng 5</div>
              <table className="w-full text-[11px]">
                <tbody>
                  {(
                    [
                      ['🥇 Nguyễn Thanh Hà', '₫980M', 'green', '↑ 32%'],
                      ['🥈 Trần Minh Tuấn', '₫870M', 'green', '↑ 18%'],
                      ['🥉 Lê Thu Trang', '₫720M', 'blue', '↑ 5%'],
                      ['Phạm Đức Long', '₫540M', 'orange', '↓ 2%'],
                    ] as [string, string, PillColor, string][]
                  ).map(([name, rev, color, pct], i) => (
                    <tr key={i} className="border-b border-[#F5F7FA]">
                      <td className="py-1.5 pr-2 font-semibold text-gray-700">{name}</td>
                      <td className="py-1.5 pr-2 font-bold text-[#1E5BC6]">{rev}</td>
                      <td className="py-1.5">
                        <Pill color={color}>{pct}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}