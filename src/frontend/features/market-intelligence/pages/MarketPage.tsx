import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Store, Truck, Sparkles, BadgeCheck, Search } from "lucide-react";
import { AuthGuard } from "@/frontend/app/guards/AuthGuard";
import { fetchMarketPrices, fetchPriceHistory } from "@/backend/api/serverFns";
import { useAuthStore } from "@/frontend/store/authStore";
import { AppLayout } from "@/frontend/app/layouts/AppLayout";
import { SectionHeading } from "@/frontend/components/layout/SectionHeading";
import { IconCard } from "@/frontend/components/cards/IconCard";
import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";

type PriceRecord = {
  commodity?: string;
  variety?: string;
  market?: string;
  district?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  modalPrice?: number | null;
  trend?: string;
  note?: string;
  unit?: string;
};

// Sample buyers — buyer marketplace backend is not built yet.
const BUYERS = [
  {
    name: "Himalayan Spice Traders",
    crop: "Large Cardamom",
    quantity: "200 kg",
    price: "Rs 2,200/kg",
    premium: "+Rs 50 above market",
    pickup: "Within 5 days",
    verified: true,
  },
  {
    name: "Green Valley Exports",
    crop: "Large Cardamom",
    quantity: "500 kg",
    price: "Rs 2,180/kg",
    premium: "+Rs 30 above market",
    pickup: "Within 7 days",
    verified: true,
  },
  {
    name: "Sikkim Agro Connect",
    crop: "Ginger (fresh)",
    quantity: "300 kg",
    price: "Rs 72/kg",
    premium: "+Rs 4 above market",
    pickup: "Within 3 days",
    verified: false,
  },
];

