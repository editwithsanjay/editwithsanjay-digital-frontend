import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { BsCart4, BsCartXFill } from 'react-icons/bs'
import BottomForm from './BottomForm'

const AddToCartButton = ({ data, className = "" }) => {

    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const [productDetails, setProductDetails] = useState({})
    const [showForm, setShowForm] = useState(false)  // Add state to control form visibility

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            console.log(data)
            if (data.price == 0) {
                toast.success("FREE product")
            }
            else {
                const response = await Axios({
                    ...SummaryApi.addTocart,
                    data: {
                        productId: data?._id
                    }
                })
                const { data: responseData } = response

                if (responseData.success) {
                    toast.success(responseData.message)
                    if (fetchCartItem) {
                        fetchCartItem()
                    }
                }

            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)

            if (response.success) {
                toast.success("Item removed")
            }
        }
    }

    const decreaseQty2 = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        let data = cartItemDetails;
        setProductDetails(cartItemDetails)
        deleteCartItem(cartItemDetails?._id)
        console.log(data)

        // Open the BottomForm when the item is removed from the cart
        setShowForm(true)
    }

    return (
        <div className={`w-full ${className}`}>
            {
                isAvailableCart ? (
                    <div className='flex w-full h-full'>
                        {
                            qty % 2 === 0 ?
                                <button onClick={increaseQty} className='w-full bg-green-600 hover:bg-green-700 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-3 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 whitespace-nowrap'>
                                    <BsCart4 size={12} />
                                    ADD TO CART
                                </button>
                                :
                                <button onClick={decreaseQty2} className='w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl transition-all shadow-sm flex items-center justify-center active:scale-95'>
                                    <BsCartXFill size={16} />
                                </button>
                        }
                    </div>
                ) : (
                    <button onClick={handleADDTocart} className='w-full bg-green-600 hover:bg-green-700 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-3 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 whitespace-nowrap'>
                        {loading ? <Loading /> : <>
                            <BsCart4 size={12} />
                            <span>ADD TO CART</span>
                        </>}
                    </button>
                )
            }

            {/* Display BottomForm if showForm is true */}
            {showForm && <div>
                <BottomForm productId={productDetails?.productId?._id} userId={productDetails?.userId} />
            </div>}
        </div>
    )
}

export default AddToCartButton
