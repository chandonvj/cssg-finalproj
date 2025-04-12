import Image from "next/image";
import Link from 'next/link';
import { logout } from '../actions'

export default async function ProfilePage() {  
    return (
        <div className="flex min-h-screen bg-zinc-900 text-white">
            {/* Sidebar */}
            <aside className="w-90 p-4 border-r border-zinc-700 fixed h-full flex flex-col justify-between">
                <div className="flex flex-col flex-grow">
                    <img src="./ig-logo.svg" alt="Instagram Logo" className="w-2/3" />
                    <nav className="ml-4 space-y-4">
                        <SidebarItem label="Home" icon="/icons/home-icon.svg" href="/home"/>
                        <SidebarItem label="Explore" icon="/icons/compass-icon.svg" href="/explore"/>
                        <SidebarItem label="Create" icon="/icons/create-icon.svg" href="/create"/>
                        <SidebarItem label="Profile" icon="/baby-tux.jpg" href="/profile" className="rounded-full object-cover"/>
                    </nav>
                </div>
                <div className="mt-80">
                    <button onClick={logout} className="flex items-center gap-4 w-full px-3 py-2 rounded-md hover:bg-gray-100 text-left">
                        <Image
                            src="/icons/logout-icon.svg"
                            alt="Log Out"
                            width={36}
                            height={36}
                            className="object-contain"
                        ></Image>
                        <span className="text-md">Log Out</span>
                    </button>
                </div>
                    
            </aside>

            {/* Main Content */}
            <main className="ml-90 flex-1 p-8">
                <div className="max-w-3xl mx-auto ">
                    {/* Profile Header */}
                    <div className="flex space-x-10 border-b border-zinc-700">
                        <Image
                            src="/baby-tux.jpg"
                            alt="Profile Picture"
                            width={200}
                            height={200}
                            className="my-10 mr-20 rounded-full object-cover"
                        />
                        <div className="mt-10">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl font-semibold">baby_tux</h2>
                                <button className="ml-4 bg-zinc-600 px-5 py-2 rounded-xl text-md font-bold hover:bg-zinc-700">Edit Profile</button>
                            </div>
                            <div className="text-xl flex space-x-10 mt-8">
                                <span><strong>6</strong> posts</span>
                                <span><strong>1.2K</strong> followers</span>
                                <span><strong>321</strong> following</span>
                            </div>
                            <div className="text-lg mt-10">
                                <p className="font-semibold">Baby Tux</p>
                                <p className="mt-2">Here is a pretty cool description I guess.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex"><div className="text-xl font-bold mx-auto px-3 py-5 border-t border-white">Posts</div></div>
                    {/* Posts Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div key={num} className="aspect-square bg-zinc-800 rounded overflow-hidden">
                                <Image
                                    src={`/posts/post${num}.png`}
                                    alt={`Post ${num}`}
                                    width={300}
                                    height={500}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        ))}
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
            <button className="flex items-center gap-8 w-full px-3 py-5 rounded-md hover:bg-zinc-800 text-left">
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