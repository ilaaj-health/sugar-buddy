import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";
import { PlanCard } from "./PlanCard";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, age: true, diabetesType: true, onInsulin: true, plan: true, stripeCustomerId: true, createdAt: true } });
  if (!user) redirect("/dashboard");

  return (
    <div className="max-w-lg px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Settings</h1>
      <p className="text-sm text-text-secondary mb-8">Apni profile information update karein</p>
      <PlanCard plan={user.plan} hasStripe={!!user.stripeCustomerId} />
      <ProfileForm defaultValues={{ name: user.name || "", email: user.email, age: user.age || 0, diabetesType: user.diabetesType || "TYPE_2", onInsulin: user.onInsulin, createdAt: user.createdAt.toISOString() }} />
    </div>
  );
}
