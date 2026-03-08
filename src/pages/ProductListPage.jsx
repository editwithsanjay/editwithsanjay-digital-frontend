import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import SubCategoryWiseProductDisplay from "../components/SubCategoryWiseProductDisplay";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  console.log(params)
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800); // Dynamically check width
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const [mobileData, setMobileData] = useState([]);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory?.split("-").slice(-1)[0];

  async function getMobileProductData() {
    try {
      let response = await fetch(`${baseURL}/api/product/get-product-by-category-mobile`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: categoryId }),
        }
      );

      if (!response.ok) {
        console.error("Mobile product API failed:", response.statusText);
        setMobileData([]); // Fallback to empty data
        return;
      }

      const data = await response.json();
      setMobileData(data.data || []); // Use empty array if data is undefined
    } catch (error) {
      console.error("Error fetching mobile product data:", error);
      setMobileData([]);
    }
  }

  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(200); // Default max price

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 200,
          sort: sort,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterSubAttr = AllSubCategory.filter((s) => {
      return s.category.some((c) => {
        return (c._id || c) === categoryId;
      });
    });
    setDisplaySubCategory(filterSubAttr);
  }, [categoryId, AllSubCategory]);

  useEffect(() => {
    if (subCategoryId) {
      fetchProductdata();
    }
    if (window.innerWidth <= 800) getMobileProductData();
  }, [params, sort, subCategoryId]); // Refresh on sort or subcategory change

  const categoryName = params.category.split("-").slice(0, -1).join(" ").replace(/_/g, ' ');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sidebarContent = (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-gray-200 overflow-hidden">
      {/* Price Filter */}
      <div className="p-8 border-b border-gray-100">
        <h3 className="text-[12px] font-black text-gray-900 uppercase mb-8 tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Price Range
        </h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600 shadow-sm"
          />
          <div className="flex justify-between mt-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Min</span>
              <span className="text-sm font-black text-gray-400 italic">₹0</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Max</span>
              <span className="text-sm font-black text-green-600 italic">₹{priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="p-8 border-b border-gray-100">
        <h3 className="text-[12px] font-black text-gray-400 uppercase mb-6 tracking-[0.2em]">Sort By</h3>
        <div className="flex flex-col gap-3.5">
          {[
            { label: 'Newest First', value: '' },
            { label: 'Price: Low to High', value: 'price-low-to-high' },
            { label: 'Price: High to Low', value: 'price-high-to-low' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value={opt.value}
                  checked={sort === opt.value}
                  onChange={(e) => {
                    setSort(e.target.value);
                    if (isFilterOpen) setIsFilterOpen(false);
                  }}
                  className="w-5 h-5 text-green-600 bg-gray-50 border-gray-200 focus:ring-green-400 cursor-pointer transition-all"
                />
              </div>
              <span className={`text-[13px] font-black uppercase tracking-tight transition-all ${sort === opt.value ? 'text-green-700' : 'text-gray-600 group-hover:text-gray-900 group-hover:translate-x-1'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      {DisplaySubCatory.length > 0 && (
        <div className="p-8">
          <h3 className="text-[12px] font-black text-gray-400 uppercase mb-6 tracking-[0.2em]">Sub Genres</h3>
          <nav className="flex flex-col gap-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 pr-1">
            {DisplaySubCatory.map((s) => {
              const link = `/${valideURLConvert(categoryName)}-${categoryId}/${valideURLConvert(s.name)}-${s._id}`;
              const isActive = subCategoryId === s._id;

              return (
                <Link
                  to={link}
                  key={s._id}
                  onClick={() => setIsFilterOpen(false)}
                  className={`px-5 py-4 text-[11px] font-black uppercase tracking-tight rounded-xl transition-all border-2 ${isActive
                    ? "bg-green-600 border-green-600 text-white shadow-xl shadow-green-100 -translate-y-1 scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent hover:translate-x-1"
                    }`}
                >
                  {s.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-white min-h-screen overflow-x-hidden w-full font-sans">
      <div className="container mx-auto px-4 py-12 max-w-full">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-28">
              {sidebarContent}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full">
            {/* Header */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-gray-100 mb-10 overflow-hidden group hover:border-green-500 transition-all duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-3">
                    {subCategoryName || "All Selection"}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-12 bg-green-500 rounded-full"></span>
                    <p className="text-[12px] font-black text-green-600 uppercase tracking-widest italic opacity-80 group-hover:opacity-100 transition-opacity">
                      Showing {data.length} premium designs
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:items-end md:text-right border-l-4 md:border-l-0 md:border-r-4 border-gray-100 group-hover:border-green-500 pl-6 md:pl-0 md:pr-6 py-2 transition-all">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5">Collection</span>
                  <h3 className="text-2xl font-black text-gray-400 group-hover:text-gray-800 uppercase tracking-tight leading-none italic transition-colors">{categoryName}</h3>
                </div>
              </div>
            </div>

            {/* Mobile Subcategory Sticky Bubble Menu */}
            <div className="lg:hidden w-full mb-8 sticky top-0 bg-white/80 backdrop-blur-md pt-4 pb-2 z-10 -mx-4 px-4 overflow-hidden border-b border-gray-50">
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
                {DisplaySubCatory.map((s) => {
                  const link = `/${valideURLConvert(categoryName)}-${categoryId}/${valideURLConvert(s.name)}-${s._id}`;
                  const isActive = subCategoryId === s._id;
                  return (
                    <Link
                      key={s._id}
                      to={link}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isActive
                        ? "bg-green-600 border-green-600 text-white shadow-xl shadow-green-100 scale-105"
                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                    >
                      {s.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Product Grid or Subcategory Sections */}
            <div className="w-full">
              {loading && data.length === 0 && subCategoryId ? (
                <div className="flex flex-col items-center justify-center py-32 grayscale opacity-50">
                  <Loading />
                  <p className="text-xs font-black text-gray-400 mt-8 uppercase tracking-widest animate-pulse">Scanning the database...</p>
                </div>
              ) : subCategoryId ? (
                /* Specific Subcategory Grid View */
                <>
                  {data.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-24 text-center border-2 border-dashed border-gray-100 shadow-inner">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <span className="text-4xl">📦</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">No matching results</h3>
                      <p className="text-sm font-bold text-gray-400 mt-3 max-w-xs mx-auto text-balance">We couldn't find any designs reaching your criteria at this moment.</p>
                      <button
                        onClick={() => { setPriceRange(10000); setSort(''); }}
                        className="mt-8 text-[10px] font-black text-green-600 uppercase tracking-[0.2em] border-b-2 border-green-200 pb-1 hover:border-green-500 transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                      {data
                        .filter(p => !priceRange || p.price <= priceRange)
                        .map((p, index) => (
                          <div key={p._id + "productListPage" + index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <CardProduct data={p} />
                          </div>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                /* Category Landing View - Show all Subcategories as sections */
                <div className="flex flex-col gap-24">
                  {DisplaySubCatory.map((sub, idx) => (
                    <SubCategoryWiseProductDisplay
                      key={sub._id}
                      categoryId={categoryId}
                      subCategory={sub}
                    />
                  ))}
                </div>
              )}

              {loading && data.length > 0 && (
                <div className="mt-20 flex justify-center pb-20">
                  <div className="p-4 bg-white rounded-full shadow-2xl border border-gray-100">
                    <Loading />
                  </div>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>

      {/* Floating Filter Button (Mobile View) */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-green-600 text-white font-black text-[10px] uppercase tracking-widest px-12 py-5 rounded-full shadow-2xl shadow-green-200 flex items-center gap-4 border-2 border-green-500 active:scale-95 transition-all text-shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          REfine search
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md transition-opacity">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[3.5rem] p-10 max-h-[92vh] overflow-y-auto animate-slide-up shadow-[-20px_0_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">Filters</h2>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1.5 italic">Sort & Genres</span>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-4 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default ProductListPage;
