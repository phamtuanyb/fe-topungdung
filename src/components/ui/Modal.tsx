'use client'

import { useEffect } from 'react'
import Button from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function Modal({
  open,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmVariant = 'primary',
  loading,
  onConfirm,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const isDanger = confirmVariant === 'danger'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 !m-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden">
          {/* Header stripe */}
          <div className={`h-1 w-full ${isDanger ? 'bg-red-500' : 'bg-indigo-500'}`} />

          <div className="p-6">
            {/* Icon + title */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isDanger ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {isDanger ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {description && (
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose} disabled={loading} size="sm">
                {cancelText}
              </Button>
              <Button variant={confirmVariant} onClick={onConfirm} loading={loading} size="sm">
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
