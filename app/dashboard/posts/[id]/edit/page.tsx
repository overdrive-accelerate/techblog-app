import { EditPostPageClient } from "@/components/pages/dashboard-edit-post-page-client";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EditPostPageClient id={id} />;
}
