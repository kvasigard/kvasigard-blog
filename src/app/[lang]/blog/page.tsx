import { getAllPosts } from '@/lib/mdx';
import PostList from '@/components/blog/PostList';
import { getDictionary, Locale } from '@/lib/i18n';

interface BlogPageProps {
    params: Promise<{
        lang: string;
    }>;
}

export function generateStaticParams() {
    return [{ lang: 'es' }, { lang: 'en' }];
}

export default async function BlogPage({ params }: BlogPageProps) {
    const resolvedParams = await params;
    const posts = await getAllPosts(resolvedParams.lang);
    const dictionary = getDictionary(resolvedParams.lang as Locale);

    return (
        <div className="space-y-12">
            <header className="mb-10 pb-8 border-b border-teal-500/10">
                <h1 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100 font-mono italic text-left">
                    {dictionary.navArticles.toUpperCase()}
                </h1>
                <p className="text-[10px] font-mono text-[#94a3b8] tracking-widest uppercase text-left">
                    # {posts.length} {dictionary.modulesLoaded}
                </p>
            </header>
            <PostList
                posts={posts}
                lang={resolvedParams.lang}
                placeholder={dictionary.searchPlaceholder}
                dateLabel={dictionary.date}
                sagaLabel={dictionary.sagaPrefix}
            />
        </div>
    );
}
