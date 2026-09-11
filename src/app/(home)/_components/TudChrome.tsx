'use client'

import { useState } from 'react'
import type { TudHeaderConfig, TudFooterConfig } from '@/types/tud'
import SearchModal from './SearchModal'
import SuggestModal from './SuggestModal'

/** Thanh điều hướng dùng chung cho trang chủ và các trang /ungdung. */
/**
 * Ghép tên thương hiệu từ config để làm chữ thay thế cho ảnh logo.
 * Giữ đọc được cho trình đọc màn hình và khi ảnh chưa tải xong.
 */
function brandName(c: { brandTop: string; brandRest: string; brandSuffix?: string }): string {
  return `${c.brandTop}${c.brandRest}${c.brandSuffix ? '.' + c.brandSuffix : ''}`
}

export function TudHeader({ config, homeHref = '/' }: { config: TudHeaderConfig; homeHref?: string }) {
  const [modal, setModal] = useState<'search' | 'suggest' | null>(null)
  // Menu thu gọn cho máy tính bảng và điện thoại: dưới 980px hàng liên kết
  // ngang bị ẩn, trước đây không có gì thay thế nên người dùng mất hết đường đi.
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <header className="topbar">
      <div className="wrap nav">
        <a className="brand" href={homeHref} aria-label={brandName(config)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt={brandName(config)}
            width={2172}
            height={724}
            fetchPriority="high"
            decoding="async"
          />
        </a>
        <nav className="navlinks">
          {config.links.map((l, i) => (
            <a key={i} href={l.href.startsWith('#') ? `/${l.href}` : l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="nav-search"
            type="button"
            aria-label={config.searchText}
            title={config.searchText}
            onClick={() => setModal('search')}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <button className="btn dark" onClick={() => setModal('suggest')}>
            {config.suggestText}
          </button>
          <button
            className="nav-burger"
            type="button"
            aria-label={openMenu ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={openMenu}
            onClick={() => setOpenMenu((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {openMenu && (
        <div className="nav-drawer">
          <div className="wrap">
            {config.links.map((l, i) => (
              <a
                key={i}
                href={l.href.startsWith('#') ? `/${l.href}` : l.href}
                onClick={() => setOpenMenu(false)}
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpenMenu(false)
                setModal('search')
              }}
            >
              {config.searchText}
            </button>
          </div>
        </div>
      )}

      {modal === 'search' && <SearchModal onClose={() => setModal(null)} />}
      {modal === 'suggest' && <SuggestModal onClose={() => setModal(null)} />}
    </header>
  )
}

/** Chân trang dùng chung. */
export function TudFooter({
  header,
  footer,
}: {
  header: TudHeaderConfig
  footer: TudFooterConfig
}) {
  return (
    <footer>
      <div className="wrap footer">
        <div className="foot-brand">
          <a className="brand brand-footer" href="/" aria-label={brandName(header)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt={brandName(header)}
              width={2172}
              height={724}
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="foot-tagline">{footer.tagline}</p>
          {footer.subline && <p className="foot-sub">{footer.subline}</p>}
        </div>
        {footer.columns.map((col, i) => (
          <div key={i}>
            <div className="foot-col-title">{col.title}</div>
            {col.links.map((l, j) => (
              <a href={l.href} key={j} className={l.highlight ? 'foot-hot' : undefined}>
                {l.label}
                {l.highlight && (
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="wrap foot-bottom">
        <span>{footer.copyright || `© ${new Date().getFullYear()} ${brandName(header)}.`}</span>
        {/* Nút cuộn lên đầu: dùng button chứ không phải link neo, để bấm xong
            thanh địa chỉ không dính thêm dấu thăng. */}
        <button
          type="button"
          className="foot-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Lên đầu trang
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
