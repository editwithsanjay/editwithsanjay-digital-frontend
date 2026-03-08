import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import uploadToCloudinary from '../utils/Cloudinary';

const UploadBannerModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        imageUrl: "",
        mobileImageUrl: "",
        link: ""
    })
    const [loading, setLoading] = useState(false)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!data.imageUrl || !data.mobileImageUrl) {
            toast.error("Both PC and Mobile images are required")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addBanner,
                data: data
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadImage = async (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            toast.loading("Uploading image...", { id: "upload" })
            const response = await uploadToCloudinary(file)
            toast.success("Uploaded", { id: "upload" })

            setData((preve) => {
                return {
                    ...preve,
                    [type]: response
                }
            })
        } catch (error) {
            toast.error("Upload failed", { id: "upload" })
        }
    }

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center z-50'>
            <div className='bg-white max-w-4xl w-full p-4 rounded max-h-[90vh] overflow-y-auto'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>Add Banner</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-3' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label>Redirect Link (Optional)</label>
                        <input
                            type='text'
                            placeholder='Enter redirect URL'
                            value={data.link}
                            name='link'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='grid gap-1'>
                            <p className='font-medium'>PC Banner Image</p>
                            <div className='border bg-blue-50 h-40 w-full flex items-center justify-center rounded overflow-hidden'>
                                {
                                    data.imageUrl ? (
                                        <img src={data.imageUrl} className='w-full h-full object-cover' alt='pc banner' />
                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>
                                    )
                                }
                            </div>
                            <label htmlFor='uploadPcImage' className='mt-2'>
                                <div className='px-4 py-2 rounded cursor-pointer border border-primary-200 hover:bg-primary-100 text-center font-medium'>
                                    Upload PC Image
                                </div>
                                <input onChange={(e) => handleUploadImage(e, 'imageUrl')} type='file' id='uploadPcImage' className='hidden' />
                            </label>
                        </div>

                        <div className='grid gap-1'>
                            <p className='font-medium'>Mobile Banner Image</p>
                            <div className='border bg-blue-50 h-40 w-full flex items-center justify-center rounded overflow-hidden'>
                                {
                                    data.mobileImageUrl ? (
                                        <img src={data.mobileImageUrl} className='w-full h-full object-cover' alt='mobile banner' />
                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>
                                    )
                                }
                            </div>
                            <label htmlFor='uploadMobileImage' className='mt-2'>
                                <div className='px-4 py-2 rounded cursor-pointer border border-primary-200 hover:bg-primary-100 text-center font-medium'>
                                    Upload Mobile Image
                                </div>
                                <input onChange={(e) => handleUploadImage(e, 'mobileImageUrl')} type='file' id='uploadMobileImage' className='hidden' />
                            </label>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className={`
                    ${data.imageUrl && data.mobileImageUrl ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300 cursor-not-allowed"}
                    py-2 rounded mt-4 font-semibold 
                    `}
                    >
                        {loading ? "Adding..." : "Add Banner"}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default UploadBannerModel
