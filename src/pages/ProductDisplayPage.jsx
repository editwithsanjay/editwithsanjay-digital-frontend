import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi, { baseURL } from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaPlay } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import CardProduct from '../components/CardProduct'
import youtubeImage from '../assets/youtube.png'
import { useSelector } from 'react-redux'
import FreeDownloadButton from '../components/FreeDownloadButton'
import { IoShareSocialOutline } from "react-icons/io5";
import { HiOutlineDocumentText, HiOutlineLightBulb, HiOutlineBadgeCheck, HiOutlineSupport } from "react-icons/hi";
import toast from 'react-hot-toast'


const ProductDisplayPage = () => {

  const user = useSelector(state => state.user)
  // console.log(user)


  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [recomendationData, setRecomendationData] = useState([])
  const [allProductData, setAllProductData] = useState([])
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // Swap the current element with the randomly chosen one
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
      // console.log(responseData.data)

      document.title = responseData.data.name

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  async function getCategoryName(catId) {
    // console.log(catId);

    try {
      let response = await fetch(`${baseURL}/api/category/get`);
      let categories = await response.json();
      categories = categories.data;
      // console.log(categories);

      const matchedCategory = categories.find(cat => cat?._id === catId);
      // console.log(matchedCategory);

      if (matchedCategory) {
        setData(prevData => {
          let newData = { ...prevData };

          // Ensure more_details exists
          if (!newData.more_details) {
            newData.more_details = {};
          }

          newData.more_details.cat = matchedCategory.name;
          return newData;
        });
      }
      else {
        console.warn(`No matching category found for ID: ${catId}`);
      }
    }
    catch (error) {
      console.error("Error fetching category:", error);
    }
  }


  async function getRecomendationData() {
    if (!data?.category?.length) return;
    try {
      let response = await fetch(`${baseURL}/api/product/get-product-by-category`, {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.category[0] }),
      });
      response = await response.json();
      setRecomendationData(shuffleArray(response.data));
    } catch (error) {
      console.error("Error fetching recommendation data:", error);
    }
  }

  async function fetchAllProducts() {
    try {
      const response = await fetch(`${baseURL}/api/product/get`, {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 24 }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        setAllProductData(shuffleArray(responseData.data));
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  }


  useEffect(() => {
    fetchProductDetails()
    fetchAllProducts()
    window.scroll({ top: 0, behavior: "smooth" })
  }, [params])



  useEffect(() => {
    if (data.category?.length > 0) {
      getRecomendationData();
      getCategoryName(data.category[0]);
    }


  }, [data.category]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  }
  // console.log("product data",data)

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWindowWidth(window.innerWidth)
    })
  }, [])


  useEffect(() => {
    // Capture start time when the component mounts
    const startTime = new Date();

    const formatTime = (time) =>
      `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;

    const handleUnload = () => {
      const endTime = new Date();

      // Calculate viewed time in seconds
      const viewedTime = Math.floor((endTime - startTime) / 1000); // Convert ms to seconds

      const startFormatted = formatTime(startTime);
      const endFormatted = formatTime(endTime);

      // Send data using navigator.sendBeacon for reliability during page unload
      navigator.sendBeacon(
        `${baseURL}/api/survey/update-product-metrics`,
        JSON.stringify({
          productId: data._id,
          userId: user._id,
          viewedTime,
          startTime: startFormatted,
          endTime: endFormatted,
        })
      );
    };

    // Attach `beforeunload` event listener
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      // Capture end time when the component unmounts
      const endTime = new Date();

      // Calculate viewed time in seconds
      const viewedTime = Math.floor((endTime - startTime) / 1000); // Convert ms to seconds

      const startFormatted = formatTime(startTime);
      const endFormatted = formatTime(endTime);

      // Send data to the API
      fetch(`${baseURL}/api/survey/update-product-metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: data._id,
          userId: user._id,
          viewedTime,
          startTime: startFormatted,
          endTime: endFormatted,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Metrics successfully sent');
          } else {
            console.error('Failed to send metrics');
          }
        })
        .catch((error) => console.error('Error:', error));

      // Cleanup the `beforeunload` listener
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [data._id, user._id]);



  return (
    <div className='bg-white selection:bg-green-100 overflow-x-hidden w-full min-h-screen font-sans'>
      {/* Root Container - 30% Scale Reduction in layout */}
      <section className='container mx-auto px-4 py-8 lg:py-12'>
        <div className='flex flex-col lg:flex-row gap-8 xl:gap-12'>

          {/* LEFT: Product Gallery SECTION - Cinematic 60% split */}
          <div className='w-full lg:w-[60%] flex flex-col lg:flex-row gap-4'>

            {/* Thumbnail Navigation (Left side on Desktop, Below on Mobile) */}
            <div className='order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory lg:max-h-[500px] flex-shrink-0'>
              {data.image.map((img, index) => (
                <button
                  key={index + "thumb"}
                  onClick={() => setImage(index)}
                  className={`relative flex-shrink-0 w-14 h-14 lg:w-20 lg:h-14 rounded-lg border-2 transition-all duration-300 snap-start overflow-hidden ${image === index
                    ? 'border-green-500 shadow-sm shadow-green-100 scale-105 z-10'
                    : 'border-gray-100 hover:border-gray-200 grayscale hover:grayscale-0'
                    }`}
                >
                  <img src={img} className='w-full h-full object-cover' alt="thumbnail" />
                </button>
              ))}

              {/* Video Thumbnail Button */}
              {data.more_details?.embedVideo && (
                <button
                  onClick={() => setImage(-1)}
                  className={`relative flex-shrink-0 w-14 h-14 lg:w-20 lg:h-14 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${image === -1
                    ? 'border-red-500 bg-red-50 shadow-sm shadow-red-100 scale-105 z-10'
                    : 'border-gray-100 bg-gray-50 hover:bg-red-50/30'
                    }`}
                >
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center shadow-sm">
                    <FaPlay className="text-white text-[7px] ml-0.5" />
                  </div>
                  <span className="text-[6px] font-black uppercase tracking-widest text-red-600">Video</span>
                </button>
              )}
            </div>

            {/* Main Display Area - Cinematic aspect-video */}
            <div className='order-1 lg:order-2 flex-1 relative aspect-video bg-gray-50 rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] group hover:shadow-lg transition-all duration-700 max-h-[600px]'>
              <div className='w-full h-full p-1 flex items-center justify-center'>
                {image === -1 ? (
                  <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-lg">
                    {data.more_details?.embedVideo ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: data.more_details.embedVideo }}
                        className="w-full h-full aspect-video"
                      />
                    ) : (
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/38wisWFVvq8?autoplay=1"
                        title="Preview Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                ) : (
                  <img
                    src={data.image[image]}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out'
                    alt={data.name}
                  />
                )}
              </div>

              {/* Badges/Overlays */}
              {data.discount > 0 && (
                <div className='absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest shadow-md'>
                  {data.discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info SECTION - 40% split */}
          <div className='w-full lg:w-[40%] flex flex-col'>
            {/* Meta Info */}
            <div className='flex items-center gap-2 mb-3'>
              <span className="h-0.5 w-6 bg-green-500 rounded-full"></span>
              <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest italic'>
                {data?.more_details?.cat || 'Premium Selection'}
              </p>
            </div>

            {/* Title & Share Row - Beside each other as requested */}
            <div className='flex items-start justify-between gap-3 mb-1'>
              <h1 className='text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight flex-1'>
                {data.name}
              </h1>

              <button
                onClick={handleCopyLink}
                className="flex-shrink-0 p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all active:scale-95 group shadow-sm mt-0.5"
                title="Share product"
              >
                <IoShareSocialOutline className="text-xl text-gray-500 group-hover:text-green-600" />
              </button>
            </div>

            {/* Pricing Area - Removed excess space completely */}
            <div className='mb-2 mt-0'>
              <div className='flex items-end gap-3'>
                <div className='border border-green-600/20 bg-green-50/50 px-4 py-1.5 rounded-xl'>
                  <h2 className='text-2xl lg:text-3xl font-black text-green-700 tracking-tighter italic'>
                    {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                  </h2>
                </div>
                {data.discount > 0 && (
                  <div className='flex flex-col mb-1'>
                    <span className='text-sm text-gray-500 line-through font-bold'>
                      {DisplayPriceInRupees(data.price)}
                    </span>
                    <span className="text-xs font-black text-green-700 uppercase tracking-widest leading-none">{data.discount}% OFF</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Section - Tightened further */}
            <div className='mb-2'>
              {/* Add to Cart Button */}
              <div className='w-full'>
                {data.price === 0 ? (
                  <FreeDownloadButton data={data} user={user} className="py-4 rounded-2xl text-[12px]" />
                ) : (
                  data.stock === 0 ? (
                    <p className='text-red-500 font-black uppercase tracking-widest text-[10px] py-4 bg-red-50 rounded-2xl text-center border border-red-100'>Out of stock</p>
                  ) : (
                    <AddToCartButton data={data} className="py-4 rounded-2xl text-[12px]" />
                  )
                )}
              </div>
            </div>



            {/* Description Section - Icons instead of bullets */}
            <div className='space-y-4 pt-4 border-t border-gray-50'>
              <h3 className='text-[12px] md:text-[14px] font-extrabold text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2'>
                <HiOutlineDocumentText className="text-green-600 text-lg" />
                PROJECT DETAILS
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-500 text-[12px] lg:text-[13px] leading-relaxed font-medium'>
                {data.description?.split('.').map((line, idx) => (
                  line.trim() && (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                      {idx % 4 === 0 && <HiOutlineBadgeCheck className="text-green-500 text-base flex-shrink-0" />}
                      {idx % 4 === 1 && <HiOutlineLightBulb className="text-amber-500 text-base flex-shrink-0" />}
                      {idx % 4 === 2 && <HiOutlineSupport className="text-blue-500 text-base flex-shrink-0" />}
                      {idx % 4 === 3 && <HiOutlineDocumentText className="text-purple-500 text-base flex-shrink-0" />}
                      <p className="line-clamp-2">{line.trim()}.</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
















      {/* SECTION 1: Similar Products (1 Row Scroll) */}
      <section className="pt-4 border-t border-gray-50">
        <div className="container mx-auto px-4">
          <div className='flex items-center justify-between gap-4 mb-5 border-b-2 border-gray-100 pb-4'>
            <h3 className='font-black text-xl md:text-2xl text-gray-900 uppercase tracking-tighter'>
              Similar to this
            </h3>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[13px] font-black text-gray-950 uppercase tracking-[0.2em]">Explore Series</span>
              <div className="w-12 h-0.5 bg-black"></div>
            </div>
          </div>

          <div className="relative flex items-center w-full">
            <div className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth w-full max-w-full pb-6 pt-2">
              {recomendationData?.length > 0 ? (
                recomendationData.slice(0, 15).map((c, index) => (
                  <div key={c._id + "rec" + index} className="flex-shrink-0 transition-transform duration-500 hover:-translate-y-1">
                    <CardProduct data={c} />
                  </div>
                ))
              ) : (
                new Array(5).fill(null).map((_, i) => (
                  <div key={i + "skeleton"} className="w-[240px] md:w-[280px] aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse flex-shrink-0"></div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MORE PRODUCTS (4-5 Rows Grid) */}
      <section className="pt-8 pb-16 bg-gray-50/10">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className='flex items-center justify-between gap-4 mb-6 border-b-2 border-gray-100 pb-4'>
            <h3 className='font-black text-2xl md:text-3xl text-gray-900 uppercase tracking-tighter'>
              Explore More Collection
            </h3>
            <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase italic">Trending Designs</p>
          </div>

          {/* Responsive Grid - 4 to 5 Rows */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8">
            {allProductData?.length > 0 ? (
              allProductData.slice(0, 24).map((c, index) => (
                <div
                  key={c._id + "all" + index}
                  className="transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <CardProduct data={c} />
                </div>
              ))
            ) : (
              new Array(12).fill(null).map((_, i) => (
                <div key={i + "skeletonAll"} className="w-full aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default ProductDisplayPage
