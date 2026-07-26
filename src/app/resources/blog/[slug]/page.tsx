import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/repositories/blog.repository";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        <Container>
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/resources/blog"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-[#7b1d2a] hover:opacity-80"
            >
              <ArrowLeft size={14} /> Back to Blog Articles
            </Link>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 text-xs font-sans text-gray-500 mb-3">
                <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {post.publishedAt}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1a1a] leading-tight mb-4">
                {post.title}
              </h1>
              <p className="font-sans text-gray-600 text-base leading-relaxed mb-4 italic border-l-4 border-[#c9962c] pl-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 font-sans border-t border-b border-gray-100 py-3">
                <span className="flex items-center gap-1.5">
                  <User size={14} /> Written by <strong>{post.author}</strong>
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden mb-8">
              <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
            </div>

            {/* Content Body */}
            <div className="prose prose-stone max-w-none font-sans text-gray-800 text-sm sm:text-base leading-relaxed space-y-4">
              {post.content.split("\n").map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={index} className="font-serif text-xl font-bold text-[#1a1a1a] mt-6 mb-2">
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }
                return <p key={index}>{trimmed}</p>;
              })}
            </div>

            {/* CTA Box */}
            <div className="mt-12 p-6 bg-[#fbf5ec] border border-[#e8e0d4] rounded-2xl text-center space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Ready to Apply This Knowledge in Your Relationship?</h3>
              <p className="font-sans text-xs text-gray-600 max-w-lg mx-auto">
                Join Relationship Wahala &amp; Connections today for intentional matchmaking and personalized pre-marital coaching.
              </p>
              <Button href="/register" variant="primary" size="md">
                Get Started Now
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="max-w-4xl mx-auto mt-14">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/resources/blog/${rel.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex gap-4"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={rel.featuredImage} alt={rel.title} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-sans text-[10px] font-semibold text-[#7b1d2a] uppercase">{rel.category}</span>
                      <h4 className="font-serif text-sm font-bold text-[#1a1a1a] line-clamp-2 mt-1 mb-2">{rel.title}</h4>
                      <span className="font-sans text-xs text-gray-400">{rel.publishedAt}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
