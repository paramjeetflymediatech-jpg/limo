import React from "react";
import { notFound } from "next/navigation";
import { initDb, BlogPost } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  await initDb();
  const post: any = await BlogPost.findOne({ where: { slug: resolvedParams.slug } });

  if (!post) {
    return {
      title: "Post Not Found | Fantastic Limo",
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Fantastic Limo Journal`,
    description: post.seoDescription || post.excerpt || "Read the latest from the Fantastic Limo journal.",
    keywords: post.seoKeywords || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  await initDb();
  const post: any = await BlogPost.findOne({ where: { slug: resolvedParams.slug } });

  if (!post || (!post.published && process.env.NODE_ENV !== "development")) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-matte-black pb-24">
      {/* Golden Banner */}
      <div className="bg-[#D0A511] pt-10 pb-12 px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-matte-black font-black tracking-wide leading-tight break-words [word-break:break-word] text-left flex-1">
            {post.title}
          </h1>
          <Link 
            href="/blog" 
            className="inline-flex items-center text-matte-black hover:bg-black/10 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Main Content */}
        <main className="w-full">

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4 border-b border-luxury-gold/10 pb-4">
            <span className="break-words">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-gray-400 font-serif italic break-words [word-break:break-word]">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full rounded-2xl mb-16 shadow-[0_0_40px_rgba(208,165,17,0.15)] object-contain"
          />
        )}

        {/* Content */}
        <div 
          className="prose prose-invert prose-gold max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-headings:font-serif prose-headings:text-white prose-headings:break-words prose-p:text-gray-300 prose-p:leading-relaxed prose-p:break-words prose-a:text-[#D0A511] prose-a:break-words [word-break:break-word]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

       
        </main>
      </div>
    </div>
  );
}
