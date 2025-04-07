import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="bg-black text-white">
      {/* Header */}
      <header className="flex justify-center border-b-2 border-gray-700 py-4">
        <p> This is a test _contact_ page.</p>

        <Link href="../">
        <button className="px-4 py-2 bg-sky-500 ml-10 mr-10">Go Back to Main page.</button>
        </Link>
        <Link href="../about">
        <button className="px-4 py-2 bg-sky-500">Go to about test page.</button>
        </Link>
      </header>      
    </div>
  );
}
