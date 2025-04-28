'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience, should validate
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

  // type-casting here for convenience, should validate
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
    alert('Username already taken');
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
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) throw new Error('User not found');

  return data;
}

export async function follower(formData: FormData) {
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

export async function unfollower(formData: FormData) {
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

export async function editProfile(formData: FormData) {
  const { supabase, user } = await getSupabaseWithUser();

  const { data: currentProfile, error: fetchError } = await supabase
    .from('users')
    .select('name, username, bio')
    .eq('id', user.id)
    .single();
  if (fetchError || !currentProfile) {
    throw new Error("Failed to fetch current profile.");
  }

  const formName = formData.get('name') as string;
  const formUsername = formData.get('username') as string;
  const formBio = formData.get('bio') as string;

  const updatedData = {
    name: formName || currentProfile.name,
    username: currentProfile.username,
    bio: formBio || currentProfile.bio,
  };

  // Check if a user already exists with the provided username
  if (
    formUsername &&
    formUsername !== currentProfile.username // only check if it's a new username
  ) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', formUsername)
      .neq('id', user.id) // ignore current user
      .maybeSingle();

    if (!existingUser) {
      updatedData.username = formUsername;
    }
  }

  const { error } = await supabase
    .from('users')
    .update(updatedData)
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile:", error.message);
    throw new Error("Failed to update profile.");
  }

  revalidatePath('/edit-profile')
  redirect('/edit-profile')
}

export async function createPost(formData: FormData) {
  const { supabase, user } = await getSupabaseWithUser();

  const { data: currentProfile, error: fetchError } = await supabase
    .from('users')
    .select('name, username, bio')
    .eq('id', user.id)
    .single();
  if (fetchError || !currentProfile) {
    throw new Error("Failed to fetch current profile.");
  }

  const formImage = formData.get('imageSrc') as string;
  const formCaption = formData.get('caption') as string;

  const { error: tableError } = await supabase
    .from('posts')
    .insert([
      {
        user_id: user.id,
        image_url: formImage,
        caption: formCaption,
      },
    ]);

  if (tableError) {
    console.error('Failed to create post:', tableError);
  } else {
    console.log('Post created successfully');
  }

  revalidatePath('/create')
  redirect(`/${currentProfile.username}`)
}

export async function deleteComment(formData: FormData) {
  const { supabase, user } = await getSupabaseWithUser();

  const commentId = formData.get('id') as string;

  const { data: comment } = await supabase
    .from('comments')
    .select('user_id')
    .eq('post_id', commentId)
    .single();

  if (comment?.user_id !== user?.id) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('post_id', commentId);

  if (error) {
    throw new Error('Failed to delete comment');
  }

  revalidatePath(`/p/${commentId}`);
  redirect(`/p/${commentId}`);
}