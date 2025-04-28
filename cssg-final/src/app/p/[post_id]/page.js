import Link from 'next/link';
import Image from "next/image";
import { logout, getSupabaseWithUser, deleteComment } from '../../actions'
import InteractWrapper from './interactWrapper';
import Interact from './interact'

export default async function PostPage({ params }) {
    const { supabase, user } = await getSupabaseWithUser()
    const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

    const awaitedParams = await params;
    const { post_id } = awaitedParams;

    // Fetch the current post from Supabase
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', post_id)
        .single();

    if (error || !post) {
        return <div>Sorry, this page isn't available.</div>
    }

    const { data: posterUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', post.user_id)
        .single();

    const { data: comments } = await supabase
        .from('comments')
        .select('*, users ( username, avatar_url )')
        .eq('post_id', post_id)
        .order('created_at', { ascending: true });
    

    return (
        <div className="flex min-h-screen bg-zinc-900 text-white">
            {/* Sidebar */}
            <aside className="w-90 p-4 border-r border-zinc-700 fixed h-full flex flex-col justify-between">
                <div className="flex flex-col flex-grow">
                    <img src="/ig-logo.svg" alt="Instagram Logo" className="w-2/3" />
                    <nav className="ml-4 space-y-4">
                        <SidebarItem label="Home" icon="/icons/home-icon.svg" href="/"/>
                        <SidebarItem label="Explore" icon="/icons/compass-icon.svg" href="../explore"/>
                        <SidebarItem label="Create" icon="/icons/create-icon.svg" href="../create"/>
                        <SidebarItem label="Profile" icon={userProfile?.avatar_url} href={`../${userProfile.username}`} className="rounded-full object-cover"/>
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


            <main className="ml-90 flex-1 p-36 flex justify-center items-start mt-10">
                <div className="flex bg-zinc-800 rounded-lg overflow-hidden max-w w-full">
                    <div className="w-1/2 bg-black">
                        <Image
                            src={post?.image_url}
                            alt="Post Image"
                            width={500}
                            height={500}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="w-1/2 flex flex-col p-6">
                        <div className="flex items-center mb-4">
                            <Image
                                src={posterUser?.avatar_url || '/default-avatar.png'}
                                alt={posterUser?.username}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                            />
                            <span className="ml-3 font-semibold text-lg">{posterUser?.username}</span>
                        </div>

                        <hr className="border-zinc-700 mb-4" />

                        <div className="flex items-start mb-4">
                            <Image
                                src={posterUser?.avatar_url || '/default-avatar.png'}
                                alt={posterUser?.username}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <span className="font-semibold">{posterUser?.username}</span>
                                <br></br>
                                <span>{post?.caption}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mt-4">
                            {comments?.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.post_id ?? `${comment.user_id}-${comment.created_at}`}
                                    className="flex items-start justify-between group">
                                        <div className="flex">
                                            <Image
                                                src={comment.users?.avatar_url || '/default-avatar.png'}
                                                alt={comment.users?.username}
                                                width={28}
                                                height={28}
                                                className="rounded-full object-cover mt-1"
                                            />
                                            <div className="ml-3">
                                                <span className="font-semibold">{comment.users?.username}</span>{' '}
                                                <span>{comment.content}</span>
                                            </div>
                                        </div>
                                        {comment.user_id === user?.id && (
                                            <form action={deleteComment}>
                                                <input type="hidden" name="id" value={comment.post_id} />
                                                <button
                                                    type="submit"
                                                    className="text-red-500 text-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200 ml-4"
                                                >
                                                    Delete
                                                </button>
                                            </form>                                      
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-400">No comments yet.</p>
                            )}
                        </div>
                        <div className="mt-auto">
                            <InteractWrapper>
                                <Interact post_id={post_id} user={user} />
                            </InteractWrapper>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


function SidebarItem(props) {
    const isProfile = props.label === "Profile";

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
                <span className={'text-xl'}>{props.label}</span>
            </button>
        </Link>
    );
}