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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background">
      {/* HERO: картинка на весь экран */}
      <section className="relative h-screen w-full overflow-hidden border-b border-border/60">
        <img
          src={aboutBg}
          alt="Neighbors sharing and reducing waste together"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay updated: светлая тема делает картинку светлее, тёмная — темнее */}
        <div className="absolute inset-0 bg-white/30 dark:bg-black/65 transition-colors duration-300" />

        <div className="relative z-10 flex h-full flex-col justify-center px-6 pt-24 pb-16 text-white sm:px-10">
          <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80 ring-1 ring-white/20">
            About us
          </span>

          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl max-w-3xl">
              Building kinder, zero-waste neighborhoods together
            </h1>
            <p className="max-w-2xl text-base text-white/85 sm:text-lg">
              shAIring helps neighbors share items, avoid overbuying, and reduce
              waste and CO₂. Join local events, lend tools, and make apartment
              life more connected and sustainable.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="bg-white text-black hover:bg-white/90">
              Meet the team
            </Button>
            <Button className="border-white/50 text-white hover:bg-white/10">
              Our mission
            </Button>
          </div>
        </div>
      </section>

      {/* КОНТЕНТ ПОСЛЕ HERO */}
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        {/* Our mission */}
        <section>
          <Card className="bg-background/95 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle>Our mission</CardTitle>
              <CardDescription>
                We believe everyday sharing can cut waste, save money, and bring
                neighbors closer—especially in apartment buildings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  shAIring exists to reduce overconsumption. Too many items sit
                  unused while others buy duplicates. We make it easy to lend,
                  borrow, and co-own things in your building.
                </p>
                <p>
                  By tracking shared items and impact, we help communities see
                  how much waste and CO₂ they avoid. Simple actions, real
                  results.
                </p>
                <p>
                  Our focus is apartment buildings and local communities—
                  because the best sharing happens close to home.
                </p>
              </div>
              {/* Stats row */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Items shared"
                  value="+120"
                  caption="In the last 6 months"
                />
                <StatCard
                  label="CO₂ saved"
                  value="≈ 350 kg"
                  caption="Calculated from avoided purchases"
                />
                <StatCard
                  label="Neighbors connected"
                  value="+45"
                  caption="Active participants this month"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team & values */}
        <section className="space-y-8 border-t border-border/60 pt-10">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">The team behind shAIring</h2>
            <p className="text-sm text-muted-foreground">
              We’re builders and neighbors who care about circular design and
              clean, simple UI.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <TeamMemberCard
              name="Alex"
              role="Frontend & UX"
              bio="Loves circular economy and clear interfaces."
              initials="AX"
            />
            <TeamMemberCard
              name="Mia"
              role="Backend & Data"
              bio="Optimizes for impact and reliability."
              initials="MI"
            />
            <TeamMemberCard
              name="Leo"
              role="Community"
              bio="Connects neighbors and hosts sharing events."
              initials="LE"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-background/95 backdrop-blur">
              <CardContent>
                <div className="flex items-center gap-2 text-lg">
                  <span>🤝</span>
                  <span className="font-medium">Community first</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Designed to make meeting, sharing, and trusting neighbors
                  easy.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/95 backdrop-blur">
              <CardContent>
                <div className="flex items-center gap-2 text-lg">
                  <span>♻️</span>
                  <span className="font-medium">Designed for reuse</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Less buying, more borrowing—keep items in use, not in
                  closets.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/95 backdrop-blur">
              <CardContent>
                <div className="flex items-center gap-2 text-lg">
                  <span>📊</span>
                  <span className="font-medium">Transparent impact</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Track avoided waste and CO₂, celebrate small wins together.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
