import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import TrendsChart from "./TrendsChart";
import { BarChart2 } from "lucide-react";

export default async function TrendsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const readings = await prisma.reading.findMany({
    where: { userId, takenAt: { gte: ninetyDaysAgo } },
    orderBy: { takenAt: "asc" },
    select: { id: true, value: true, type: true, classification: true, takenAt: true },
  });

  const values = readings.map((r: { value: number }) => r.value);
  const stats = {
    count: readings.length,
    average: values.length > 0 ? Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length) : 0,
    highest: values.length > 0 ? Math.round(Math.max(...values)) : 0,
    lowest: values.length > 0 ? Math.round(Math.min(...values)) : 0,
  };

  const serializedReadings = readings.map((r: { id: string; value: number; type: string; classification: string; takenAt: Date }) => ({
    id: r.id, value: r.value, type: r.type, classification: r.classification, takenAt: r.takenAt.toISOString(),
  }));

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Rujhaanaat (Trends)</h1>
      <p className="text-sm text-text-secondary mb-8">Trends & Statistics</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center"><div className="text-2xl font-bold text-zinc-900">{stats.count}</div><div className="text-xs text-text-secondary mt-1">Total</div></div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center"><div className="text-2xl font-bold text-primary">{stats.average}</div><div className="text-xs text-text-secondary mt-1">Average</div></div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center"><div className="text-2xl font-bold text-amber-600">{stats.highest}</div><div className="text-xs text-text-secondary mt-1">Highest</div></div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{stats.lowest}</div><div className="text-xs text-text-secondary mt-1">Lowest</div></div>
      </div>

      {readings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center">
          <BarChart2 className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Abhi tak koi Reading nahi</h2>
          <p className="text-text-secondary">Readings log karein taake trends dekh sakein.</p>
        </div>
      ) : (
        <TrendsChart readings={serializedReadings} />
      )}
    </div>
  );
}
