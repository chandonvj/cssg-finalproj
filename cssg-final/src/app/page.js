// import Image from "next/image";
import Link from "next/link";

export default function InstagramClone() {
  return (
    <div className="bg-black text-white">
      {/* Header */}
      <header className="flex justify-center border-b-2 border-gray-700 py-4">
        <img src="./ig-logo.png" alt="Instagram Logo" className="w-1/8 mr-60" />
        <button className="px-4 py-2 bg-sky-500 mr-10">Log In</button>
        <button className="px-4 py-2 bg-sky-500">Sign Up</button>
      </header>

      {/* Profile Section */}
      <div id="profile" className="mt-6 mx-auto flex flex-row items-center space-x-6 w-7/12 border-b-2 border-gray-700 pb-4">
        <img
          src="./baby-tux.jpg"
          alt="Profile"
          className="rounded-full w-55 h-55 ml-5"
        />
        <div id="prof_text" className="flex flex-col w-full">
          <div className="flex items-center space-x-4">
            <p className="text-2xl">Baby Penguin</p>
            <button
              id="follow"
              className="bg-sky-500 px-4 py-2 text-white"
            >
              Follow
            </button>
          </div>
          <div className="flex space-x-6 mt-3">
            <p className="text-lg">4 posts</p>
            <p className="text-lg">12 followers</p>
            <p className="text-lg">8 following</p>
          </div>
          <p className="mt-4">description stuff goes here !!!</p>
        </div>
      </div>

      {/* Posts Section */}
      <div id="posts" className="mx-auto mt-6 grid grid-cols-3 gap-4 w-7/12">
        <div className="post w-full h-96 overflow-hidden rounded-lg">
          <img
            src="post1.png"
            alt="Post 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="post w-full h-96 overflow-hidden rounded-lg">
          <img
            src="post2.png"
            alt="Post 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="post w-full h-96 overflow-hidden rounded-lg">
          <img
            src="post3.png"
            alt="Post 3"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="post w-full h-96 overflow-hidden rounded-lg">
          <img
            src="post4.png"
            alt="Post 4"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex justify-center border-b-2 border-gray-700 py-4 mt-10">
        <Link href="/about">
          <button className="px-4 py-2 bg-sky-500 mr-10">Go to about test page.</button>
        </Link>
        <Link href="/contact">
          <button className="px-4 py-2 bg-sky-500">Go to contact test page.</button>
        </Link>
      </div>
        
    </div>
  );
}
