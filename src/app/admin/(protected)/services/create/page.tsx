import ProductEditor from '@/components/admin/product-editor/ProductEditor'

export default function AdminServiceCreatePage() {
  return <ProductEditor categorySlug="services" listHref="/admin/services" publicSlugPrefix="dich-vu" />
}
