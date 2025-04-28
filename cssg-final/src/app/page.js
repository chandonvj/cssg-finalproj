import Image from "next/image";
import Link from 'next/link';
import { logout, getSupabaseWithUser } from './actions';

export default async function HomePage() {  
  const { supabase, user } = await getSupabaseWithUser()

  const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();


    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users: user_id (
            username,
            avatar_url
        )
        `)
      .order('created_at', { ascending: false });

    if (error) {
        return <div>Sorry, we couldn't load the posts.</div>;
    }

    const postsWithCounts = await Promise.all(posts.map(async (post) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
    
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
    
        return {
          ...post,
          likesCount,
          commentsCount,
        };
    }));

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
        {/* Sidebar */}
        <aside className="w-90 p-4 border-r border-zinc-700 fixed h-full flex flex-col justify-between">
            <div className="flex flex-col flex-grow">
                <img src="/ig-logo.svg" alt="Instagram Logo" className="w-2/3" />
                <nav className="ml-4 space-y-4">
                    <SidebarItem label="Home" icon="/icons/home-icon.svg" href="/" className="text-bold"/>
                    <SidebarItem label="Explore" icon="/icons/compass-icon.svg" href="/explore"/>
                    <SidebarItem label="Create" icon="/icons/create-icon.svg" href="/create"/>
                    <SidebarItem label="Profile" icon={userProfile?.avatar_url} href={userProfile.username}/>
                </nav>
            </div>
            <div className="mt-80 ml-4">
                <button onClick={logout} className="flex items-center gap-4 w-full px-3 py-2 rounded-md hover:bg-zinc-800">
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
        <main className="ml-90 flex-1 p-8 flex justify-center">
            <div className="flex flex-col content-center">
                <h2 className="text-3xl font-bold mb-4">Feed</h2>
                <div className="justify-center items-center space-y-10 flex-wrap">
                    {postsWithCounts?.length > 0 ? (
                        postsWithCounts.map(post => (
                            <div key={post.id} className="bg-zinc-800 p-4 rounded-lg mx-2 my-8 content-center shadow-lg">
                                <Link href={`/p/${post.id}`}>
                                    <Image
                                        src={post.image_url}
                                        alt={`Post ${post.id}`}
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full rounded-lg"
                                    />  
                                </Link>
                                
                                <div className="flex items-start mb-4 mt-4">
                                    <Image
                                        src={post.users?.avatar_url || '/default-avatar.png'}
                                        alt={post.users?.username}
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                        <span className="font-semibold">{post.users?.username}</span>
                                        <br></br>
                                        <span>{post?.caption}</span>
                                    </div>
                                </div>

                                <div className="flex items-center mt-2 text-md text-gray-300">
                                    <span className="mr-4">❤️ {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'} </span>
                                    <span>💬 {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'} </span>
                                </div>

                                {post.comments?.slice(0, 3).map((comment, index) => (
                                    <div key={index} className="flex mt-1 text-md text-gray-300">
                                        <span className="font-semibold text-white">{comment.user}</span>: {comment.text}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div>No posts available.</div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
}

function SidebarItem(props) {
    const isProfile = props.label === "Profile";
    const isPage = props.label === "Home";

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