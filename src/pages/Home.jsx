import { useEffect, useState } from 'react';
import api from '../services/api';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ExclusiveOffers from '../components/home/ExclusiveOffers';
import BestSellers from '../components/home/BestSellers';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    api.get('/products/bestsellers')
      .then(res => setBestSellers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-beige">
      <HeroSection />
      <FeaturedCategories />
      <ExclusiveOffers />
      <BestSellers products={bestSellers} />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
