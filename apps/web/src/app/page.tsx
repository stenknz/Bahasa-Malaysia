import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-primary-600">BM Mastery</span>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Master Bahasa Malaysia
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Audio-first language learning designed for English speakers. Speak with confidence from day one.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700"
            >
              Start Learning Free
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-slate-300 px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign In
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: "Audio-First", desc: "Native pronunciation with male and female voices" },
              { title: "AI-Powered", desc: "Personalized conversation practice and feedback" },
              { title: "Proven Method", desc: "Spaced repetition for long-term retention" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6 text-left dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
