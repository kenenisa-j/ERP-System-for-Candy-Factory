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
  const path = req.nextUrl.pathname;

  // 1. Redirect if not logged in (allow access to login page)
  if (!session && path !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Redirect if logged in and trying to go to login
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Logic for logged-in users (Profile checks)
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('must_change_password, role, is_active')
      .eq('id', session.user.id)
      .maybeSingle();

    // Security Rule: Block inactive users
    if (profile && profile.is_active === false) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Security Rule: Forced password change
    // UPDATED: Changed '/change-password' to '/reset-password' to match your folder
    if (profile?.must_change_password && path !== '/reset-password') {
      return NextResponse.redirect(new URL('/reset-password', req.url));
    }

    // Admin Protection Logic
    const adminPaths = ['/workers', '/payroll', '/staff'];
    const isTryingToAccessAdmin = adminPaths.some(adminPath => path.startsWith(adminPath));
    
    if (isTryingToAccessAdmin && profile?.role !== 'owner' && profile?.role !== 'superadmin' && path !== '/unauthorized') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};