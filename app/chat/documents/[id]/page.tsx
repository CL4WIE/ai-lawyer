import { DocumentView } from "@/components/chat/DocumentView";

interface Props {
  params: { id: string };
}

export default function DocumentPage({ params }: Props) {
  return <DocumentView documentId={params.id} />;
}
