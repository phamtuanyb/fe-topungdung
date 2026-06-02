import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormData } from './PostEditor'
import Input from '@/components/ui/Input'
import { SeoAnalysisSections, SeoAnalysisCircle } from './SeoAnalysis'

const PanelOverview = () => {
    const { control, watch } = useFormContext<FormData>()
    const seoKeywords = watch('seoKeywords')

    return (
        <>
            <div className="flex items-start gap-4 mb-3">
                {/* Left: controls */}
                <div className="flex-1 min-w-0">

                    {/* Keyword input */}
                    <div className="mb-2">
                        <label className="text-[12px] font-medium text-slate-800 mb-1 flex items-center gap-1">
                            Từ khóa chính
                            <span className="text-slate-500 cursor-help text-[10px]" title="Nhập từ khóa SEO chính của bài viết">ⓘ</span>
                        </label>

                        <div className="relative">
                            <Controller
                                name='seoKeywords'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            type="text"
                                            placeholder="Ví dụ: phần mềm CRM"
                                            className="w-full border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-[72px] bg-white"
                                            {...field}
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
                                            {(seoKeywords ?? '').length}/100
                                        </span>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Score circle */}
                <SeoAnalysisCircle />
            </div>

            <SeoAnalysisSections />
        </>
    )

}

export default PanelOverview
