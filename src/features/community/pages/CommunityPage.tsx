import { Users, MessageSquare, Video, CalendarCheck, Sparkles, Play } from "lucide-react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AppLayout } from "@/app/layouts/AppLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { Card } from "@/components/ui/card";

const FORUM_POSTS = [
  {
    id: 1,
    author: "Ramesh Rai",
    village: "Rumtek",
    title: "Best time to harvest cardamom this season?",
    preview: "I have noticed the capsules are starting to turn slightly red. Should I wait another week or harvest now?",
    timeAgo: "3 hours ago",
    replies: 14,
    color: "bg-primary",
  },
  {
    id: 2,
    author: "Sunita Tamang",
    village: "Ranipool",
    title: "Ginger rhizome rot treatment",
    preview: "Found soft brown spots on my ginger rhizomes after the heavy rain. Using neem cake right now but looking for more effective options.",
    timeAgo: "1 day ago",
    replies: 8,
    color: "bg-harvest",
  },
  {
    id: 3,
    author: "Bikash Sharma",
    village: "Khamdong",
    title: "PM-Kisan payout date for Sikkim?",
    preview: "My neighbour got the installment last week but I haven't received mine yet. Who should I contact at the block office?",
    timeAgo: "2 days ago",
    replies: 21,
    color: "bg-sky",
  },
];

const EXPERT_QA = [
  {
    question: "How do I know if my cardamom plants have Katte viral disease?",
    questioner: "Deepak Gurung, East Sikkim",
    answer:
      "Katte viral disease shows as mosaic-like yellow streaks on leaves. Infected plants have stunted growth and reduced capsule production. There is no cure — remove affected plants immediately and fumigate the soil.",
    expert: "Dr. Anuj Pradhan",
    role: "Senior Agronomist, ICAR-NEH Region",
  },
  {
    question: "What is the best organic fertilizer schedule for ginger in hilly terrain?",
    questioner: "Purnima Basnet, West Sikkim",
    answer:
      "Apply FYM (10 t/ha) at bed preparation. Follow with neem cake (1 t/ha) at planting. Top-dress with vermicompost at 30 and 60 days after planting.",
    expert: "Ms. Kavita Chettri",
    role: "Soil Scientist, Krishi Vigyan Kendra",
  },
];

const VIDEOS = [
  { title: "Cardamom pest management", duration: "12 min", views: "4.2k", topic: "Pest" },
  { title: "Soil testing at home", duration: "8 min", views: "3.1k", topic: "Soil" },
  { title: "Irrigation planning for hills", duration: "15 min", views: "2.8k", topic: "Irrigation" },
  { title: "Post-harvest storage tips", duration: "10 min", views: "1.9k", topic: "Harvest" },
  { title: "Using Sanjaya AI by voice", duration: "5 min", views: "6.7k", topic: "Tutorial" },
  { title: "Organic ginger cultivation", duration: "18 min", views: "5.4k", topic: "Organic" },
];

const GUIDES = [
  { crop: "Cardamom", season: "Kharif 2026", stripe: "bg-primary" },
  { crop: "Ginger", season: "Pre-monsoon", stripe: "bg-sky" },
  { crop: "Rice", season: "Rabi 2026", stripe: "bg-harvest" },
  { crop: "Maize", season: "Summer", stripe: "bg-soil" },
];

const topicColors: Record<string, string> = {
  Pest: "bg-destructive/10 text-destructive",
  Soil: "bg-soil/15 text-soil-foreground",
  Irrigation: "bg-sky/15 text-sky-foreground",
  Harvest: "bg-harvest/15 text-harvest-foreground",
  Tutorial: "bg-primary/10 text-primary",
  Organic: "bg-primary/10 text-primary",
};

export function CommunityPage() {
  return (
    <AuthGuard>
      <AppLayout>
        {/* Discussion forum */}
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Discussion forum"
            title="Learn together, grow together"
            subtitle="Talk with other farmers, share experiences, and get answers from the community."
          />
          <div className="mt-8 space-y-4">
            {FORUM_POSTS.map((post) => (
              <Card key={post.id} className="border-border/60 bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${post.color}`}>
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{post.title}</div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.preview}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground">{post.author}</span>
                      <span>{post.village}</span>
                      <span>{post.timeAgo}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {post.replies} replies
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Expert Q&A */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Expert Q&A"
              title="Verified answers from agronomists"
              subtitle="Agricultural officers and scientists answer real farmer questions."
            />
            <div className="mt-8 space-y-5">
              {EXPERT_QA.map((qa) => (
                <Card key={qa.question} className="border-border/60 bg-card overflow-hidden">
                  <div className="border-b border-border/40 bg-muted/20 px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold">{qa.question}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Asked by {qa.questioner}</div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {qa.expert.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{qa.expert}</span>
                          <span className="text-xs text-muted-foreground">— {qa.role}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{qa.answer}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video tutorials */}
        <section className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Learning hub"
            title="Video tutorials"
            subtitle="Simple, visual lessons for seasonal crop practices and disease prevention."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((video) => (
              <Card key={video.title} className="border-border/60 bg-card overflow-hidden group cursor-pointer">
                <div className="relative flex h-36 items-center justify-center bg-muted/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-md group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 text-primary ml-0.5" />
                  </div>
                  <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${topicColors[video.topic] ?? "bg-primary/10 text-primary"}`}>
                    {video.topic}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold">{video.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Seasonal crop guides */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Seasonal guides"
              title="What to do each month"
              subtitle="Month-by-month guides for key crops tailored to your region."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GUIDES.map((guide) => (
                <Card key={guide.crop} className="border-border/60 bg-card overflow-hidden">
                  <div className={`h-2 ${guide.stripe}`} />
                  <div className="p-5">
                    <div className="text-lg font-display font-semibold">{guide.crop}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{guide.season}</div>
                    <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      {["Planting schedule", "Fertilizer timeline", "Pest watch calendar", "Harvest indicators"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <SectionHeading
            eyebrow="Community features"
            title="Built for farmers"
            subtitle="Tools to connect, learn, and grow as a community."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IconCard icon={Video} title="Video tutorials" description="Step-by-step guidance in your language." tone="sky" />
            <IconCard icon={CalendarCheck} title="Seasonal guides" description="What to do each month for key crops." tone="harvest" />
            <IconCard icon={Users} title="Discussion forums" description="Ask questions, share tips, and learn together." tone="primary" />
            <IconCard icon={Sparkles} title="Expert answers" description="Verified agricultural officers provide advice." tone="soil" />
          </div>
        </section>
      </AppLayout>
    </AuthGuard>
  );
}
