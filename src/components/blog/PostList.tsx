'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, FolderLock } from 'lucide-react';

interface Post {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    series?: string;
}

interface PostListProps {
    posts: Post[];
    lang: string;
    placeholder: string;
    dateLabel: string;
    sagaLabel: string;
}

export default function PostList({ posts, lang, placeholder, dateLabel, sagaLabel }: PostListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-10">
            <div className="relative group w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-amber-500 transition-colors" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 dark:focus:ring-amber-500/30 transition-all font-mono text-xs tracking-tight placeholder:text-zinc-500 uppercase"
                />
            </div>

            <div className="grid gap-6">
                {filteredPosts.map((post) => (
                    <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="group block">
                        <article className="p-6 rounded-xl border border-transparent hover:border-indigo-500/10 dark:hover:border-amber-500/10 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all relative overflow-hidden backdrop-blur-sm shadow-sm text-left">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 dark:bg-amber-500/5 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {post.series && (
                                <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-600 dark:text-amber-500 mb-3 uppercase tracking-widest italic opacity-90">
                                    <FolderLock className="w-3 h-3" />
                                    <span>{sagaLabel}: {post.series}</span>
                                </div>
                            )}
                            <h2 className="text-xl font-bold mb-3 text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-amber-500 transition-colors leading-tight font-mono tracking-tight uppercase italic">
                                {post.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] text-zinc-500 dark:text-[#94a3b8] font-mono tracking-widest uppercase">
                                <time dateTime={post.date}>{dateLabel}: {post.date}</time>
                                <div className="flex gap-2">
                                    {post.tags.map((tag) => (
                                        <span 
                                            key={tag} 
                                            className="px-2 py-0.5 rounded-md border border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-white/[0.02] text-zinc-600 dark:text-zinc-400 font-mono text-[9px] font-medium tracking-tight hover:border-indigo-500/30 dark:hover:border-amber-500/30 transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
