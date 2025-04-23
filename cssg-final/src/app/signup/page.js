import { signup } from '../actions'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 w-full max-w-sm p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-0">
          <img
            src="/ig-logo.svg"
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
            id="name"
            name="name"
            type="name"
            placeholder="Full Name"
            required
            className="w-full p-3 bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="username"
            name="username"
            type="username"
            placeholder="Username"
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
          <p className="text-zinc-500">
            By signing up, you agree to our <a className="text-blue-500 text-sm hover:underline">Terms</a
            > , <a className="text-blue-500 text-sm hover:underline">Privacy Policy</a> and <a className="text-blue-500 text-sm hover:underline">Cookies Policy</a>.
          </p>
          <button formAction={signup}
          className="w-full bg-blue-500 p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-10">
            Sign Up</button>
        </form>

        <div className="my-8 text-center text-white">-------------------------- OR --------------------------</div>

        <div className="text-center">Have an account? <a href="/login" className="text-blue-500 text-sm hover:underline">Log In</a></div>
      </div>
    </div>
  )
}