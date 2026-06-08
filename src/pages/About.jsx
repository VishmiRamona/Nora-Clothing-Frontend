import { Link } from 'react-router-dom';

const VALUES = [
  { title: 'Timeless Design', text: 'We favor silhouettes that outlast trends — pieces you reach for season after season.' },
  { title: 'Quality Fabrics', text: 'Every garment is made from premium, carefully sourced materials built to feel as good as they look.' },
  { title: 'Mindful Production', text: 'Smaller batches and considered sourcing help us keep our footprint light and our quality high.' },
];

export default function About() {
  return (
    <div className="bg-beige">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-skyblue/40 text-navy text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4">
            Our Story
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">Crafted for Everyday Elegance</h1>
          <p className="text-teal leading-relaxed">
            Nora Clothing was founded on a simple idea: that quiet, timeless style shouldn't be hard to find.
            We design wardrobe staples that move with your life — from busy mornings to evenings out —
            so you always feel confidently, effortlessly yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl shadow-md border border-skyblue/60 p-6">
              <h3 className="text-lg font-bold text-navy mb-2">{v.title}</h3>
              <p className="text-sm text-teal leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-navy text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to find your next favorite piece?</h2>
          <p className="text-skyblue/80 mb-6">Explore our latest collections, curated for every season and style.</p>
          <Link to="/features" className="inline-block bg-white text-navy font-semibold px-6 py-2.5 rounded-lg hover:bg-beige transition-colors">
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
