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

    return (
        <div className="flex min-h-screen bg-zinc-900 text-white items-center">
            {/* Sidebar */}
            <aside className="w-90 p-4 border-r border-zinc-700 fixed h-full flex flex-col justify-between">
                <div className="flex flex-col flex-grow">
                    <img src="./ig-logo.svg" alt="Instagram Logo" className="w-2/3" />
                    <nav className="ml-4 space-y-4">
                        <SidebarItem label="Home" icon="/icons/home-icon.svg" href="./" className="text-bold"/>
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

        </div>
    );
}





function SidebarItem(props) {
    const isProfile = props.label === "Profile";
    const isPage = props.label === "Create";

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