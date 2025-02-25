import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    username?: string;
    role?: string;
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user?: {
      username?: string;
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    username?: string;
    accessToken?: string;
  }
}
