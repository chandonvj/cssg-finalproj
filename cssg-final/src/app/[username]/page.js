import Link from 'next/link';
import Image from "next/image";
import { logout, getSupabaseWithUser, follower, unfollower } from '../actions'
import UserListWrapper from './userListWrapper'

export default async function ProfilePage({ params }) {

    const { supabase, user } = await getSupabaseWithUser()
    const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

    const awaitedParams = await params;
    const { username } = awaitedParams;
    console.log(username);

    // Fetch the current profile from Supabase
    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !profile) {
        return <div>Sorry, this page isn't available.</div>
    }

    const isOwnProfile = user && user.id === profile.id;

    // Count posts.
    const { count: postsCount } = await supabase
        .from('posts')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', profile.id);

    // Count followers.
    const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('recipient', profile.id);
    // Count following.
    const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower', profile.id);

    // Check if current user follows this profile
    const { data: followData } = await supabase
        .from('follows')
        .select('*')
        .eq('follower', user?.id)
        .eq('recipient', profile.id)
        .maybeSingle();

    const isFollowing = !followData;

    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profile.id);

    return (
        <div className="flex min-h-screen bg-zinc-900 text-white">
            {/* Sidebar */}
            <aside className="w-90 p-4 border-r border-zinc-700 fixed h-full flex flex-col justify-between">
                <div className="flex flex-col flex-grow">
                    <img src="/ig-logo.svg" alt="Instagram Logo" className="w-2/3" />
                    <nav className="ml-4 space-y-4">
                        <SidebarItem label="Home" icon="/icons/home-icon.svg" href="/"/>
                        <SidebarItem label="Explore" icon="/icons/compass-icon.svg" href="/explore"/>
                        <SidebarItem label="Create" icon="/icons/create-icon.svg" href="/create"/>
                        <SidebarItem label="Profile" icon={userProfile?.avatar_url} href={userProfile.username} className="rounded-full object-cover"/>
                    </nav>
                </div>
                <div className="mt-80">
                    <button onClick={logout} className="flex items-center gap-4 w-full px-3 py-2 rounded-md hover:bg-zinc-800 ">
                        <Image
                            src="/icons/logout-icon.svg"
                            alt="Log Out"
                            width={36}
                            height={36}
                            className="object-contain"
                        ></Image>
                        <span className="text-xl">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-90 flex-1 p-8">
                <div className="max-w-3xl mx-auto ">
                    {/* Profile Header */}
                    <div className="flex space-x-10 border-b border-zinc-700">
                        <Image
                            src={profile?.avatar_url}
                            alt="Profile Picture"
                            width={800}
                            height={800}
                            className="w-60 h-60 my-10 mr-20 rounded-full object-cover"
                        />
                        <div className="mt-10">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl font-semibold">{profile.username}</h2>
                                {isOwnProfile ? (
                                    <Link href="/edit-profile" passHref>
                                        <button className="ml-4 bg-zinc-600 px-5 py-2 rounded-xl text-md font-bold hover:bg-zinc-700">Edit Profile</button>
                                    </Link>
                                ) : (
                                <div className="flex">
                                    {isFollowing ? (
                                        <form action={follower}>
                                            <input type="hidden" name="username" value={profile.username}/>
                                            <button type="submit" className="ml-4 bg-blue-500 px-5 py-2 rounded-xl text-md font-bold hover:bg-blue-600">
                                                Follow
                                            </button>
                                        </form>
                                    ) : (
                                        <form action={unfollower}>
                                            <input type="hidden" name="username" value={profile.username}/>
                                            <button type="submit" className="ml-4 bg-zinc-600 px-5 py-2 rounded-xl text-md font-bold hover:bg-zinc-700">
                                                Following
                                            </button>
                                        </form>
                                    )}
                                    <button className="ml-4 bg-zinc-600 px-5 py-2 rounded-xl text-md font-bold hover:bg-zinc-700">
                                        Message
                                    </button>
                                </div>
                                )}
                                
                            </div>
                            <div className="text-xl flex space-x-10 mt-8">
                                <span><strong>{postsCount}</strong> posts</span>
                                <div className="flex flex-row">
                                    <p><strong>{followersCount}</strong></p>
                                    <UserListWrapper profileId={profile.id} type='followers' />
                                </div>
                                <div className="flex flex-row">
                                    <p><strong>{followingCount}</strong></p>
                                    <UserListWrapper profileId={profile.id} type='following' />
                                </div>
                            </div>
                            <div className="text-lg mt-10">
                                <p className="font-semibold">{profile.name}</p>
                                <p className="mt-2 mb-10">{profile.bio}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex"><div className="text-xl font-bold mx-auto px-3 py-5 border-t border-white">Posts</div></div>
                    {/* Posts Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {posts?.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className="bg-zinc-800 rounded overflow-hidden">
                                    <Link href={`/p/${post.id}`}>
                                        <Image
                                            src={post.image_url}
                                            alt={`Post ${post.id}`}
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-full"
                                        />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-lg text-zinc-400">
                                <p>No posts yet.</p>
                                {isOwnProfile && (
                                    <Link href="/create">
                                        <button className="mt-4 bg-blue-500 px-5 py-2 rounded-xl text-md font-bold hover:bg-blue-600">
                                            Create your first post
                                        </button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}


function SidebarItem(props) {
    const isProfile = props.label === "Profile";
    const isPage = props.label === "Profile";

    return (
        <Link href={props.href} passHref>
            <button className="flex items-center gap-8 w-full px-3 py-5 rounded-md hover:bg-zinc-800">
                <Image
                    src={props.icon}
                    alt={props.label}
                    width={36}
                    height={36}
                    className={`${isProfile ? 'rounded-full object-cover' : 'object-contain'}`}
                />
                <span className={`text-xl ${isPage ? 'font-bold' : ''}`}>{props.label}</span>
            </button>
        </Link>
    );
}