'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper to initialize the admin-privileged client
async function getAdminSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )
}

export async function createStaffAction(formData: any) {
  const supabase = await getAdminSupabase()

  try {
    const { data: auth, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
    })

    if (authError) return { error: authError.message }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: auth.user!.id,
        full_name: formData.full_name,
        role: 'staff',
        must_change_password: true,
        is_active: true,
      })

    if (profileError) {
      await supabase.auth.admin.deleteUser(auth.user!.id)
      return { error: profileError.message }
    }

    return { success: true }
  } catch (err: any) {
    return { error: "An unexpected error occurred." }
  }
}

/**
 * ADMIN ONLY: Forces a new password and resets the must_change_password flag.
 */
export async function adminResetPasswordAction(id: string, newPassword: string) {
  const supabase = await getAdminSupabase()

  try {
    // 1. Update the password via Admin API
    const { error: authError } = await supabase.auth.admin.updateUserById(id, {
      password: newPassword,
    })

    if (authError) return { error: authError.message }

    // 2. Set 'must_change_password' to true
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', id)

    if (profileError) return { error: profileError.message }

    return { success: true }
  } catch (err: any) {
    return { error: "Failed to reset password." }
  }
}