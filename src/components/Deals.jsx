import React, { useEffect, useState } from 'react'
import { baseURL } from '../App'
import toast from 'react-hot-toast';
import { IoSearchOutline } from 'react-icons/io5';

function Deals() {
    const [products , setProducts] = useState([])

    const [page, setPage] = useState(0);
    const [search , setSearch] = useState('')
    const [totalPages , setTotalPages] = useState()
    const [totalCount , setTotalCount] = useState()

    async function getData(){
        try{
            let data = await fetch(`${baseURL}/api/product/get-deals` , {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    page:page,
                    search:search
                })
            })
            data = await data.json()

            setProducts(data.data)
            setTotalPages(data.totalNoPage);
            setTotalCount(data.totalCount)
        }catch(err){
            toast.error("failed to load recycle bin")
        }
    }

    useEffect(()=>{
        getData()
    }, [ ] )
  return (
    <div>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Deals ({ totalCount })</h2>

        <div className="ml-auto bg-blue-50 px-4 py-2 rounded flex items-center gap-3">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder="Search product here..."
            className="h-full w-full bg-transparent outline-none"
            value={search}
            onChange={ e => setSearch(e.target.value) }
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          
          {
            products.map( product => <Card product={product}/>)
          }
        </div>

        <div className="flex justify-between my-4">
            <button onClick={() => setPage(page === 0 ? 0 : page - 1)} className="border px-4 py-1 hover:bg-gray-200">
            Previous
            </button>

            <label> { totalPages } </label>

            <button onClick={() => setPage(page + 1)} className="border px-4 py-1 hover:bg-gray-200">
            Next
            </button>

        </div>
      </div>

    </div>
  )
}

export default Deals;


function Card( {product} )
{
    async function removeDeal()
    {
        try{
            let data = await fetch(`${baseURL}/api/product/remove-from-deals` , {
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify( { _id:product._id } )
            })
            data = await data.json()
            if(data.success){
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        }catch(err){
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
                <div className='grid grid-cols-2 gap-3 py-2'>
                <button onClick={()=> removeDeal()  } className='border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded'>Remove Deal</button>
                </div>
                
            </div>
}