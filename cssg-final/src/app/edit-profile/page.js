import Link from 'next/link';
import Image from "next/image";
import { logout, getSupabaseWithUser, editProfile } from '../actions'
import AvatarUploadWrapper from './AvatarUploaderWrapper'


export default async function EditorPage() {

    const { supabase, user } = await getSupabaseWithUser()
    const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

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
                <div className="mt-80">
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
            <main className="ml-72 w-full px-10 py-20">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-10">Edit Profile</h1>
                    {/* Avatar */}
                    <div className="bg-zinc-800 rounded-3xl flex items-center mb-10">
                        <Image
                            src={userProfile?.avatar_url}
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            className="rounded-full object-cover m-5"
                        />
                        <p className="text-xl font-bold">{userProfile.username}</p>
                        <div className="ml-auto mr-5">
                            <AvatarUploadWrapper userId={user?.id} />
                        </div>
                    </div>
                    <form className="space-y-10" action={editProfile}>
                        {/* Full Name */}
                        <div>
                            <label className="block text-xl font-semibold mb-1">Display Name</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={userProfile?.name || ''}
                                className="w-full px-4 py-2 text-zinc-400 focus:text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xl font-semibold mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                defaultValue={userProfile?.username || ''}
                                className="w-full px-4 py-2 text-zinc-400 focus:text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xl font-semibold mb-1">Bio</label>
                            <textarea
                                name="bio"
                                defaultValue={userProfile?.bio || ''}
                                rows="3"
                                className="w-full px-4 py-2 text-zinc-400 focus:text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="float-right">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 px-36 py-4 rounded-lg text-xl text-white font-semibold"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

function SidebarItem(props) {
    const isProfile = props.label === "Profile";

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
                <span className="text-xl">{props.label}</span>
            </button>
        </Link>
    );
}