import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'
import { MdEdit, MdDelete, MdLocalOffer } from "react-icons/md";
import SummaryApi, { baseURL } from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchProductData) {
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }


  async function addToDeals() {
    try {
      let response = await fetch(`${baseURL}/api/product/add-to-deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: data._id })
      })

      response = await response.json()
      console.log(response)

      if (response.success) {
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      console.log(response.message)
      toast.error(response.message)
    }
  }

  return (
    <div className='w-46 p-2 bg-white rounded'>
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className='w-full h-full object-scale-down'
        />
      </div>
      <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
      <p className='text-slate-400'>{data?.unit}</p>
      <div className='flex items-center justify-between gap-3 py-2 mt-auto'>
        <button
          onClick={() => addToDeals()}
          className='p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-100 active:scale-95'
          title="Add to Deals"
        >
          <MdLocalOffer size={18} />
        </button>
        <button
          onClick={() => setEditOpen(true)}
          className='p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-100 active:scale-95'
          title="Edit Product"
        >
          <MdEdit size={18} />
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className='p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-100 active:scale-95'
          title="Delete Product"
        >
          <MdDelete size={18} />
        </button>
      </div>

      {
        editOpen && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
        )
      }

      {
        openDelete && (
          <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center '>
            <div className='bg-white p-4 w-full max-w-md rounded-md'>
              <div className='flex items-center justify-between gap-4'>
                <h3 className='font-semibold'>Permanent Delete</h3>
                <button onClick={() => setOpenDelete(false)}>
                  <IoClose size={25} />
                </button>
              </div>
              <p className='my-2'>Are you sure want to delete permanent ?</p>
              <div className='flex justify-end gap-5 py-4'>
                <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200'>Cancel</button>
                <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200'>Delete</button>
              </div>
            </div>
          </section>
        )
      }
    </div>
  )
}

export default ProductCardAdmin
