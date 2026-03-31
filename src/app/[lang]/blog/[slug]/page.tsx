import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/mdx';
import { getDictionary, Locale } from '@/lib/i18n';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import GithubSlugger from 'github-slugger';
import TableOfContents from '@/components/blog/TableOfContents';
import { codeToHtml } from 'shiki';
import { visit } from 'unist-util-visit';


export function generateStaticParams() {
    return [{ lang: 'es' }, { lang: 'en' }];
}


// Custom plugin to handle shiki highlighting in the unified pipeline
function rehypeShiki(dictionary: any) {
    return async (tree: any) => {
        const tasks: Promise<void>[] = [];

        visit(tree, 'element', (node: any, index: any, parent: any) => {
            if (node.tagName === 'pre' && node.children?.[0]?.tagName === 'code') {
                const codeNode = node.children[0];
                const lang = codeNode.properties?.className?.[0]?.replace('language-', '') || 'text';
                const code = codeNode.children?.[0]?.value || '';

                if (code) {
                    const task = (async () => {
                        try {
                            const html = await codeToHtml(code.trim(), {
                                lang,
                                themes: {
                                    light: 'github-light',
                                    dark: 'github-dark-high-contrast'
                                }
                            });

                            const wrapper = {
                                type: 'element',
                                tagName: 'div',
                                properties: { className: ['my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-sm relative bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-300'] },
                                children: [
                                    {
                                        type: 'element',
                                        tagName: 'div',
                                        properties: { className: ['flex items-center justify-between px-4 py-2 bg-zinc-200/50 dark:bg-black/20 border-b border-zinc-200 dark:border-white/10 font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-amber-500 transition-colors duration-300'] },
                                        children: [
                                            { type: 'element', tagName: 'span', children: [{ type: 'text', value: lang }] },
                                            { type: 'element', tagName: 'span', children: [{ type: 'text', value: dictionary.copy }] }
                                        ]
                                    },
                                    {
                                        type: 'element',
                                        tagName: 'div',
                                        properties: { className: ['p-5 overflow-auto text-sm leading-relaxed shiki-container [&_pre]:!bg-transparent'] },
                                        children: [{ type: 'raw', value: html }]
                                    }
                                ]
                            };
                            parent.children[index] = wrapper;
                        } catch (e) {
                            console.error('Shiki error:', e);
                        }
                    })();
                    tasks.push(task);
                }
            }
        });

        await Promise.all(tasks);
    };
}

// Custom plugin to handle callouts/alerts (GitHub style)
function rehypeCallouts() {
    return (tree: any) => {
        visit(tree, 'element', (node: any) => {
            if (node.tagName === 'blockquote') {
                // Find the first paragraph
                const p = node.children.find((c: any) => c.tagName === 'p');
                if (p && p.children?.[0]?.type === 'text') {
                    const firstChild = p.children[0];
                    const match = firstChild.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)/i);

                    if (match) {
                        const type = match[1].toUpperCase();
                        const remainingText = match[2];

                        // Update the text node to remove the marker
                        firstChild.value = remainingText;

                        // Add classes for styling
                        node.properties.className = ['callout-box', `callout-${type.toLowerCase()}`];

                        // Prepend a title/icon header if desired
                        node.children.unshift({
                            type: 'element',
                            tagName: 'div',
                            properties: { className: ['callout-header'] },
                            children: [{ type: 'text', value: type }]
                        });
                        // If no explicit marker, look for bold text at the start as a title
                        const maybeBold = p.children[0];
                        if (maybeBold.tagName === 'strong' || maybeBold.tagName === 'b') {
                            const title = maybeBold.children?.[0]?.value || 'NOTE';
                            node.properties.className = ['callout-box', 'callout-default'];
                            node.children.unshift({
                                type: 'element',
                                tagName: 'div',
                                properties: { className: ['callout-header'] },
                                children: [{ type: 'text', value: title.toUpperCase() }]
                            });
                            // Remove the bold text from the paragraph if we used it as header
                            p.children.shift();
                        } else {
                            node.properties.className = ['callout-box', 'callout-default'];
                        }
                    }
                }
            }
        });
    };
}

async function markdownToHtml(content: string, dictionary: any) {
    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypeCallouts)
        .use(rehypeShiki, dictionary)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);
    return result.toString();
}

function extractHeadings(content: string) {
    const lines = content.split('\n');
    const slugger = new GithubSlugger();
    const headings: Array<{ level: number, text: string, id: string }> = [];

    let inCodeBlock = false;
    for (const line of lines) {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (!inCodeBlock) {
            const match = line.match(/^(#{2,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = slugger.slug(text);
                headings.push({ level, text, id });
            }
        }
    }
    return headings;
}

export default async function PostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.lang, resolvedParams.slug);
    const dictionary = getDictionary(resolvedParams.lang as Locale);

    if (!post) {
        return notFound();
    }

    const headings = extractHeadings(post.content);
    const htmlContent = await markdownToHtml(post.content, dictionary);

    return (
        <div className="flex flex-col lg:flex-row gap-16 relative w-full items-start">
            <article className={`w-full ${headings.length > 0 ? 'lg:w-[68%] xl:w-[72%]' : 'max-w-4xl mx-auto'} prose prose-zinc dark:prose-invert max-w-none 
                prose-headings:scroll-mt-24 
                prose-p:text-zinc-700 dark:prose-p:text-[#94a3b8] 
                prose-strong:text-zinc-900 
                dark:prose-strong:text-zinc-100
                prose-strong:font-bold
                prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-transparent prose-pre:p-0`}>

                <header className="mb-12 pb-10 border-b border-zinc-200 dark:border-white/10 text-left">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-100 font-mono italic">
                        {post.title.toUpperCase()}
                    </h1>
                    <div className="flex items-center gap-6 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                        <time dateTime={post.date}>{dictionary.date}: {post.date}</time>
                        <span className="text-zinc-300 dark:text-teal-500/20">|</span>
                        <span>{dictionary.readTimeLabel}: {post.readTime} {dictionary.readTime.toUpperCase()}</span>
                    </div>
                </header>

                <div
                    className="text-left font-sans text-zinc-800 dark:text-[#94a3b8] leading-relaxed 
                    prose-strong:text-indigo-600 dark:prose-strong:text-amber-500"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </article>

            {headings.length > 0 && (
                <aside className="hidden lg:block lg:w-[32%] xl:w-[28%] sticky top-24">
                    <TableOfContents headings={headings} title={dictionary.tableOfContents} />
                </aside>
            )}
        </div>
    );
}
