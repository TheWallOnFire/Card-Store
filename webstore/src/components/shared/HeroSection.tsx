import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative h-[70vh] w-full mt-4 rounded-3xl overflow-hidden bg-slate-900 mx-auto max-w-[98%] shadow-2xl">
      {/* Background abstract gradient */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent z-10" />
      
      {/* Background Image / Texture */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <Image
           src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
           alt="Abstract liquid background"
           fill
           priority
           className="object-cover"
        />
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium tracking-wide backdrop-blur-md mb-6 animate-fade-in-up">
          New Pokémon & Magic Sets Arrived
        </span>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white max-w-5xl leading-[1.1] mb-6">
          The Hub for <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Professional Collectors
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light mb-10 leading-relaxed">
          Buy and sell verified trading cards from the world's most trusted sellers. 
          Real-time market prices, Condition-guaranteed.
        </p>

        {/* Action Container */}
        <div className="flex flex-col sm:row gap-4 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 h-14 rounded-xl text-lg">
            Browse All Cards
          </Button>
          <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 px-8 h-14 rounded-xl text-lg font-medium border border-white/20">
            Sell Your Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
