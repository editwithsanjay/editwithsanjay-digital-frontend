import React, { useState, useEffect } from 'react';
import banner from '../assets/banner.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import bannerMobile3 from '../assets/banner-mobile-3.png';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

import './Hero.css'; // Importing CSS for animations

function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentMobile, setCurrentMobile] = useState(0);
  const [currentDesktop, setCurrentDesktop] = useState(0);

  const defaultImages = {
    mobile: [
      { src: bannerMobile, url: 'https://editing-pack.vercel.app' },
      { src: bannerMobile3 }
    ],
    desktop: [
      { src: banner, url: 'https://editing-pack.vercel.app' }
    ]
  };

  const fetchBanners = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getBanner
      })
      if (response.data.success) {
        setBanners(response.data.data)
      }
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const desktopBanners = [
    ...defaultImages.desktop,
    ...banners.map(b => ({ src: b.imageUrl, url: b.link }))
  ];

  const mobileBanners = [
    ...defaultImages.mobile,
    ...banners.map(b => ({ src: b.mobileImageUrl, url: b.link }))
  ];

  useEffect(() => {
    if (mobileBanners.length === 0 || desktopBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMobile((prev) => (prev + 1) % mobileBanners.length);
      setCurrentDesktop((prev) => (prev + 1) % desktopBanners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [mobileBanners.length, desktopBanners.length]);

  return (
    <div className='container mx-auto px-2 lg:px-0'>
      {/* Desktop Images */}
      <div className='w-full h-full hidden lg:block slide-in overflow-hidden rounded-lg'>
        {desktopBanners[currentDesktop]?.url ? (
          <div style={{ cursor: 'pointer' }} onClick={() => window.open(desktopBanners[currentDesktop].url, '_blank')}>
            <img src={desktopBanners[currentDesktop].src} className='w-full h-full object-cover transition-all duration-500' alt='banner' />
          </div>
        ) : (
          <img src={desktopBanners[currentDesktop]?.src} className='w-full h-full object-cover' alt='banner' />
        )}
      </div>

      {/* Mobile Images */}
      <div className='w-full h-full lg:hidden slide-in overflow-hidden rounded-md'>
        {mobileBanners[currentMobile]?.url ? (
          <div style={{ cursor: 'pointer' }} onClick={() => window.open(mobileBanners[currentMobile].url, '_blank')}>
            <img src={mobileBanners[currentMobile].src} className='w-full h-full object-cover transition-all duration-500' alt='banner' />
          </div>
        ) : (
          <img src={mobileBanners[currentMobile]?.src} className='w-full h-full object-cover' alt='banner' />
        )}
      </div>
    </div>
  );
}

export default Hero;
