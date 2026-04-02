import React from 'react';
import Image from 'next/image';

const categories = [
  {
    title: "Tech Arsenal",
    span: "col-span-1 md:col-span-2 row-span-2",
    img: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2000&auto=format&fit=crop",
    color: "from-blue-900/60"
  },
  {
    title: "Minimalist Decor",
    span: "col-span-1 md:col-span-1 row-span-1",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
    color: "from-amber-900/40"
  },
  {
    title: "Apparel",
    span: "col-span-1 md:col-span-1 row-span-1",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
    color: "from-purple-900/40"
  },
  {
    title: "Everyday Carry",
    span: "col-span-1 md:col-span-2 row-span-1",
    img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop",
    color: "from-emerald-900/40"
  }
];

export function FeaturedCategories() {
  return (
    <section className="w-full py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
              Curated Spaces
            </h2>
            <p className="text-slate-500 text-lg">Explore our most popular departments</p>
          </div>
          <a href="#" className="hidden sm:flex text-blue-600 font-semibold hover:underline underline-offset-4 items-center">
            View all categories →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {categories.map((cat, i) => (
            <a 
              key={i} 
              href="#" 
              className={`group relative overflow-hidden rounded-3xl ${cat.span} bg-slate-100 block`}
            >
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-80 transition-opacity group-hover:opacity-90`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {cat.title}
                </h3>
                <p className="text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  Explore collection
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
