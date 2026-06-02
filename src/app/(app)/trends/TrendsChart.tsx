"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface Reading {
  id: string;
  value: number;
  type: string;
  classification: string;
  takenAt: string;
}

type RangeKey = "7" | "30" | "90";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "7", label: "7 din" },
  { key: "30", label: "30 din" },
  { key: "90", label: "90 din" },
];

const TYPE_LABELS: Record<string, string> = {
  FASTING: "Fasting",
  POST_MEAL: "Post-meal",
  RANDOM: "Random",
  BEDTIME: "Bedtime",
};

function classColor(c: string) {
  switch (c) {
    case "LOW":
      return "#3b82f6";
    case "NORMAL":
      return "#10b981";
    case "PRE_DIABETIC":
      return "#f59e0b";
    case "DIABETIC":
      return "#ef4444";
    case "DANGEROUSLY_HIGH":
      return "#dc2626";
    case "CRITICALLY_LOW":
      return "#1d4ed8";
    default:
      return "#6b7280";
  }
}

export default function TrendsChart({ readings }: { readings: Reading[] }) {
  const [range, setRange] = useState<RangeKey>("30");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - Number(range));

    return readings
      .filter((r) => new Date(r.takenAt) >= cutoff)
      .filter((r) => typeFilter === "ALL" || r.type === typeFilter);
  }, [readings, range, typeFilter]);

  const chartData = useMemo(
    () =>
      filtered.map((r) => ({
        date: new Date(r.takenAt).toLocaleDateString("en-PK", {
          month: "short",
          day: "numeric",
        }),
        value: r.value,
        classification: r.classification,
        type: r.type,
        color: classColor(r.classification),
      })),
    [filtered]
  );

  const types = useMemo(() => {
    const set = new Set(readings.map((r) => r.type));
    return Array.from(set);
  }, [readings]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex bg-zinc-100 rounded-lg p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === r.key
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="ml-auto text-xs border border-zinc-200 rounded-lg px-3 py-1.5 text-zinc-600 bg-white"
        >
          <option value="ALL">Sab Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t] ?? t}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-zinc-400">
          Is range mein koi reading nahi.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={{ stroke: "#f4f4f5" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 20", "dataMax + 20"]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #f4f4f5",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${value} mg/dl`, "Reading"]}
            />
            <ReferenceLine y={70} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: "Low", fontSize: 10, fill: "#3b82f6" }} />
            <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" label={{ value: "Normal", fontSize: 10, fill: "#10b981" }} />
            <ReferenceLine y={126} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Pre-diabetic", fontSize: 10, fill: "#f59e0b" }} />
            <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Diabetic", fontSize: 10, fill: "#ef4444" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-zinc-50">
        {[
          { label: "Low", color: "#3b82f6" },
          { label: "Normal", color: "#10b981" },
          { label: "Pre-diabetic", color: "#f59e0b" },
          { label: "Diabetic", color: "#ef4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-zinc-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
