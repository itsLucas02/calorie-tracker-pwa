import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/state/session";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";
import { HeroDemo } from "./welcome/HeroDemo";
import { Ticker } from "./welcome/Ticker";
import { FeatureCards } from "./welcome/FeatureCards";

export default function WelcomeScreen() {
  const { signInWithGoogle } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in didn't complete. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Logo />
        <Button variant="ghost" size="sm" loading={loading} onClick={handleSignIn}>
          Sign in
        </Button>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5">
        {/* ---- hero ---- */}
        <section className="pt-10 pb-10 text-center md:pt-14">
          <h1 className="font-display text-[40px] leading-[1.04] font-semibold tracking-tight text-ink sm:text-[52px]">
            Say what you ate.
            <br />
            We <span className="marker">kira</span> the rest.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Describe a meal in plain words — nasi lemak, roti canai, teh tarik kurang manis — and get calories and
            macros in seconds. No weighing, no searching, no spreadsheets.
          </p>
          <div className="mx-auto mt-6 max-w-sm">
            <Button variant="secondary" size="lg" loading={loading} onClick={handleSignIn} className="w-full border-line-strong">
              <GoogleMark />
              Continue with Google
            </Button>
            {error && <p className="mt-2 text-[13px] font-medium text-bad">{error}</p>}
            <p className="mt-2.5 text-[12px] text-faint">Demo build — signs you into a local account. No real Google needed.</p>
          </div>
          <div className="anim-pop mx-auto mt-9 max-w-md text-left">
            <HeroDemo />
            <p className="mt-3 text-center text-[11.5px] text-faint">An actual live run of the analyser — this is the real product loop.</p>
          </div>
        </section>
      </main>

      {/* ---- dish ticker (full-bleed) ---- */}
      <Ticker />

      <main className="mx-auto w-full max-w-2xl px-5">
        {/* ---- features ---- */}
        <section className="py-12">
          <h2 className="font-display text-[24px] font-semibold tracking-tight text-ink sm:text-[28px]">
            Logging that takes seconds, not willpower.
          </h2>
          <p className="mt-1.5 max-w-lg text-[14px] text-muted">Three things KiraCal does, and does well. Nothing else gets in the way.</p>
          <div className="mt-6">
            <FeatureCards />
          </div>
        </section>

        {/* ---- local food banner ---- */}
        <section className="pb-12">
          <div className="overflow-hidden rounded-2xl border border-line bg-card">
            <img
              src="/images/local-foods.jpg"
              alt="Illustration of nasi lemak, roti canai, dhal and teh tarik"
              className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]"
              loading="lazy"
            />
            <div className="p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink">Malaysian food is first-class here.</h2>
                <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-muted">
                  Nasi kandar, kuah campur, telur masin, kurang manis — Kira speaks your kopitiam without translation.
                </p>
              </div>
              <Button variant="lime" className="mt-4 shrink-0 sm:mt-0" onClick={handleSignIn} loading={loading}>
                Try it free
                <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        </section>

        {/* ---- footer ---- */}
        <footer className="border-t border-line py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Logo size="sm" />
            <p className="text-[11.5px] leading-relaxed text-faint">
              Estimates for general guidance only — not medical advice.
              <br className="sm:hidden" /> “Kira” means “count” in Malay.
            </p>
          </div>
        </footer>
        <div className="pb-safe" />
      </main>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  );
}
