import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-red-600">
            Access Denied
          </h2>
          <p className="mt-4 text-gray-600">
            You are not authorized to access the TechDeals AI admin dashboard.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            &larr; Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
