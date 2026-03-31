import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/content/blog');

export interface PostMetadata {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    series?: string;
    readTime?: number;
}

export interface Post extends PostMetadata {
    content: string;
}

function calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

export async function getPostBySlug(lang: string, slug: string): Promise<Post | null> {
    const fullPath = path.join(contentDir, lang, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        series: data.series || undefined,
        readTime: calculateReadTime(content),
        content,
    };
}

export async function getAllPosts(lang: string): Promise<PostMetadata[]> {
    const langDir = path.join(contentDir, lang);
    if (!fs.existsSync(langDir)) {
        return [];
    }
    
    const fileNames = fs.readdirSync(langDir);
    const posts = fileNames
        .filter(file => file.endsWith('.mdx'))
        .map(fileName => {
            const fullPath = path.join(langDir, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            
            return {
                slug: fileName.replace(/\.mdx$/, ''),
                title: data.title,
                date: data.date,
                tags: data.tags || [],
                series: data.series || undefined,
                readTime: calculateReadTime(content),
            };
        })
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
        
    return posts;
}
