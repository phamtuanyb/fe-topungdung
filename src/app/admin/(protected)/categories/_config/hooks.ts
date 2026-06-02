import { adminGetCategories } from "@/lib/api/admin"
import useSWR from "swr"
import { flattenForSelect, getAllDescendantIds } from "./utils"
import { useMemo } from "react"
import { Category } from "@/types"

export function useListCategorySelect(id: number | null = null) {
    const { data: catsData, isLoading } = useSWR('admin-categories', adminGetCategories)
    const flat = useMemo(() => catsData?.data ?? [], [catsData?.data])

    const current = useMemo(() => id ? flat.find(c => c.id === id) : null, [flat, id])

    const selectOptions = useMemo(() => {
        if (!current) {
            return flattenForSelect(flat)
        }

        const forbidden = new Set([current.id, ...getAllDescendantIds(current ?? {} as Category)])
        return flattenForSelect(flat, forbidden)
    }, [flat, current])

    return { isLoading, current, selectOptions }
}