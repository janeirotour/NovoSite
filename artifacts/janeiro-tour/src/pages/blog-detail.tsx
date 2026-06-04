import { useParams, Link } from "wouter";
import { useGetBlogPost } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { ChevronLeft, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id ?? "0", 10);
  const { lang } = useLanguage();

  const { data: post, isLoading } = useGetBlogPost(postId);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground">Loading article...</div>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link href="/blog"><Button>Back to Blog</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const title = lang === "es" ? (post.titleEs ?? post.title) : lang === "pt" ? (post.titlePt ?? post.title) : post.title;
  const content =
    lang === "es" ? (post.contentEs ?? post.content) :
    lang === "pt" ? (post.contentPt ?? post.content) :
    post.content;

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] bg-neutral-900">
        <img src={post.imageUrl} alt={title} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors text-sm">
            <ChevronLeft size={16} /> Back to Blog
          </Link>
          <Badge className="bg-primary/90 text-primary-foreground mb-3">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{title}</h1>
          <div className="flex items-center gap-6 mt-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTimeMinutes} min read</span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-muted-foreground
          prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:text-primary/80
          prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
          prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-ul:text-muted-foreground prose-ol:text-muted-foreground
          prose-li:leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-primary/10 rounded-2xl border border-primary/20 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Experience Brazil?</h3>
          <p className="text-muted-foreground mb-6">Book your tour with our expert local guides</p>
          <Link href="/tours">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8">
              Explore Tours
            </Button>
          </Link>
        </div>
      </article>
    </MainLayout>
  );
}
