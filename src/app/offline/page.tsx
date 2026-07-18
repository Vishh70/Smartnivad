import Link from "next/link";
import { WifiOff, Home } from "lucide-react";
import { RetryButton } from "@/components/pwa/RetryButton";
export const metadata = {
  title: "Offline | SmartNivad",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <WifiOff className="w-16 h-16 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
        You&apos;re offline
      </h1>

      <p className="text-lg text-gray-600 max-w-md mb-8">
        It looks like you lost your internet connection. Recently viewed deals
        and cached pages are still available.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <RetryButton />

        <Link href="/" className="w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-100 text-gray-900 h-10 px-4 py-2 rounded-md font-medium transition-colors w-full">
            <Home className="w-4 h-4" />
            Browse Cached Deals
          </button>
        </Link>
      </div>
    </div>
  );
}
