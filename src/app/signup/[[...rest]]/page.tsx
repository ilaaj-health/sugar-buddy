import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <LogoMark size={48} className="mx-auto" />
            <p className="text-2xl font-bold text-primary mt-2">Sugar Buddy</p>
          </Link>
          <p className="text-sm text-text-secondary mt-1">Smart Glucose Tracker</p>
        </div>
        <SignUp routing="hash" />
      </div>
    </div>
  );
}
