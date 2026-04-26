'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createStaffAction(formData: any) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

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