function formatPrice(value: number | null | undefined): string {
  return value == null ? "—" : `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function TrendChart({ points }: { points: { date: string; price: number }[] }) {
  const W = 600;
  const H = 140;
  const PAD = 8;
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const x = (i: number) => PAD + (i / (points.length - 1)) * (W - PAD * 2);
  const y = (p: number) => H - PAD - ((p - min) / range) * (H - PAD * 2);
  const line = points.map((p, i) => `${x(i)},${y(p.price)}`).join(" ");
  const rising = prices[prices.length - 1] >= prices[0];
  const color = rising ? "hsl(var(--primary))" : "hsl(var(--destructive))";

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Price trend chart">
        <polygon
          points={`${x(0)},${H - PAD} ${line} ${x(points.length - 1)},${H - PAD}`}
          fill={color}
          opacity={0.08}
        />
        <polyline points={line} fill="none" stroke={color} strokeWidth={2.5} />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.price)} r={3} fill={color}>
            <title>{`${p.date}: ${formatPrice(p.price)}/quintal`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{points[0]?.date}</span>
        <span className={rising ? "font-medium text-primary" : "font-medium text-destructive"}>
          {rising ? "▲" : "▼"} {formatPrice(prices[0])} → {formatPrice(prices[prices.length - 1])}
        </span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export function MarketPage() {
  const user = useAuthStore((s) => s.user);
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [crop, setCrop] = useState("");
  const [grade, setGrade] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");

  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(""); // submitted search term

  const pricesQuery = useQuery({
    queryKey: ["market-prices", user?.crops ?? []],
    queryFn: () =>
      fetchMarketPrices({
        data: {
          state: "Sikkim",
          commodity: "",
          crops: user?.crops ?? [],
          language: user?.language ?? "en",
        },
      }),
    staleTime: 1000 * 60 * 30,
  });

  const searchQuery = useQuery({
    queryKey: ["market-search", searched],
    queryFn: () =>
      fetchMarketPrices({
        data: {
          state: "",
          commodity: searched,
          crops: [searched],
          language: user?.language ?? "en",
        },
      }),
    enabled: Boolean(searched),
    staleTime: 1000 * 60 * 30,
  });

  const activeQuery = searched ? searchQuery : pricesQuery;
  const priceRecords = (activeQuery.data?.records ?? []) as PriceRecord[];

  // Trend chart follows the search, else the farmer's first crop / first record.
  const trendCommodity = searched || user?.crops?.[0] || priceRecords[0]?.commodity || "";
  const historyQuery = useQuery({
    queryKey: ["price-history", trendCommodity],
    queryFn: () => fetchPriceHistory({ data: { commodity: trendCommodity, state: "" } }),
    enabled: Boolean(trendCommodity),
    staleTime: 1000 * 60 * 60,
  });

  function handleListNow() {
    if (!crop || !quantity) return;
    setListingSubmitted(true);
  }

  return (
    <AuthGuard>
      <AppLayout>
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Market intelligence"
            title="Know the right price, right time"
            subtitle="Live mandi rates, demand forecasts, and buyer matchmaking for every crop you grow."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="border-border/60 bg-card p-6 lg:col-span-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                {activeQuery.data?.source === "live" ? "Live mandi prices" : "Market prices"}
                {activeQuery.data?.source === "estimated" && (
                  <Badge className="bg-harvest/15 text-harvest-foreground border-harvest/20 text-xs normal-case tracking-normal">
                    AI estimate — live feed unavailable
                  </Badge>
                )}
              </div>

              {/* Commodity search */}
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearched(search.trim());
                }}
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search any crop — e.g. Turmeric, Potato, Maize…"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="gap-1.5"
                  disabled={!search.trim()}
                >
                  <Search className="h-4 w-4" /> Search
                </Button>
                {searched && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearch("");
                      setSearched("");
                    }}
                  >
                    Clear
                  </Button>
                )}
              </form>

              <div className="mt-4 space-y-3">
                {activeQuery.isLoading && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Loading current prices…
                  </div>
                )}
                {activeQuery.isError && (
                  <div className="py-8 text-center text-sm text-destructive">
                    Could not load market prices. Please try again later.
                  </div>
                )}
                {!activeQuery.isLoading && !activeQuery.isError && priceRecords.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No price data available right now.
                  </div>
                )}
                {priceRecords.slice(0, 10).map((item, i) => (
                  <div
                    key={`${item.commodity}-${item.market}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {item.commodity}
                        {item.variety ? ` (${item.variety})` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {[item.market, item.district].filter(Boolean).join(", ") ||
                          "Regional market"}
                        {item.note ? ` — ${item.note}` : ""}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold">
                        {formatPrice(item.modalPrice)}
                        <span className="text-xs font-normal text-muted-foreground"> /quintal</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(item.minPrice)} – {formatPrice(item.maxPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Price trend chart */}
            {trendCommodity && (
              <Card className="border-border/60 bg-card p-6 lg:col-span-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <TrendingUp className="h-4 w-4" />
                  {trendCommodity} price trend
                  {historyQuery.data?.source === "estimated" && (
                    <Badge className="bg-harvest/15 text-harvest-foreground border-harvest/20 text-xs normal-case tracking-normal">
                      AI estimate
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  {historyQuery.isLoading && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading price trend…
                    </div>
                  )}
                  {!historyQuery.isLoading && (historyQuery.data?.points?.length ?? 0) >= 2 ? (
                    <TrendChart points={historyQuery.data!.points} />
                  ) : (
                    !historyQuery.isLoading && (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No trend data available for {trendCommodity}.
                      </div>
                    )
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Search a crop above to see its trend. ₹ per quintal, wholesale mandi rate.
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* Buyer marketplace */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Buyer marketplace — preview"
              title="Connect directly with buyers"
              subtitle="A preview of the buyer marketplace with sample listings. Live buyer matching is coming soon."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {BUYERS.map((buyer) => (
                <Card key={buyer.name} className="border-border/60 bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">{buyer.name}</span>
                        {buyer.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      {buyer.verified ? (
                        <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 text-xs">
                          Verified buyer
                        </Badge>
                      ) : (
                        <Badge className="mt-1 bg-muted text-muted-foreground border-border text-xs">
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                      <span className="text-muted-foreground">Crop needed</span>
                      <span className="font-medium">{buyer.crop}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{buyer.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2">
                      <span className="text-muted-foreground">Offered price</span>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{buyer.price}</div>
                        <div className="text-xs text-primary/80">{buyer.premium}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                      <span className="text-muted-foreground">Pickup</span>
                      <span className="font-medium">{buyer.pickup}</span>
                    </div>
                  </div>
                  <Button className="mt-1 w-full bg-primary hover:bg-primary/90 gap-2">
                    <Sparkles className="h-4 w-4" /> Send quote
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* List your produce */}
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Sell produce"
            title="List your harvest"
            subtitle="Create a listing to receive offers from verified buyers across the region."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="border-border/60 bg-card p-6">
              {listingSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BadgeCheck className="h-7 w-7" />
                  </div>
                  <div className="font-display text-xl font-semibold">Listing submitted!</div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Your produce has been listed. Buyers will contact you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setListingSubmitted(false);
                      setCrop("");
                      setGrade("");
                      setQuantity("");
                      setPrice("");
                      setAvailability("");
                    }}
                  >
                    List another
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    New listing
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="crop-select">Crop</Label>
                      <Select value={crop} onValueChange={setCrop}>
                        <SelectTrigger id="crop-select">
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="large-cardamom">Large Cardamom</SelectItem>
                          <SelectItem value="ginger">Ginger</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="tea">Tea Leaves</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="grade-select">Grade</Label>
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger id="grade-select">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Grade A</SelectItem>
                          <SelectItem value="b">Grade B</SelectItem>
                          <SelectItem value="c">Grade C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity-input">Quantity (kg)</Label>
                      <Input
                        id="quantity-input"
                        type="number"
                        placeholder="e.g. 150"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="price-input">Price expectation (Rs/kg)</Label>
                      <Input
                        id="price-input"
                        type="number"
                        placeholder="e.g. 2100"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="availability-input">Availability date</Label>
                      <Input
                        id="availability-input"
                        placeholder="e.g. 15 June 2026"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 gap-2"
                    onClick={handleListNow}
                    disabled={!crop || !quantity}
                  >
                    <Store className="h-4 w-4" /> List now
                  </Button>
                </div>
              )}
            </Card>
            <Card className="border-border/60 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                Selling tips
              </div>
              <div className="space-y-3">
                <Card className="border-border/60 bg-card p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Check prices first
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Compare your expected price against the current mandi rates above before
                    listing, so buyers take your listing seriously.
                  </p>
                </Card>
                <Card className="border-border/60 bg-card p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Grade honestly
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Accurate grading builds repeat buyers. Mixed-grade lots usually sell at the
                    lowest grade's price.
                  </p>
                </Card>
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-muted/40 pb-20 pt-8">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Buyer connect"
              title="Sell directly to buyers"
              subtitle="Create listings, negotiate prices, and schedule deliveries without middlemen."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <IconCard
                icon={Store}
                title="List produce"
                description="Upload quantity, quality grade, and expected price."
                tone="harvest"
              />
              <IconCard
                icon={TrendingUp}
                title="Receive offers"
                description="Buyers send bids based on your price and delivery date."
                tone="primary"
              />
              <IconCard
                icon={Truck}
                title="Schedule pickup"
                description="Plan delivery or pickup directly in the app."
                tone="soil"
              />
            </div>
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
