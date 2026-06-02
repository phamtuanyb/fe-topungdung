import PostEditor from '@/components/admin/post-editor/PostEditor'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default function AdminPostCreatePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/posts"
        title="Thêm bài viết"
        description="Soạn nội dung, tối ưu SEO và xuất bản"
      />
      <PostEditor />
    </div>
  )
}
