import React, { useEffect, useState } from 'react'
import { baseURL } from '../App'
import toast from 'react-hot-toast';
import { IoSearchOutline } from 'react-icons/io5';
import { MdSettingsBackupRestore } from "react-icons/md";

function RecycleBinProduct() {
  const [products, setProducts] = useState([])

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('')

  async function getData() {
    try {
      let data = await fetch(`${baseURL}/api/product/get-trash-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: page,
          search: search
        })
      })
      data = await data.json()

      setProducts(data.data)
    } catch (err) {
      toast.error("failed to load recycle bin")
    }
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    <div>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Recycle Bin</h2>

        <div className="ml-auto bg-blue-50 px-4 py-2 rounded flex items-center gap-3">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder="Search product here..."
            className="h-full w-full bg-transparent outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {
            products.map(product => <Card product={product} />)
          }
        </div>

        <div className="flex justify-between my-4">
          <button onClick={() => setPage(page === 0 ? 0 : page - 1)} className="border px-4 py-1 hover:bg-gray-200">
            Previous
          </button>

          <button onClick={() => setPage(page + 1)} className="border px-4 py-1 hover:bg-gray-200">
            Next
          </button>

        </div>
      </div>

    </div>
  )
}

export default RecycleBinProduct;


function Card({ product }) {
  async function recoverProduct() {
    try {
      let data = await fetch(`${baseURL}/api/product/recover-product`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: product._id })
      })
      data = await data.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }
  return <div className='w-46 p-2 bg-white rounded'>
    <div>
      <img
        src={product?.image[0]}
        alt={product?.name}
        className='w-full h-full object-scale-down'
      />
    </div>
    <p className='text-ellipsis line-clamp-2 font-medium'>{product?.name}</p>
    <p className='text-slate-400'>{product?.unit}</p>
    <div className='flex items-center justify-center py-2 mt-auto border-t border-gray-100 mt-2'>
      <button
        onClick={() => recoverProduct()}
        className='w-full flex justify-center items-center py-2 text-green-600 bg-green-50 hover:bg-green-100 transition-colors uppercase text-[10px] font-black tracking-widest gap-2 rounded-b'
        title="Recover Product"
      >
        <MdSettingsBackupRestore size={16} /> Recover
      </button>
    </div>

  </div>
}