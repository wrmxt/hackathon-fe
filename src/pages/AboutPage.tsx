import React from "react";
import Button from "@/components/ui/button";
import aboutBg from "@/assets/about_bg.jpg";

// Helper components (shadcn-like styling)
function Card({
                children,
                className = "",
              }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
                      children,
                      className = "",
                    }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 border-b border-border/60 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({
                     children,
                     className = "",
                   }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold leading-tight ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({
                           children,
                           className = "",
                         }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

function CardContent({
                       children,
                       className = "",
                     }: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Avatar({
                  children,
                  className = "",
                }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
                    label,
                    value,
                    caption,
                  }: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardContent>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}

function TeamMemberCard({
                          name,
                          role,
                          bio,
                          initials,
                        }: {
  name: string;
  role: string;
  bio: string;
  initials: string;
}) {
  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar>
            <span className="text-sm font-semibold">{initials}</span>
          </Avatar>
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold">{name}</h4>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{bio}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-100 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">{/* reverted richer gradient */}
      <section className="relative h-screen w-full overflow-hidden border-b border-border/60">
        <img
          src={aboutBg}
          alt="Neighbors sharing and reducing waste together"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 dark:from-black/60 dark:via-black/70 dark:to-black/80" />{/* stronger overlay */}

        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-6 pt-24 pb-16 text-white sm:px-10">{/* hero text forced white */}
          <span className="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-xs px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">{/* custom badge */}
            About us
          </span>

          <div className="mt-6 space-y-5">
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
              Building kinder, zero-waste neighborhoods together
            </h1>
            <p className="max-w-2xl text-base font-medium text-white/90 sm:text-lg">
              shAIring helps neighbors share items, avoid overbuying, and reduce waste and CO₂. Join local events, lend tools, and make apartment life more connected and sustainable.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="default" className="bg-white text-black hover:bg-white/90 shadow">Meet the team</Button>
            <Button variant="outline" className="border-white/40 text-white bg-transparent hover:bg-transparent focus-visible:ring-white/40">Our mission</Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-14">
        <section>
          <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Our mission</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                We believe everyday sharing can cut waste, save money, and bring neighbors closer—especially in apartment buildings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  shAIring exists to reduce overconsumption. Too many items sit unused while others buy duplicates. We make it easy to lend, borrow, and co-own things in your building.
                </p>
                <p>
                  By tracking shared items and impact, we help communities see how much waste and CO₂ they avoid. Simple actions, real results.
                </p>
                <p>
                  Our focus is apartment buildings and local communities— because the best sharing happens close to home.
                </p>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                <StatCard label="Items shared" value="+120" caption="In the last 6 months" />
                <StatCard label="CO₂ saved" value="≈ 350 kg" caption="Calculated from avoided purchases" />
                <StatCard label="Neighbors connected" value="+45" caption="Active participants this month" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-10 border-t border-border/60 pt-12">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">The team behind shAIring</h2>
            <p className="text-sm text-muted-foreground">We’re builders and neighbors who care about circular design and clean, simple UI.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <TeamMemberCard name="Alex" role="Frontend & UX" bio="Loves circular economy and clear interfaces." initials="AX" />
            <TeamMemberCard name="Mia" role="Backend & Data" bio="Optimizes for impact and reliability." initials="MI" />
            <TeamMemberCard name="Leo" role="Community" bio="Connects neighbors and hosts sharing events." initials="LE" />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
              <CardContent>
                <div className="flex items-center gap-3 text-lg">
                  <span role="img" aria-label="Handshake">🤝</span>
                  <span className="font-semibold">Community first</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Designed to make meeting, sharing, and trusting neighbors easy.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
              <CardContent>
                <div className="flex items-center gap-3 text-lg">
                  <span role="img" aria-label="Recycle">♻️</span>
                  <span className="font-semibold">Designed for reuse</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Less buying, more borrowing—keep items in use, not in closets.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
              <CardContent>
                <div className="flex items-center gap-3 text-lg">
                  <span role="img" aria-label="Chart">📊</span>
                  <span className="font-semibold">Transparent impact</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Track avoided waste and CO₂, celebrate small wins together.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
