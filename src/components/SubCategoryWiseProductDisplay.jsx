import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'

const SubCategoryWiseProductDisplay = ({ categoryId, subCategory }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const loadingCardNumber = new Array(4).fill(null)

    const fetchSubCategoryProducts = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategoryAndSubCategory,
                data: {
                    categoryId: categoryId,
                    subCategoryId: subCategory._id,
                    page: 1,
                    limit: 8
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            console.error("Error fetching subcategory products", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubCategoryProducts()
    }, [categoryId, subCategory._id])

    if (!loading && data.length === 0) return null

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6 border-b-2 border-gray-100 pb-4">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                    {subCategory.name}
                </h2>
                <Link
                    to={`/${valideURLConvert(subCategory?.category[0]?.name)}-${categoryId}/${valideURLConvert(subCategory.name)}-${subCategory._id}`}
                    className="text-[10px] font-black tracking-widest text-green-600 hover:text-white hover:bg-green-600 border-2 border-green-600 px-4 py-1.5 rounded-full transition-all uppercase"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    loadingCardNumber.map((_, index) => (
                        <CardLoading key={"SubCategoryWiseProductDisplay" + index} />
                    ))
                ) : (
                    data.map((p, index) => (
                        <CardProduct
                            data={p}
                            key={p._id + "SubCategoryWiseProductDisplay" + index}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default SubCategoryWiseProductDisplay
