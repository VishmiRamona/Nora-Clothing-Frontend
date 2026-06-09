import { useEffect, useState } from 'react';
import api from '../services/api';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ExclusiveOffers from '../components/home/ExclusiveOffers';
import BestSellers from '../components/home/BestSellers';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import NewArrivals from '../components/home/NewArrivals';

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    api.get('/products/bestsellers')
      .then(res => setBestSellers(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    api.get('/products/new-arrivals')
      .then(res => setNewArrivals(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-beige">
      <HeroSection />
      <FeaturedCategories />
      <ExclusiveOffers />
      <BestSellers products={bestSellers} />
      <NewArrivals products={newArrivals} />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
