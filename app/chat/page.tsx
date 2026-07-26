import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChatShell } from "@/components/chat/ChatShell";

export const metadata = {
  title: "LegalEase",
};

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ChatShell
      user={{ name: session.user.name ?? null, email: session.user.email! }}
    />
  );
}
