import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { valideURLConvert } from '../utils/valideURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';
import toast from 'react-hot-toast';
import { FaShare } from 'react-icons/fa6';
import FreeDownloadButton from './FreeDownloadButton';

const CardProduct = ({ data, showVideo = false }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);


  const shareProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}${url}`; // Full product URL
    navigator.clipboard.writeText(productUrl).then(() => {
      toast.success("link copied to clipboard")

    }).catch(err => {
      console.error('Error copying text to clipboard: ', err);
    });
  };

  return (
    <Link to={url} className="group border border-gray-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-500 grid gap-2 rounded-xl cursor-pointer bg-white overflow-hidden h-full flex-shrink-0 w-full min-w-[150px] md:min-w-[240px] max-w-[300px] mx-auto">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50 border-b border-gray-100">
        {showVideo && data?.more_details?.embedVideo ? (
          <div
            className="w-full h-full pointer-events-none"
            dangerouslySetInnerHTML={{
              __html: data.more_details.embedVideo
                .replace(/src="([^"]+)"/, (match, src) => {
                  const separator = src.includes('?') ? '&' : '?';
                  return `src="${src}${separator}autoplay=1&mute=1"`;
                })
            }}
          />
        ) : (
          <img
            src={data.image[0]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            alt={data.name}
          />
        )}
        {Boolean(data.discount) && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 text-[10px] font-black rounded shadow-sm uppercase tracking-tighter z-10">
            {data.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-3 pb-4 flex flex-col gap-2.5 relative">
        <div className="flex items-start justify-between gap-2 h-10">
          <div className="font-bold text-gray-800 text-[14px] line-clamp-2 leading-tight group-hover:text-green-700 transition-colors flex-1">
            {data.name}
          </div>
          {/* Circular Share Button beside Title */}
          <button
            onClick={shareProduct}
            className="w-7 h-7 flex items-center justify-center bg-gray-50/80 hover:bg-green-100 text-gray-400 hover:text-green-600 rounded-full transition-all border border-gray-100 group/share shadow-sm active:scale-95 flex-shrink-0"
            title="Share"
          >
            <FaShareAlt size={10} className="transition-colors" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col -space-y-0.5">
            <span className="text-xl font-black text-gray-950 leading-none">
              {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
            </span>
            {Boolean(data.discount) && (
              <span className="text-[13px] text-gray-600 line-through font-bold">
                {DisplayPriceInRupees(data.price)}
              </span>
            )}
          </div>

          <div className="flex-shrink-0">
            {data.price == 0 ? (
              <FreeDownloadButton data={data} />
            ) : (
              <div className="w-full">
                {data.stock == 0 ? (
                  <span className="bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded font-black uppercase whitespace-nowrap">Sold Out</span>
                ) : (
                  <AddToCartButton data={data} className="max-w-[100px]" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
