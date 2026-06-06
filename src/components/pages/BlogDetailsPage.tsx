import { Reveal } from "@/components/ui/Reveal";
import { LoadingImage } from "@/components/ui/LoadingImage";
import { ClientGimmick } from "@/components/ui/ClientGimmick";
import { HireMeBanner } from "@/components/ui/HireMeBanner";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import { getTranslations } from "next-intl/server";
import type { Blog, Locale, HireBannerContent } from "@/types";

interface BlogDetailsPageProps {
  blog: Blog;
  locale: string;
  hireBannerContent?: HireBannerContent | null;
}

export async function BlogDetailsPage({ blog, locale, hireBannerContent }: BlogDetailsPageProps) {
  const t = await getTranslations('blog');
  const loc = locale as Locale;

  return (
    <section className="pb-8 md:pb-14 bg-background relative min-h-screen overflow-hidden pt-24 md:pt-28">
      <ClientGimmick name="logStream" />

      <div className="container-custom relative z-10">
        <article>
          <Reveal width="100%">
            <div className="mb-6 md:mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan-500 transition-colors mb-4 group"
                aria-label={t('backToBlog')}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-xs uppercase tracking-wider">{t('backToBlog')}</span>
              </Link>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-text-main tracking-tighter mb-4 md:mb-5 leading-tight break-words">
                {blog.title[loc]}
              </h1>

              <div className="flex flex-wrap gap-4 md:gap-6 items-center pt-4 border-t border-border/20">
                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="w-4 h-4 text-cyan-700 dark:text-cyan-500 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">{blog.date}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <User className="w-4 h-4 text-cyan-700 dark:text-cyan-500 shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-wider">Daniansyah Chusyaidin</span>
                </div>
              </div>
            </div>
          </Reveal>

          {blog.coverImage && (
            <Reveal delay={0.1} width="100%">
              <div className="mb-8 md:mb-12 rounded-xl overflow-hidden border border-border/40 bg-surface relative aspect-video">
                <LoadingImage
                  src={blog.coverImage}
                  alt={blog.title[loc]}
                  fill
                  sizes="(max-width: 768px) 95vw, (max-width: 1280px) 80vw, 1200px"
                  quality={80}
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          )}

          <Reveal delay={blog.coverImage ? 0.2 : 0.1} width="100%">
            <div className="relative p-5 sm:p-6 md:p-8 bg-surface border border-border/40 rounded-xl overflow-hidden w-full min-w-0">
               <div lang="id" className="markdown-body prose prose-sm md:prose-base dark:prose-invert max-w-none w-full min-w-0 text-text-muted prose-headings:text-text-main prose-headings:tracking-tighter prose-strong:text-cyan-700 dark:prose-strong:text-cyan-400 prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-pre:bg-surface-hover dark:prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/40 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-img:rounded-lg prose-img:max-w-full [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_:not(pre)>code]:break-words [&_pre]:whitespace-pre [&_pre_code]:break-normal [&_a]:break-all [&_p]:break-words [&_h1]:break-words [&>h1:first-child]:hidden [&_h2]:break-words [&_h3]:break-words [&_li]:break-words">
                 <Markdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeSanitize]}>
                   {blog.content}
                 </Markdown>
               </div>

               <div className="mt-10 md:mt-16 pt-10 md:pt-16 border-t border-border/20">
                  <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"></div>
               </div>
            </div>
          </Reveal>
        </article>

        <HireMeBanner hireBannerContent={hireBannerContent} locale={locale} />
      </div>
    </section>
  );
}
