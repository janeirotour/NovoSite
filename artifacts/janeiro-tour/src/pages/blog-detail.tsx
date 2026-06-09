import { useParams, Link } from "wouter";
import { useGetBlogPost } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { ChevronLeft, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogConversionSection } from "@/components/blog/BlogConversionSection";

const TX = {
  loading:    { en: "Loading article...",             es: "Cargando artículo...",              pt: "Carregando artigo...",              fr: "Chargement de l'article...",           de: "Artikel wird geladen..." },
  notFound:   { en: "Article not found",              es: "Artículo no encontrado",            pt: "Artigo não encontrado",             fr: "Article introuvable",                  de: "Artikel nicht gefunden" },
  backBlog:   { en: "Back to Blog",                   es: "Volver al Blog",                    pt: "Voltar ao Blog",                    fr: "Retour au Blog",                       de: "Zurück zum Blog" },
  minRead:    { en: "min read",                       es: "min de lectura",                    pt: "min de leitura",                    fr: "min de lecture",                       de: "Min. Lesezeit" },
  ctaTitle:   { en: "Ready to Experience Brazil?",    es: "¿Listo para Vivir Brasil?",         pt: "Pronto para Experienciar o Brasil?",fr: "Prêt à Découvrir le Brésil ?",         de: "Bereit, Brasilien zu erleben?" },
  ctaSub:     { en: "Book your tour with our expert local guides", es: "Reserva tu tour con nuestros guías locales expertos", pt: "Reserve seu tour com nossos guias locais especialistas", fr: "Réservez votre tour avec nos guides locaux experts", de: "Buchen Sie Ihre Tour mit unseren lokalen Experten" },
  exploreTours:{ en: "Explore Tours",                 es: "Explorar Tours",                    pt: "Explorar Tours",                    fr: "Explorer les Tours",                   de: "Touren Erkunden" },
} as const;

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id ?? "0", 10);
  const { lang } = useLanguage();

  const { data: post, isLoading } = useGetBlogPost(postId);

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-xl text-muted-foreground">{tx("loading")}</div>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">{tx("notFound")}</h1>
          <Link href="/blog"><Button>{tx("backBlog")}</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const title =
    lang === "es" ? (post.titleEs ?? post.title) :
    lang === "pt" ? (post.titlePt ?? post.title) :
    post.title;

  const content =
    lang === "es" ? (post.contentEs ?? post.content) :
    lang === "pt" ? (post.contentPt ?? post.content) :
    post.content;

  const dateLocale =
    lang === "fr" ? "fr-FR" : lang === "de" ? "de-DE" : lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] bg-neutral-900">
        <img src={post.imageUrl} alt={title} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors text-sm">
            <ChevronLeft size={16} /> {tx("backBlog")}
          </Link>
          <Badge className="bg-primary/90 text-primary-foreground mb-3">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{title}</h1>
          <div className="flex items-center gap-6 mt-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTimeMinutes} {tx("minRead")}</span>
            <span>{new Date(post.createdAt).toLocaleDateString(dateLocale, { month: "long", day: "numeric", year: "numeric" })}</span>
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
          <h3 className="text-2xl font-bold mb-2">{tx("ctaTitle")}</h3>
          <p className="text-muted-foreground mb-6">{tx("ctaSub")}</p>
          <Link href="/tours">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8">
              {tx("exploreTours")}
            </Button>
          </Link>
        </div>
      </article>

      {/* Blog Conversion Section */}
      <BlogConversionSection />
    </MainLayout>
  );
}
