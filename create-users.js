import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://htloyjkapowawietftkr.supabase.co'
const supabaseKey = 'sb_publishable_pByWzYYCYwFOL3x2AtAhSQ_f5fKV5k5'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createAccount(email, password, role, fullName) {
  console.log(`Creating ${email}...`)
  
  // Sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })

  if (error) {
    console.error(`Failed to create ${email}:`, error.message)
    return
  }
  
  if (!data.user) {
    console.error(`Failed to create ${email}: No user returned`)
    return
  }

  // Wait a moment for the database trigger to create the profile row
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Update role in profiles
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', data.user.id)

  if (updateError) {
    console.error(`Failed to update role for ${email}:`, updateError.message)
  } else {
    console.log(`Successfully created ${email} and set role to ${role}`)
  }
}

async function main() {
  await createAccount('donor@redcross.test', 'Donor123', 'donor', 'Juan Dela Cruz')
  await createAccount('admin@redcross.test', 'Admin123', 'admin', 'RedCross Admin')
  await createAccount('superadmin@redcross.test', 'Superadmin123', 'super_admin', 'Alex Rivera')
}

main()
