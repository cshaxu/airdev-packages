/* "@airdev/next": "managed" */

import AppearanceDialog from '@/airdev/frontend/components/shell/AppearanceDialog';
import { Blocks, Settings2, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import Footer from './Footer';
import GetStartedDialog from './GetStartedDialog';

const landingPanelClassName =
  'rounded-3xl border border-[var(--shell-tint-100)] bg-linear-to-br from-[var(--shell-tint-50-70)] via-background to-[var(--shell-page-mid)] shadow-xl shadow-[color:var(--shell-shadow-tint)]';

const landingTileClassName =
  'rounded-2xl border border-[var(--shell-tint-100)] bg-linear-to-br from-[var(--shell-tint-50-70)] to-background shadow-sm shadow-[color:var(--shell-shadow-tint)]';

const highlights = [
  {
    title: 'Auth Included',
    description:
      'Google sign-in, session handling, and user records are already wired into the starter.',
    icon: ShieldCheck,
  },
  {
    title: 'Generated APIs',
    description:
      'Airent and airent-api-next provide data routes, clients, hooks, debug endpoints, and admin tooling.',
    icon: Blocks,
  },
  {
    title: 'Ready To Extend',
    description:
      'Keep the scaffolding and add only the domain models and UI your app actually needs.',
    icon: Wrench,
  },
];

const steps = [
  {
    title: 'Sign In',
    description: 'Use the built-in authentication flow to enter the workspace.',
  },
  {
    title: 'Define Models',
    description:
      'Add Prisma models and let the generated API surface update with them.',
  },
  {
    title: 'Build Product',
    description:
      'Layer your own pages, jobs, webhooks, and admin behavior on top.',
  },
];

export default function Landing() {
  return (
    <div className="to-background text-foreground flex h-screen flex-col overflow-y-auto bg-gradient-to-b from-[var(--shell-page-start)] via-[var(--shell-page-mid)]">
      <header className="bg-background/80 sticky top-0 z-20 border-b border-[var(--shell-tint-100-80)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <AppearanceDialog
            className="gap-3 px-1 py-1 hover:opacity-90"
            labelClassName="text-lg font-semibold tracking-tight"
            logoSize={36}
          />
          <GetStartedDialog />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 md:px-8">
        <section
          id="overview"
          className="grid scroll-mt-24 items-center gap-10 pt-14 pb-12 md:grid-cols-2 md:pt-20"
        >
          <div className="space-y-6">
            <div className="bg-background inline-flex items-center gap-2 rounded-full border border-[var(--shell-tint-200)] px-3 py-1 text-sm text-[var(--shell-tint-700)]">
              <Sparkles className="size-4" />
              Minimal app template
            </div>
            <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-5xl">
              Start with the framework, not a prebuilt product.
            </h1>
            <p className="text-muted-foreground text-lg leading-8">
              Keep auth, generated APIs, jobs, webhooks, debug tooling, and
              admin scaffolding while leaving the feature layer intentionally
              thin.
            </p>
            <GetStartedDialog triggerClassName="h-12 rounded-2xl px-6 text-base" />
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-[var(--shell-glow-start)] to-[var(--shell-glow-end)] blur-2xl" />
            <div className={`${landingPanelClassName} space-y-4 p-6`}>
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Settings2 className="size-4 text-[var(--shell-tint-600)]" />
                Template Snapshot
              </div>
              <div className="rounded-2xl border border-[var(--shell-tint-100)] bg-[var(--shell-tint-50-70)] p-4">
                <p className="text-muted-foreground text-sm">Default Shape</p>
                <p className="text-2xl font-semibold">
                  Auth + Admin + Generated Data Layer
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--status-kept-border)] bg-[var(--status-kept-bg)] p-4">
                  <p className="text-sm text-[var(--status-kept-foreground)]">
                    Kept
                  </p>
                  <p className="text-xl font-semibold">Framework Scaffolding</p>
                </div>
                <div className="rounded-2xl border border-[var(--status-removed-border)] bg-[var(--status-removed-bg)] p-4">
                  <p className="text-sm text-[var(--status-removed-foreground)]">
                    Removed
                  </p>
                  <p className="text-xl font-semibold">
                    Example Product Features
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="grid scroll-mt-24 gap-4 py-8 md:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className={`${landingTileClassName} p-5`}
              >
                <div className="mb-3 inline-flex rounded-lg bg-[var(--shell-tint-100)] p-2 text-[var(--shell-tint-700)]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-6">
                  {item.description}
                </p>
              </article>
            );
          })}
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-8">
          <div className={`${landingPanelClassName} p-6 md:p-8`}>
            <h2 className="text-2xl font-semibold tracking-tight">
              How It Works
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl bg-[var(--shell-tint-50-70)] p-4"
                >
                  <p className="text-sm font-medium text-[var(--shell-tint-700)]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
