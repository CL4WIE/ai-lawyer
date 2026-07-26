import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DocumentView } from "@/components/chat/DocumentView";

interface Props {
  params: { id: string };
}

export default async function DocumentPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DocumentView
      documentId={params.id}
      user={{ name: session.user.name ?? null, email: session.user.email! }}
    />
  );
}
