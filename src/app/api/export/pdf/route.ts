// @ts-nocheck
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { getUserPlan } from '@/lib/planLimits';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plan = await getUserPlan(userId);
  if (plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30');

  // Fetch user
  const users = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT name, email, age, "diabetesType", "onInsulin" FROM "User" WHERE id = $1', userId
  );
  const user = users[0] || {};

  // Fetch readings
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const readings = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT value, type, classification, notes, "takenAt" FROM "Reading" WHERE "userId" = $1 AND "takenAt" >= $2 ORDER BY "takenAt" ASC',
    userId, cutoff.toISOString()
  );

  // Stats
  const values = readings.map(r => Number(r.value));
  const total = readings.length;
  const avg = total > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / total) : 0;
  const highest = total > 0 ? Math.round(Math.max(...values)) : 0;
  const lowest = total > 0 ? Math.round(Math.min(...values)) : 0;
  const inRange = readings.filter(r => r.classification === 'IN_RANGE').length;
  const danger = readings.filter(r => r.classification === 'DANGER').length;
  const inRangePct = total > 0 ? Math.round((inRange / total) * 100) : 0;
  // Estimated HbA1c = (avg + 46.7) / 28.7
  const estHbA1c = total > 0 ? ((avg + 46.7) / 28.7).toFixed(1) : 'N/A';

  // Generate PDF
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(5, 150, 105); // primary green
  doc.text('Sugar Buddy', 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Glucose Report — Last ${days} Days`, 20, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, 34);

  // Patient info
  doc.setDrawColor(229, 231, 235);
  doc.line(20, 40, 190, 40);
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text('Patient Information', 20, 48);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Name: ${user.name || 'N/A'}`, 20, 55);
  doc.text(`Email: ${user.email || 'N/A'}`, 20, 61);
  doc.text(`Age: ${user.age || 'N/A'}`, 110, 55);
  doc.text(`Diabetes Type: ${user.diabetesType || 'N/A'}`, 110, 61);
  doc.text(`On Insulin: ${user.onInsulin ? 'Yes' : 'No'}`, 110, 67);

  // Stats summary
  doc.line(20, 73, 190, 73);
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text('Summary Statistics', 20, 81);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Total Readings: ${total}`, 20, 88);
  doc.text(`Average: ${avg} mg/dl`, 20, 94);
  doc.text(`Highest: ${highest} mg/dl`, 20, 100);
  doc.text(`Lowest: ${lowest} mg/dl`, 110, 88);
  doc.text(`In Range: ${inRangePct}% (${inRange}/${total})`, 110, 94);
  doc.text(`Danger Readings: ${danger}`, 110, 100);
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text(`Estimated HbA1c: ${estHbA1c}%`, 20, 108);
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text('(Estimate based on average glucose — consult doctor for actual HbA1c)', 20, 113);

  // Readings table
  doc.line(20, 118, 190, 118);
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text('Reading Details', 20, 126);

  const tableData = readings.slice(0, 100).map(r => {
    const d = new Date(r.takenAt as string);
    const typeLabels: Record<string, string> = { FASTING: 'Fasting', POST_MEAL: 'Post-Meal', RANDOM: 'Random', BEDTIME: 'Bedtime' };
    const classLabels: Record<string, string> = { IN_RANGE: 'Normal', HIGH: 'High', LOW: 'Low', DANGER: 'Danger' };
    return [
      d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }),
      d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      `${Math.round(Number(r.value))} mg/dl`,
      typeLabels[r.type as string] || r.type,
      classLabels[r.classification as string] || r.classification,
      ((r.notes as string) || '').slice(0, 30),
    ];
  });

  (doc as any).autoTable({
    startY: 130,
    head: [['Date', 'Time', 'Value', 'Type', 'Status', 'Notes']],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 20, right: 20 },
  });

  // Footer disclaimer
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text('Disclaimer: This report is for educational purposes only. Sugar Buddy is not a medical device.', 20, finalY + 10);
  doc.text('Always consult your doctor for medical advice. Do not change medication based on this report.', 20, finalY + 15);

  const pdfBuffer = doc.output('arraybuffer');

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="sugar-buddy-report-${days}days-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}
