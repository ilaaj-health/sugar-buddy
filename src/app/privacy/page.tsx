import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <HeroSection tag="Legal" title="Privacy Policy" subtitle="How we collect, use, and protect your data." />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="space-y-6">
          <Section title="1. Introduction">
            Sugar Buddy (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a diabetes management application. This Privacy Policy explains how we collect, use, and protect your personal and health information.
          </Section>
          <Section title="2. Information We Collect">
            <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
              <li><strong>Account Information:</strong> Name, email address (via Clerk authentication)</li>
              <li><strong>Health Data:</strong> Blood glucose readings, reading type, timestamps</li>
              <li><strong>Profile Data:</strong> Age, diabetes type, insulin status</li>
              <li><strong>Chat Data:</strong> Messages sent to the AI copilot</li>
              <li><strong>Payment Data:</strong> Processed securely by Stripe — we never store card numbers</li>
            </ul>
          </Section>
          <Section title="3. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
              <li>To provide glucose tracking and AI explanations</li>
              <li>To generate trends and insights from your readings</li>
              <li>To personalize AI responses based on your health profile</li>
              <li>To process payments for premium subscriptions</li>
              <li>To send reminders and notifications (if enabled)</li>
            </ul>
          </Section>
          <Section title="4. Data Storage & Security">
            Your data is stored in a secure PostgreSQL database hosted on Railway (cloud infrastructure). All connections are encrypted via SSL. Authentication is handled by Clerk. We use HTTPS for all data transmission.
          </Section>
          <Section title="5. AI & Third-Party Services">
            When you use AI features, your reading data and messages are sent to OpenRouter (which routes to Anthropic Claude) for processing. We send only minimum data needed. OpenRouter does not store your data for training. Payment processing is handled by Stripe.
          </Section>
          <Section title="6. Data Sharing">
            We do NOT sell, rent, or share your personal or health data with any third party for marketing. Data is shared only with Clerk (auth), Stripe (payments), and OpenRouter/Anthropic (AI processing).
          </Section>
          <Section title="7. Your Rights">
            You can access your data through the app, update or correct your profile, delete your account and all data, and export your reading history. Contact support@sugarbuddy.app to exercise these rights.
          </Section>
          <Section title="8. Medical Disclaimer">
            Sugar Buddy is NOT a medical device. It does not diagnose, treat, or prescribe. All AI-generated explanations are educational only. Always consult your doctor for medical decisions.
          </Section>
          <Section title="9. Children&apos;s Privacy">
            Sugar Buddy is not intended for children under 13. We do not knowingly collect data from children under 13.
          </Section>
          <Section title="10. Changes to This Policy">
            We may update this policy from time to time. Changes will be reflected on this page. Continued use after changes constitutes acceptance.
          </Section>
          <Section title="11. Contact">
            For privacy-related questions: <strong>support@sugarbuddy.app</strong>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-zinc-900 mb-2">{title}</h2>
      <div className="text-sm text-zinc-600 leading-relaxed">{children}</div>
    </div>
  );
}
