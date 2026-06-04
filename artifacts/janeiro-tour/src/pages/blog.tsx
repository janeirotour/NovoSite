import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const { lang } = useLanguage();
  const { data: posts, isLoading } = useListBlogPosts();

  const getTitle = (post: NonNullable<typeof posts>[0]) =>
    lang === "es" ? (post.titleEs ?? post.title) : lang === "pt" ? (post.titlePt ?? post.title) : post.title;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Travel Knowledge</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Brazil Travel Guides</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Expert insights, destination guides, and insider tips from our local Brazil travel team
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={getTitle(post)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-primary-foreground text-xs">{post.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock size={12} />
                      <span>{post.readTimeMinutes} min read</span>
                      <span>·</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {getTitle(post)}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      Read Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
