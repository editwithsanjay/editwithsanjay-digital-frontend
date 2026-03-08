import React, { useEffect, useState } from 'react'
import UploadBannerModel from '../components/UploadBannerModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { MdDelete } from 'react-icons/md'

const BannerAdmin = () => {
    const [openUploadBanner, setOpenUploadBanner] = useState(false)
    const [loading, setLoading] = useState(false)
    const [bannerData, setBannerData] = useState([])
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteBanner, setDeleteBanner] = useState({ _id: "" })

    const fetchBanners = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getBanner
            })
            const { data: responseData } = response
            if (responseData.success) {
                setBannerData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBanners()
    }, [])

    const handleDeleteBanner = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteBanner,
                data: deleteBanner
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchBanners()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Banners</h2>
                <button onClick={() => setOpenUploadBanner(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Banner</button>
            </div>

            {loading && <Loading />}

            {!bannerData[0] && !loading && <NoData />}

            <div className='p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {bannerData.map((banner) => (
                    <div key={banner._id} className='bg-white rounded shadow-md overflow-hidden flex flex-col'>
                        <div className='h-32 bg-gray-100'>
                            <img src={banner.imageUrl} alt="banner" className='w-full h-full object-cover' />
                        </div>
                        <div className='p-2 flex-grow'>
                            <p className='text-xs text-gray-500 truncate'>PC: {banner.imageUrl}</p>
                            <p className='text-xs text-gray-500 truncate'>Mobile: {banner.mobileImageUrl}</p>
                            {banner.link && <p className='text-xs text-blue-500 truncate'>Link: {banner.link}</p>}
                        </div>
                        <div className='p-2 border-t flex'>
                            <button
                                onClick={() => {
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteBanner(banner)
                                }}
                                className='w-full bg-red-50 hover:bg-red-100 text-red-500 font-bold py-2 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-2 border border-red-100'
                                title="Delete"
                            >
                                <MdDelete size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {openUploadBanner && (
                <UploadBannerModel fetchData={fetchBanners} close={() => setOpenUploadBanner(false)} />
            )}

            {openConfimBoxDelete && (
                <CofirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteBanner}
                />
            )}
        </section>
    )
}

export default BannerAdmin
