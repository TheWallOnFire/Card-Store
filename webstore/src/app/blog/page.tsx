import React, { Suspense } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Blog | TCG Vault Strategy & Insights',
  description: 'Pro strategy guides, market analysis, and the latest trends from the world of Trading Card Games.',
};

// Mock blog data to replace server-side fetching
const mockBlogPosts: IBlogPost[] = [
  {
    id: 'post-1',
    title: 'The Rise of Manga Rares: A Market Analysis',
    excerpt: 'Exploring why specialized variants are becoming the most sought-after assets in modern TCG collecting.',
    created_at: new Date().toISOString(),
    category: 'Market analysis',
    featured_image: 'https://images.unsplash.com/photo-1620063234975-f9be3e3ad7a2?auto=format&fit=crop&q=80&w=800',
    profiles: { full_name: 'Oracle Lead' }
  },
  {
    id: 'post-2',
    title: 'Power Creep and the Future of Competitive Play',
    excerpt: 'How current mechanical trends are shaping the next generation of deck building and strategy.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'Strategy',
    featured_image: 'https://images.unsplash.com/photo-1611116246342-92e10c7322ab?auto=format&fit=crop&q=80&w=800',
    profiles: { full_name: 'Alpha Tactician' }
  },
  {
    id: 'post-3',
    title: 'Hidden Gems: Undervalued Sets in 2024',
    excerpt: 'Identifying historical sets with high growth potential and unique artistic value for long-term holders.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: 'Investing',
    featured_image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc5a?auto=format&fit=crop&q=80&w=800',
    profiles: { full_name: 'Market Architect' }
  }
];

export default async function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-6">
            Market Perspectives
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic uppercase leading-none mb-6">
            The Mastery <br /><span className="text-blue-500">Chronicle</span>
          </h1>
          <p className="max-w-2xl text-slate-400 font-bold text-sm md:text-base leading-relaxed">
            Data-driven card market analysis, pro-level deck theory, and exclusive interviews with the architects of the TCG meta.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        <Suspense fallback={<BlogLoading />}>
          <PostList />
        </Suspense>
      </div>
    </div>
  );
}

async function PostList() {
  // Simulating a delay to mimic fetching
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const posts = mockBlogPosts;

  if (!posts || posts.length === 0) {
    return <EmptyBlog />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: IBlogPost) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

interface IBlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  category: string;
  featured_image?: string;
  profiles?: { full_name: string };
}

function PostCard({ post }: { post: IBlogPost }) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2">
      <div className="relative aspect-video overflow-hidden">
        {post.featured_image ? (
          <Image 
            src={post.featured_image} 
            alt={post.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-blue-600/30 font-black" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur text-slate-900 border-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
            {post.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {post.profiles?.full_name || 'Oracle Author'}</span>
        </div>
        
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors uppercase italic">
          {post.title}
        </h2>
        
        <p className="text-[13px] text-slate-500 leading-relaxed font-medium mb-8 flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        
        <Link href={`/blog/${post.id}`}>
          <Button variant="ghost" className="w-full flex items-center justify-between group/btn gap-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl py-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all">
            Initiate Access <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function BlogLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-[32px] border border-slate-200 h-[500px] animate-pulse" />
      ))}
    </div>
  );
}

function EmptyBlog() {
  return (
    <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
      <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
        <BookOpen size={40} />
      </div>
      <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2 tracking-tight">The archives are currently sealed</h3>
      <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto uppercase tracking-widest">Our conceptual architects are distilling new strategies. Access restored shortly.</p>
    </div>
  );
}
