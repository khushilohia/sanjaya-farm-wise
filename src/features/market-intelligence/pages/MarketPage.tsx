import { useState } from "react";
import { TrendingUp, Store, Truck, Sparkles, ArrowRight, BadgeCheck } from "lucide-react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AppLayout } from "@/app/layouts/AppLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRICES = [
  { crop: "Large cardamom", price: "Rs 2,150/kg", change: "+4.2%" },
  { crop: "Ginger (fresh)", price: "Rs 68/kg", change: "+1.1%" },
  { crop: "Rice (basmati)", price: "Rs 42/kg", change: "-0.8%" },
  { crop: "Tea leaves", price: "Rs 54/kg", change: "+0.6%" },
];

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

export function MarketPage() {
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [crop, setCrop] = useState("");
  const [grade, setGrade] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");

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
            <Card className="border-border/60 bg-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Live prices</div>
              <div className="mt-4 space-y-3">
                {PRICES.map((item) => (
                  <div key={item.crop} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <div>
                      <div className="text-sm font-semibold">{item.crop}</div>
                      <div className="text-xs text-muted-foreground">Gangtok mandi</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.price}</div>
                      <div className={`text-xs font-medium ${item.change.startsWith("-") ? "text-destructive" : "text-primary"}`}>
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Demand trend</div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="rounded-lg bg-background/60 p-3">Cardamom demand rising for festive season (+18%).</div>
                <div className="rounded-lg bg-background/60 p-3">Ginger prices stable, expect peak in 3 weeks.</div>
                <div className="rounded-lg bg-background/60 p-3">Rice surplus in local market, consider storage.</div>
              </div>
              <Button variant="outline" className="mt-4 w-full gap-2">
                View national trends <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </section>

        {/* Buyer marketplace */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Buyer marketplace"
              title="Connect directly with buyers"
              subtitle="Verified buyers seeking your crops at competitive prices — no middlemen."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {BUYERS.map((buyer) => (
                <Card key={buyer.name} className="border-border/60 bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">{buyer.name}</span>
                        {buyer.verified && (
                          <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      {buyer.verified ? (
                        <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 text-xs">Verified buyer</Badge>
                      ) : (
                        <Badge className="mt-1 bg-muted text-muted-foreground border-border text-xs">Unverified</Badge>
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
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">New listing</div>
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
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">AI insights</div>
              <div className="space-y-3">
                <Card className="border-border/60 bg-card p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">Recommendation</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hold cardamom for 2 weeks for a projected 12% price increase. Consider ginger sales before monsoon peak.
                  </p>
                </Card>
                <Card className="border-border/60 bg-card p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">Buyer highlight</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    4 verified buyers are seeking ginger in the next 10 days. Average offer Rs 72/kg.
                  </p>
                  <Button className="mt-3 gap-2 bg-primary hover:bg-primary/90">
                    <Sparkles className="h-4 w-4" /> View offers
                  </Button>
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
