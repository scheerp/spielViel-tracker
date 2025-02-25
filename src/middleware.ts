import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Rollen-Hierarchie wie im Backend
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['admin', 'helper', 'guest'],
  helper: ['helper', 'guest'],
  guest: ['guest'],
};

export default withAuth(
  function middleware(req) {
    const userRole = req.nextauth.token?.role;

    // Wenn keine Rolle vorhanden ist → Umleitung zur Startseite
    if (!userRole) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const path = req.nextUrl.pathname;

    // Zugriffsbeschränkung für /admin/*
    if (
      path.startsWith('/admin') &&
      !ROLE_PERMISSIONS[userRole]?.includes('admin')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Zugriffsbeschränkung für /helperUser/*
    if (
      path.startsWith('/helperUser') &&
      !ROLE_PERMISSIONS[userRole]?.includes('helper')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Falls alle Checks bestehen → Zugriff erlauben
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Nur eingeloggte Nutzer zulassen
    },
  },
);

// Middleware für bestimmte Routen aktivieren
export const config = {
  matcher: ['/admin/:path*', '/helperUser/:path*'],
};
