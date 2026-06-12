import React from "react";
import Link from "next/link";
import { initDb, BlogPost } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Fantastic Limo",
  description: "Read the latest news, insights, and luxury travel tips from Fantastic Limo.",
};

export const revalidate = 60; // Revalidate every minute

export default async function BlogIndexPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const pageStr = searchParams?.page;
  const page = typeof pageStr === 'string' ? parseInt(pageStr, 10) : 1;
  const limit = 6;
  const offset = (page > 0 ? page - 1 : 0) * limit;

  await initDb();
  const { count, rows: posts } = await BlogPost.findAndCountAll({
    where: { published: true },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="min-h-screen bg-matte-black pb-24 overflow-hidden">
      {/* Golden Banner */}
      <div className="bg-[#D0A511] pt-10 pb-12 px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-matte-black font-black tracking-wide text-center lg:text-left">
            Blog
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Content */}
        <main className="w-full">

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No articles have been published yet. Check back soon.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="group flex flex-col bg-dark-gray border border-luxury-gold/10 rounded-xl overflow-hidden hover:border-luxury-gold/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(208,165,17,0.15)]"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D0A511]/30 font-serif text-3xl">
                        F
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">
                      <span className="opacity-0 hidden">Author</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-serif text-white font-bold mb-3 line-clamp-2 group-hover:text-[#D0A511] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center text-[#D0A511] text-xs font-bold uppercase tracking-widest">
                      Read Article
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-4">
                {page > 1 ? (
                  <Link href={`/blog?page=${page - 1}`} className="px-6 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-colors rounded-md font-bold text-xs uppercase tracking-widest">
                    Previous
                  </Link>
                ) : (
                  <div className="px-6 py-2 border border-gray-600 text-gray-600 rounded-md font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                    Previous
                  </div>
                )}
                
                <div className="flex items-center text-gray-400 text-sm font-semibold mx-4">
                  Page {page} of {totalPages}
                </div>

                {page < totalPages ? (
                  <Link href={`/blog?page=${page + 1}`} className="px-6 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-colors rounded-md font-bold text-xs uppercase tracking-widest">
                    Next
                  </Link>
                ) : (
                  <div className="px-6 py-2 border border-gray-600 text-gray-600 rounded-md font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                    Next
                  </div>
                )}
              </div>
            )}
          </>
        )}
        </main>
      </div>
    </div>
  );
}
