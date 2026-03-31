import { getAllPosts } from '@/lib/mdx';
import PostList from '@/components/blog/PostList';
import { getDictionary, Locale } from '@/lib/i18n';

interface HomePageProps {
    params: Promise<{
        lang: string;
    }>;
}

export function generateStaticParams() {
    return [{ lang: 'es' }, { lang: 'en' }];
}

export default async function HomePage({ params }: HomePageProps) {
    const resolvedParams = await params;
    const posts = await getAllPosts(resolvedParams.lang);
    const dictionary = getDictionary(resolvedParams.lang as Locale);

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <section className="space-y-4 pt-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.1em] text-zinc-900 dark:text-zinc-100 font-mono italic leading-tight">
                    {dictionary.siteTitle.toUpperCase()}
                </h1>
                <p className="text-base text-zinc-600 dark:text-[#94a3b8] max-w-2xl leading-snug font-sans">
                    {dictionary.siteDesc}
                </p>
            </section>

            <section className="pt-10 border-t border-teal-500/10">
                <PostList
                    posts={posts}
                    lang={resolvedParams.lang}
                    placeholder={dictionary.searchPlaceholder}
                    dateLabel={dictionary.date}
                    sagaLabel={dictionary.sagaPrefix}
                />
            </section>
        </div>
    );
}
