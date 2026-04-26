import { createServerClient } from '@supabase/ssr'; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 1. Redirect if not logged in
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Redirect if logged in and trying to go to login
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Security Rule: Check for must_change_password
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('must_change_password')
      .eq('id', session.user.id)
      .maybeSingle();

    // If password change is required, force redirect to /change-password
    if (profile?.must_change_password && req.nextUrl.pathname !== '/change-password') {
      return NextResponse.redirect(new URL('/change-password', req.url));
    }
  }

  return res;
}

export const config = {
  // Added /change-password to config so middleware doesn't trigger loops
  matcher: ['/dashboard/:path*', '/login', '/change-password'],
};