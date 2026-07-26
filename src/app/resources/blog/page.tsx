import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import { getAllBlogPosts } from "@/lib/repositories/blog.repository";

export default async function PublicBlogPage() {
  const posts = await getAllBlogPosts();
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        {/* Page Banner */}
        <div className="bg-[#1a1a1a] text-white py-14 mb-12">
          <Container>
            <div className="max-w-3xl">
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
                Knowledge &amp; Advice
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
                Relationship Blog
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Expert insights on intentional dating, communication, financial alignment, and building a marriage that lasts.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          {/* Featured Article */}
          {featuredPost && (
            <div className="mb-14">
              <span className="block font-sans text-xs font-bold text-[#7b1d2a] uppercase tracking-wider mb-4">
                Featured Article
              </span>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto min-h-[280px]">
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-sans text-gray-500 mb-3">
                      <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-semibold px-3 py-1 rounded-full">
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {featuredPost.publishedAt}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-4 hover:text-[#7b1d2a] transition-colors">
                      <Link href={`/resources/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="font-sans text-gray-600 text-sm leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="font-sans text-xs text-gray-500 flex items-center gap-1.5">
                      <User size={13} /> {featuredPost.author}
                    </span>
                    <Link
                      href={`/resources/blog/${featuredPost.slug}`}
                      className="font-sans text-xs font-bold text-[#7b1d2a] flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read Full Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative h-48">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-sans mb-2">
                        <span className="text-[#7b1d2a] font-semibold">{post.category}</span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-3 hover:text-[#7b1d2a] transition-colors">
                        <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="font-sans text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <Link
                      href={`/resources/blog/${post.slug}`}
                      className="font-sans text-xs font-semibold text-[#7b1d2a] inline-flex items-center gap-1 hover:gap-2 transition-all mt-4 border-t border-gray-100 pt-3"
                    >
                      Read Article <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
