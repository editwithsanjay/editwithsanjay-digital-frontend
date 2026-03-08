import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import shuffleArray from '../utils/shuffleArray'
import SpecialDeals from '../components/SpecialDeals'
import Hero from '../components/Hero'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  let categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

    navigate(url)
    console.log(url)
  }

  useEffect(() => {
    if (categoryData.length > 0) {
      setExpandedCategoryIds(categoryData.map(cat => cat._id));
    }
  }, [categoryData]);

  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);
  const [priceRange, setPriceRange] = useState(200);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sidebarContent = (
    <div className="space-y-8">
      {/* Price Filter Card */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group">
        <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          FILTER PRICE
        </h3>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600 transition-all"
          />
          <div className="flex justify-between mt-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">MIN</span>
              <span className="text-sm font-black text-gray-400 italic">₹0</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">MAX</span>
              <span className="text-sm font-black text-green-600 italic">₹{priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Category Menu */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500">
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.25em] flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
            CATEGORIES
          </h3>
        </div>
        <div className="flex flex-col py-3">
          {categoryData.map((cat) => {
            const isExpanded = expandedCategoryIds.includes(cat._id);
            const subCats = subCategoryData.filter(sub =>
              sub.category.some(c => (c._id || c) === cat._id)
            );

            return (
              <div key={cat._id + "HomeSidebar"} className="flex flex-col">
                <div
                  onClick={() => {
                    setExpandedCategoryIds(prev =>
                      isExpanded ? prev.filter(id => id !== cat._id) : [...prev, cat._id]
                    );
                    if (subCats.length === 0) {
                      setIsFilterOpen(false);
                      handleRedirectProductListpage(cat._id, cat.name);
                    }
                  }}
                  className={`flex items-center justify-between px-8 py-5 cursor-pointer transition-all duration-300 group ${isExpanded ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-[13.5px] font-black uppercase tracking-tight transition-colors ${isExpanded ? 'text-green-800' : 'text-neutral-900 group-hover:text-green-700'} font-sans`}>
                    {cat.name}
                  </span>
                  {subCats.length > 0 && (
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-green-600' : 'text-gray-300'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>

                {/* Expandable Subcategories */}
                <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-gray-50/30 px-8 py-3 flex flex-col gap-1.5 border-y border-gray-100/50">
                    {subCats.map(sub => (
                      <Link
                        key={sub._id}
                        onClick={() => setIsFilterOpen(false)}
                        to={`/${valideURLConvert(cat.name)}-${cat._id}/${valideURLConvert(sub.name)}-${sub._id}`}
                        className="text-[11px] font-bold text-gray-500 hover:text-green-600 py-2.5 transition-colors flex items-center gap-3 border-l-2 border-transparent hover:border-green-500 pl-2 -ml-2"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-green-500"></span>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section className='bg-white selection:bg-green-100 overflow-x-hidden w-full'>
      <Hero />
      <SpecialDeals />

      <div className='container mx-auto px-4 py-8 max-w-full'>
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-gray-100'>
          <h3 className='font-black text-xl md:text-2xl text-gray-900 uppercase tracking-tighter'>
            Shop by Category
          </h3>
        </div>

        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6'>
          {
            loadingCategory ? (
              new Array(10).fill(null).map((c, index) => {
                return (
                  <div key={index + "loadingcategory"} className='bg-white rounded-2xl p-4 aspect-square grid gap-2 shadow-sm border border-gray-50 animate-pulse'>
                    <div className='bg-gray-100 w-full h-full rounded-xl'></div>
                  </div>
                )
              })
            ) : (
              shuffleArray(categoryData).map((cat, index) => {
                return (
                  <div
                    key={cat._id + "displayCategory"}
                    className='group flex flex-col items-center gap-3 cursor-pointer'
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className='relative w-full aspect-square bg-gray-50 rounded-2xl border border-gray-100 p-3 overflow-hidden transition-all duration-500 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-green-100/50 group-hover:-translate-y-1 transform'>
                      <img
                        src={cat.image}
                        className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500'
                        alt={cat.name}
                      />
                    </div>
                    <span className='text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest text-center leading-none group-hover:text-green-600 transition-colors'>
                      {cat.name}
                    </span>
                  </div>
                )
              })
            )
          }
        </div>
      </div>

      {/***display category product with sidebar ***/}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 py-16 max-w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24">
            {sidebarContent}
          </div>
        </aside>

        {/* Categories Product List */}
        <div className="flex-1 space-y-12 w-full">
          {categoryData?.map((c, index) => (
            <CategoryWiseProductDisplay
              key={c?._id + "CategorywiseProduct"}
              id={c?._id}
              name={c?.name}
              maxPrice={priceRange}
            />
          ))}
        </div>
      </div>

      {/* Floating Filter Button (Mobile View) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-green-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-2xl shadow-green-200 flex items-center gap-3 border-2 border-green-500 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter & Genre
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[3rem] p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Refine Selection</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  )
}

export default Home
