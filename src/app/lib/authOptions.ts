// @lib/authOptions.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Beispiel: POST an deine FastAPI-Route
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              username: credentials?.username || '',
              password: credentials?.password || '',
            }),
          },
        );
        const data = await res.json();

        if (res.ok && data.access_token) {
          // Diese Felder werden im "jwt" Callback als "user" übergeben
          return {
            id: data.user_id || data.username || 'fallback-id',
            accessToken: data.access_token,
            role: data.role,
            // evtl. noch: name, email, ...
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // "user" kommt von authorize() zurück (nur beim 1. Mal)
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
