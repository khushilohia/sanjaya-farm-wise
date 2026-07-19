import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff, Bot } from "lucide-react";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { StatCard } from "@/frontend/components/cards/StatCard";
import { Card } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { getAdminOverview } from "@/backend/api/adminFns";
import { CropIcon } from "@/frontend/lib/cropIcons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";

function daysAgo(iso: string | null): string {
  if (!iso) return "never synced";
  const d = Math.floor((Date.now() - new Date(iso + "Z").getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
}

export function AdminPage() {
  const overview = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => getAdminOverview(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-8">
            <SectionHeading
              eyebrow="Super admin"
              title="Platform overview"
              subtitle="Live data from the Sanjaya database — farmers, crops, and AI usage."
            />
            <div className="ml-auto shrink-0">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Admin
              </Badge>
            </div>
          </div>

          {overview.isLoading && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading platform data…
            </div>
          )}

          {overview.isError && (
            <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
              <ShieldOff className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-3 font-semibold">Not authorized</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account is not a super admin. Add your phone number to the{" "}
                <code className="rounded bg-muted px-1">ADMIN_PHONES</code> environment variable
                (comma-separated) and restart the server.
              </p>
            </Card>
          )}

          {overview.data && (
            <>
              {/* Live stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                  label="Total farmers"
                  value={String(overview.data.stats.totalFarmers)}
                  helper={`+${overview.data.stats.newLast30Days} in last 30 days`}
                  tone="primary"
                />
                <StatCard
                  label="Villages"
                  value={String(overview.data.stats.villages)}
                  helper="Distinct villages"
                  tone="sky"
                />
                <StatCard
                  label="Setup complete"
                  value={String(overview.data.stats.setupComplete)}
                  helper="Farms fully onboarded"
                  tone="soil"
                />
                <StatCard
                  label="AI queries"
                  value={String(overview.data.stats.totalAIQueries)}
                  helper="All time, synced devices"
                  tone="harvest"
                />
                <StatCard
                  label="New farmers"
                  value={String(overview.data.stats.newLast30Days)}
                  helper="Last 30 days"
                  tone="primary"
                />
              </div>

              {/* Crop distribution + recent questions */}
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card className="border-border/60 bg-card p-6">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                    Crops being grown
                  </div>
                  {overview.data.topCrops.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No crop data synced yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {overview.data.topCrops.map((c) => {
                        const max = overview.data!.topCrops[0].count;
                        return (
                          <div key={c.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                <CropIcon name={c.name} className="mr-1.5" />
                                {c.name}
                              </span>
                              <span className="font-semibold">{c.count}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(c.count / max) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>

                <Card className="border-border/60 bg-card p-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                    <Bot className="h-3.5 w-3.5" /> Recent farmer questions
                  </div>
                  {overview.data.recentQuestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No AI queries synced yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {overview.data.recentQuestions.map((q, i) => (
                        <div key={i} className="rounded-lg bg-muted/40 p-2.5 text-sm">
                          <span className="mr-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary uppercase">
                            {q.language}
                          </span>
                          {q.question}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Farmers table */}
              <div className="mt-10">
                <SectionHeading
                  eyebrow="Farmer management"
                  title="Registered farmers"
                  subtitle="Most recently active first (up to 100)."
                />
                <Card className="mt-6 border-border/60 bg-card overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Village</TableHead>
                        <TableHead>Crops</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overview.data.users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell className="text-muted-foreground">{u.phone}</TableCell>
                          <TableCell className="text-muted-foreground">{u.village}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {u.crops.map((c) => (
                              <span key={c} className="mr-2 whitespace-nowrap">
                                <CropIcon name={c} className="mr-0.5" />
                                {c}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell className="uppercase text-muted-foreground">
                            {u.language}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {u.createdAt.slice(0, 10)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                u.lastActive
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }
                            >
                              {daysAgo(u.lastActive)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </>
          )}
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
