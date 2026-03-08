import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function FreeDownloadButton({ data }) {

    const user = useSelector(state => state.user)
    const navigate = useNavigate();

    // console.log(user)
    if (!user.email) {
        return <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success("Login to get for FREE!");
                navigate("/register")
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium p-1 rounded shadow-sm transition duration-200 ease-in-out"
        >
            Login to Download for FREE
        </button>
    }
    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                window.open(data.more_details.driveLink)
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-[10px] lg:text-xs font-bold px-3 py-1.5 rounded-md shadow-sm transition-colors"
        >
            DOWNLOAD NOW
        </button>
    )
}

export default FreeDownloadButton