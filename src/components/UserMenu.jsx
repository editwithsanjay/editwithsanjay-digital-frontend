import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
import { MdAccountCircle } from 'react-icons/md'
import { BiCategory, BiSolidCategory } from 'react-icons/bi'
import { CgDanger, CgLogOut } from 'react-icons/cg'
import { SiGoogleanalytics } from 'react-icons/si'
import { FaBox, FaCloudUploadAlt, FaRupeeSign, FaShoppingCart, FaUsers, FaChartBar } from 'react-icons/fa'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { GiCash } from 'react-icons/gi'
import { RiDeleteBin6Line } from 'react-icons/ri'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      console.log("logout", response)
      if (response.data.success) {
        if (close) {
          close()
        }
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }
  return (
    <div>
      <div className='font-semibold'>My Account</div>
      <div className='text-sm flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : ""}</span></span>
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className='text-sm grid gap-1'>

        <Link onClick={handleClose} to={"/dashboard/profile"} className='px-2 hover:bg-orange-200 py-1'>
          <div style={{ display: "flex" }}>
            <MdAccountCircle size={20} />
            <label style={{ margin: "3px" }}>Profile</label>
          </div>
        </Link>
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <BiSolidCategory size={20} />
                <label style={{ margin: "3px" }}>Category</label>
              </div>
            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <BiCategory size={20} />
                <label style={{ margin: "3px" }}>Sub Category</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <FaCloudUploadAlt size={20} />
                <label style={{ margin: "3px" }}>Upload Product</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <FaBox size={20} />
                <label style={{ margin: "3px" }}>Product</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/recycle-bin"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <RiDeleteBin6Line size={20} />
                <label style={{ margin: "3px" }}>Recycle Bin</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/banners"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <BiSolidCategory size={20} />
                <label style={{ margin: "3px" }}>Banners</label>
              </div>
            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/deals"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <FaIndianRupeeSign size={20} />
                <label style={{ margin: "3px" }}>Deals</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/payments"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <FaIndianRupeeSign size={20} />
                <label style={{ margin: "3px" }}>Payments</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/sales"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <GiCash size={20} />
                <label style={{ margin: "3px" }}>Sales</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/all-users"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <FaUsers size={20} />
                <label style={{ margin: "3px" }}>All Users</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/metrics"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <SiGoogleanalytics size={20} />
                <label style={{ margin: "3px" }}>Metrics</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/product-analysis"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <FaChartBar size={20} />
                <label style={{ margin: "3px" }}>Product Analysis</label>
              </div>

            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/tickets"} className='px-2 hover:bg-orange-200 py-1'>
              <div style={{ display: "flex" }}>
                <CgDanger size={20} />
                <label style={{ margin: "3px" }}>Tickets</label>
              </div>

            </Link>
          )
        }

        <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200 py-1'>
          <div style={{ display: "flex" }}>
            <FaShoppingCart size={20} />
            <label style={{ margin: "3px" }}>My Orders</label>
          </div>
        </Link>

        {/* <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link> */}

        <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>
          <div style={{ display: "flex" }}>
            <CgLogOut size={20} />
            <label style={{ margin: "3px" }}>Log Out</label>
          </div>
        </button>

      </div>
    </div>
  )
}

export default UserMenu
