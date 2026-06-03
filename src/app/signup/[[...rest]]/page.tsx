import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 py-12">
      <Link href="/" className="flex flex-col items-center mb-8">
        <LogoMark size={48} />
        <p className="text-2xl font-bold text-primary mt-2">Sugar Buddy</p>
        <p className="text-sm text-text-secondary mt-1">Smart Glucose Tracker</p>
      </Link>
      <SignUp routing="hash" />
    </div>
  );
}
