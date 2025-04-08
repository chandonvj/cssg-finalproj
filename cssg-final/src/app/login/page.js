import { login } from '../actions'

export default function LoginPage() {  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 w-full max-w-sm p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-0">
          <img
            src="./ig-logo.svg"
            alt="Instagram Logo"
            className="w-64"
          />
        </div>
        <form className="flex-col space-y-4 text-white">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <a className="ml-45 text-blue-500 text-sm hover:underline">
            Forgotten password?
          </a>
          <button formAction={login} 
          className="w-full bg-blue-500 p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-10">
            Log In</button>
        </form>

        <div className="my-8 text-center text-white">-------------------------- OR --------------------------</div>

        <div className="text-center">Don't have an account? <a href="../signup" className="text-blue-500 text-sm hover:underline">Sign Up</a></div>
      </div>
    </div>
  )
}