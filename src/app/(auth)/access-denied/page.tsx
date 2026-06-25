import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You do not have administrative privileges to access this area. If you
          believe this is an error, please contact the system administrator.
        </p>
        <Link href="/">
          <GlowButton variant="secondary">Return to Homepage</GlowButton>
        </Link>
      </div>
    </div>
  );
}
