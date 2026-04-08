import React from 'react';
import Image from 'next/image';

const categories = [
  {
    title: "Pokémon",
    span: "col-span-1 md:col-span-2 row-span-2",
    img: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=2000&auto=format&fit=crop",
    color: "from-blue-900/80"
  },
  {
    title: "Magic: The Gathering",
    span: "col-span-1 md:col-span-1 row-span-1",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    color: "from-amber-900/80"
  },
  {
    title: "Yu-Gi-Oh!",
    span: "col-span-1 md:col-span-1 row-span-1",
    img: "https://images.unsplash.com/photo-1598284560416-bc1ddcb00508?q=80&w=1000&auto=format&fit=crop",
    color: "from-purple-900/80"
  },
  {
    title: "Sealed Product",
    span: "col-span-1 md:col-span-2 row-span-1",
    img: "https://images.unsplash.com/photo-1643329302142-f83134371901?q=80&w=2000&auto=format&fit=crop",
    color: "from-emerald-900/80"
  }
];

export function FeaturedCategories() {
  return (
    <section className="w-full py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 uppercase italic">
              Explore by Game
            </h2>
            <p className="text-slate-500 text-lg uppercase font-medium tracking-wide">Find singles and sealed products from your favorite TCGs</p>
          </div>
          <a href="#" className="hidden sm:flex text-blue-600 font-bold hover:text-blue-800 transition-colors uppercase tracking-widest text-xs items-center gap-2">
            View All Games <span className="text-lg">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {categories.map((cat, i) => (
            <a 
              key={i} 
              href="#" 
              className={`group relative overflow-hidden rounded-xl border border-slate-200 ${cat.span} bg-slate-100 block shadow-sm hover:shadow-xl transition-shadow`}
            >
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-slate-900/20 opacity-90 transition-opacity group-hover:opacity-100`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white text-3xl font-black uppercase italic translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {cat.title}
                </h3>
                <p className="text-white/80 mt-2 font-medium tracking-wide uppercase text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  Shop Singles & Sealed
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
