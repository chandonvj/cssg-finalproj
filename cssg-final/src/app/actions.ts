'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const non_auth_data = {
    name: formData.get('name') as string,
    username: formData.get('username') as string,
  }

   // Check if a user already exists with the provided username
   const { data: existingUsernames, error: usernameError } = await supabase
    .from('users')
    .select('username')
    .eq('username', non_auth_data.username);

  if (usernameError) {
    console.error('Error checking if username exists:', usernameError)
    redirect('/error')
  }

  // If the username already exists, do nothing
  if (existingUsernames.length > 0) {
    console.log('Username already taken:', non_auth_data.username)
    return;
  }

  const { data: authData, error: authError } = await supabase.auth.signUp(data)

  if (authError) {
    console.error('Error signing up auth user:', authError)
    redirect('/error')
  }

  const user = authData?.user;
  if (!user) {
    console.error('No user found after signup')
    redirect('/error');
  }

  const { error: insertError } = await supabase
    .from('users')
    .insert([
      {
        id: user.id,
        name: non_auth_data.name,
        username: non_auth_data.username,
        bio: "",
      },
    ]);

    if (insertError) {
      if (insertError.details.includes("Key (id)") && insertError.details.includes("not present")) {
        console.log("The email is already in use!")
        return;
      }
      console.error('Error inserting user data:', insertError)
      redirect('/error')
    }
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}


export async function getSupabaseWithUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('User not authenticated');

  return { supabase, user };
}

export async function getUserByUsername(supabase: any, username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (error || !data) throw new Error('User not found');

  return data;
}

export async function follower(formData) {
  const recipientUsername = formData.get('username') as string;

  try {
    const { supabase, user } = await getSupabaseWithUser();
    const recipientUser = await getUserByUsername(supabase, recipientUsername);

    const { error: insertError } = await supabase
    .from('follows')
    .insert([{ follower: user.id, recipient: recipientUser.id }]);

    if (insertError) return { error: insertError.message };

    revalidatePath(`/${recipientUsername}`);
    redirect(`/${recipientUsername}`)
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function unfollower(formData) {
  const recipientUsername = formData.get('username') as string;

  try {
    const { supabase, user } = await getSupabaseWithUser();
    const recipientUser = await getUserByUsername(supabase, recipientUsername);

    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower', user.id)
      .eq('recipient', recipientUser.id);

    if (deleteError) return { error: deleteError.message };

    revalidatePath(`/${recipientUsername}`)
    redirect(`/${recipientUsername}`)
  } catch (error: any) {
    return { error: error.message }
  }
}