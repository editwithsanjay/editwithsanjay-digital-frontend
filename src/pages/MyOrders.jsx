import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaDownload, FaRegCalendarAlt, FaSortAmountDown, FaSortAmountUp, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const [filter, setFilter] = useState('newest') // newest, oldest, priceHigh, priceLow

  const sortedOrders = useMemo(() => {
    let result = [...orders]
    if (filter === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (filter === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (filter === 'priceHigh') {
      result.sort((a, b) => b.totalAmt - a.totalAmt)
    } else if (filter === 'priceLow') {
      result.sort((a, b) => a.totalAmt - b.totalAmt)
    }
    return result
  }, [orders, filter])

  const activeOrders = sortedOrders.filter(order => order.payment_status !== 'PENDING')
  const failedOrders = sortedOrders.filter(order => order.payment_status === 'PENDING')

  return (
    <div className='bg-gray-50/50 min-h-screen pb-10'>
      <div className='bg-white shadow-sm p-4 lg:p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2'>
            <FaCheckCircle className="text-green-600" /> My Purchases
          </h1>
          <p className='text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest'>Manage your digital assets and orders</p>
        </div>

        {/* Filters */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none'>
          <span className='text-[10px] font-black text-gray-400 uppercase tracking-wider mr-2'>Sort By:</span>
          <button
            onClick={() => setFilter('newest')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === 'newest' ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
          >
            Newest First
          </button>
          <button
            onClick={() => setFilter('oldest')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === 'oldest' ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
          >
            Oldest First
          </button>
          <button
            onClick={() => setFilter('priceHigh')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === 'priceHigh' ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
          >
            Price: High to Low
          </button>
          <button
            onClick={() => setFilter('priceLow')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === 'priceLow' ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
          >
            Price: Low to High
          </button>
        </div>
      </div>

      <div className='container mx-auto px-4 lg:px-6'>
        {!orders[0] ? (
          <NoData />
        ) : (
          <div className='flex flex-col gap-8'>
            {/* Active Products Section */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <h3 className='text-lg font-black text-gray-800 tracking-tight uppercase'>Active Products</h3>
                <span className='bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full'>{activeOrders.length}</span>
              </div>

              <div className='grid gap-4'>
                {activeOrders.map((order, index) => (
                  <div
                    key={order._id + index + "order"}
                    className="group bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className='flex flex-col lg:flex-row gap-5'>
                      {/* Product Image */}
                      <div className='relative flex-shrink-0'>
                        <img
                          src={order.product_details.image[0]}
                          className="w-full lg:w-48 aspect-video lg:h-28 rounded-xl object-cover shadow-sm bg-gray-50"
                          alt={order.product_details.name}
                        />
                        <div className='absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm'>
                          Success
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className='flex-1 flex flex-col justify-between'>
                        <div>
                          <p className='text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5'>
                            <FaRegCalendarAlt size={10} /> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <h2 className='font-black text-gray-900 text-lg leading-tight mb-2 group-hover:text-green-600 transition-colors'>{order.product_details.name}</h2>

                          <div className='flex items-center gap-4 text-xs font-bold text-gray-500'>
                            <p>Payment ID: <span className='text-gray-900'>{order?.paymentId || 'N/A'}</span></p>
                            <p>Price: <span className='text-green-600'>{DisplayPriceInRupees(order.totalAmt)}</span></p>
                          </div>
                        </div>

                        <div className='mt-4 flex items-center justify-between'>
                          <button
                            onClick={() => window.open(order.product_details.more_details.driveLink)}
                            className="bg-black hover:bg-green-600 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-black/5 hover:shadow-green-500/20 transition-all duration-300 transform active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                          >
                            <FaDownload size={12} /> Download Asset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {activeOrders.length === 0 && <p className='text-sm text-gray-400 italic bg-white p-4 rounded-xl border border-dashed border-gray-200 text-center'>No active products found.</p>}
              </div>
            </section>

            {/* Failed Products Section */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <h3 className='text-lg font-black text-gray-800 tracking-tight uppercase'>Failed Payments</h3>
                <span className='bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full'>{failedOrders.length}</span>
              </div>

              <div className='grid gap-4'>
                {failedOrders.map((order, index) => (
                  <div
                    key={order._id + index + "order"}
                    className="bg-white rounded-2xl border border-red-50 p-4 lg:p-5 shadow-sm opacity-80 border-l-4 border-l-red-500"
                  >
                    <div className='flex flex-col lg:flex-row gap-5'>
                      {/* Product Image */}
                      <div className='relative flex-shrink-0 grayscale opacity-60'>
                        <img
                          src={order.product_details.image[0]}
                          className="w-full lg:w-48 aspect-video lg:h-28 rounded-xl object-cover bg-gray-50"
                          alt={order.product_details.name}
                        />
                        <div className='absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm'>
                          Failed
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className='flex-1 flex flex-col justify-between'>
                        <div>
                          <p className='text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5'>
                            <FaExclamationCircle size={10} className='text-red-500' /> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <h2 className='font-black text-gray-500 text-lg leading-tight mb-2'>{order.product_details.name}</h2>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-[11px] font-bold text-gray-400'>
                            <p>Payment ID: <span className='text-gray-600'>{order?.paymentId || 'Failed/Incomplete'}</span></p>
                            <p>Amount: <span className='text-gray-600'>{DisplayPriceInRupees(order.totalAmt)}</span></p>
                            <p>Order ID: <span className='text-gray-600'>{order._id}</span></p>
                          </div>
                        </div>

                        <div className='mt-4'>
                          <p className='text-[10px] font-black text-red-500 uppercase tracking-widest'>Payment was not completed. Please try again.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {failedOrders.length === 0 && <p className='text-sm text-gray-400 italic bg-white p-4 rounded-xl border border-dashed border-gray-200 text-center'>No failed payments found.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
