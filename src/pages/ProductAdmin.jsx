import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch product data function
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 24,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle next button click
  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // Corrected search input change handler
  const handleOnChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Debounce function to optimize search input
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedFetchProductData = debounce(fetchProductData, 300);

  useEffect(() => {
    debouncedFetchProductData();
  }, [search, page]);

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>

        <div className="ml-auto bg-blue-50 px-4 py-2 rounded flex items-center gap-3">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder="Search product here..."
            className="h-full w-full bg-transparent outline-none"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className="p-4 bg-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {productData.map((p, index) => (
            <ProductCardAdmin key={index} data={p} fetchProductData={fetchProductData} />
          ))}
        </div>

        <div className="flex justify-between my-4">
          <button onClick={handlePrevious} className="border px-4 py-1 hover:bg-gray-200">
            Previous
          </button>
          <button className="w-full bg-gray-100 py-1">
            {page}/{totalPageCount}
          </button>
          <button onClick={handleNext} className="border px-4 py-1 hover:bg-gray-200">
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
