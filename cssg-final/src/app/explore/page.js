import Link from 'next/link';
import Image from "next/image";
import { logout, getSupabaseWithUser } from '../actions'

export default async function ExplorePage() {
    const { supabase, user } = await getSupabaseWithUser()
    const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

    const { data: users = [], error } = await supabase
        .from("users")
        .select("id, username, name, avatar_url")
        .neq("id", user?.id); // exclude the current user
    if (error) {
        console.error("Error fetching users:", error.message);
    }

    return (
        <div className="flex min-h-screen bg-zinc-900 text-white items-center">
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


            <main className="ml-90 flex justify-center w-full">
                <div className="mx-auto">
                    <div className="bg-zinc-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto text-white relative">
                        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
                        <ul className="space-y-4">
                            {users.map((u) => (
                                <li key={u.id} className="flex items-center space-x-4">
                                <Link href={`/${u.username}`}>
                                    <Image src={u.avatar_url} alt={u.username} width={40} height={40} className="w-12 h-12 rounded-full object-cover cursor-pointer" />
                                </Link>
                                <div>
                                    <Link href={`/${u.username}`}>
                                    <p className="font-bold hover:underline cursor-pointer">{u.username}</p>
                                    </Link>
                                    <p className="text-sm text-zinc-400">{u.name}</p>
                                </div>
                                </li>
                            ))}
                            {users.length === 0 && <p className="text-center text-zinc-400 mt-10">No users found</p>}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarItem(props) {
    const isProfile = props.label === "Profile";
    const isPage = props.label === "Explore";

    return (
        <Link href={props.href} passHref>
            <button className="flex items-center gap-8 w-full px-3 py-5 rounded-md hover:bg-zinc-800 ">
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