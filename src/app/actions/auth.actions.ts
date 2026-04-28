'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * FINALIZES password change:
 * 1. Updates Auth credentials.
 * 2. Unlocks the user account by setting 'must_change_password' to false.
 */
export async function finalizePasswordChange(newPassword: string) {
  const cookieStore = await cookies();
  
  // Create an Admin-privileged Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Admin power
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get current user from the session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // 1. Update the password via Admin API
  const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });
  if (authError) return { error: authError.message };

  // 2. Set 'must_change_password' to false in 'profiles' table
  // This tells the middleware to let the user pass to the dashboard
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ must_change_password: false })
    .eq('id', user.id);

  if (profileError) {
    return { error: "Password changed, but account remains locked: " + profileError.message };
  }

  return { success: true };
}