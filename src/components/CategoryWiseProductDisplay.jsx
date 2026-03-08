import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name, maxPrice = 200 }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    // Filter products by price
    const filteredProducts = data.filter(p => !maxPrice || p.price <= maxPrice)
    const hasProducts = filteredProducts.length > 0;


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const randomIndex = Math.floor(Math.random() * (i + 1));

            // Swap the current element with the randomly chosen one
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    }

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(shuffleArray(responseData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }





    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })

            return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL = handleRedirectProductListpage()
    return (
        <div className="mb-8 w-full">
            <div className='flex items-center justify-between gap-4 mb-6 border-b-2 border-gray-100 pb-4'>
                <h3 className='font-black text-xl md:text-2xl text-gray-900 uppercase tracking-tighter'>{name}</h3>
                <Link to={redirectURL} className='text-[10px] font-black tracking-widest text-green-600 hover:text-white hover:bg-green-600 border-2 border-green-600 px-4 py-1.5 rounded-full transition-all uppercase'>See All</Link>
            </div>
            <div className='relative flex items-center w-full'>
                <div className='flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-none scroll-smooth w-full max-w-full' ref={containerRef}>
                    {
                        loading &&
                        loadingCardNumber.map((_, index) => (
                            <CardLoading key={"CategorywiseProductDisplay123" + index} />
                        ))
                    }

                    {!loading && hasProducts &&
                        filteredProducts.map((p, index) => (
                            <CardProduct
                                data={p}
                                key={p._id + "CategorywiseProductDisplay" + index}
                            />
                        ))
                    }

                    {!loading && !hasProducts && (
                        <div className="w-full py-10 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">No designs found under ₹{maxPrice}</p>
                        </div>
                    )}
                </div>
            </div>
            {/* <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full'>
                        <FaAngleRight />
                </button>
                </div> */}
        </div>
    )
}

export default CategoryWiseProductDisplay
