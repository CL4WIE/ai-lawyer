import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const isChatRoute = request.nextUrl.pathname.startsWith("/chat");
      if (!isChatRoute) return true;
      return !!auth?.user;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
