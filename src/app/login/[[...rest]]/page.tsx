import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-2">
            <LogoMark size={34} />
            <span className="text-2xl font-bold text-primary mt-1">Sugar Buddy</span>
          </Link>
          <p className="text-sm text-text-secondary mt-1">Smart Glucose Tracker</p>
        </div>
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
