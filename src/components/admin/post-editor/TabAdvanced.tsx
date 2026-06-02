import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormData } from './PostEditor'
import Input from '@/components/ui/Input'

const PanelAdvanced = () => {
    const { control, watch } = useFormContext<FormData>()
    const title = watch('title')
    const seoTitle = watch('seoTitle')
    const seoDescription = watch('seoDescription')
    const excerpt = watch('excerpt')
    const slug = watch('slug')

    return (
        <div className="space-y-3">
            <div>
                <label className="text-[12px] font-medium text-slate-800 block mb-1">SEO Title</label>
                <div className="relative">
                    <Controller
                        name="seoTitle"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={title || 'Tiêu đề SEO...'}
                                className="w-full border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-14 bg-white"
                                {...field}
                            />
                        )}
                    />

                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] ${(seoTitle?.length ?? 0) > 60 ? 'text-red-500' : 'text-slate-500'}`}>
                        {seoTitle?.length ?? 0}/60
                    </span>
                </div>
            </div>
            <div>
                <label className="text-[12px] font-medium text-slate-800 block mb-1">SEO Description</label>
                <div className="relative">
                    <Controller
                        name="seoDescription"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                placeholder="Mô tả SEO..."
                                rows={3}
                                className="w-full border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none bg-white"
                                {...field}
                            />
                        )}
                    />

                    <span className={`absolute right-2 bottom-2 text-[10px] ${(seoDescription?.length ?? 0) > 160 ? 'text-red-500' : 'text-slate-500'}`}>
                        {seoDescription?.length ?? 0}/160
                    </span>
                </div>
            </div>
            {/* Google snippet preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="text-indigo-700 font-medium truncate">{seoTitle || title || 'Tiêu đề bài viết'}</p>
                <p className="text-emerald-700 text-xs mt-0.5">/tin-tuc/{slug}</p>
                <p className="text-slate-600 line-clamp-2 mt-1 text-xs">
                    {seoDescription || excerpt || 'Mô tả bài viết sẽ hiển thị tại đây...'}
                </p>
            </div>
        </div>
    )
}

export default PanelAdvanced
