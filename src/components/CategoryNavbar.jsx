import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { FaChevronDown } from "react-icons/fa";

const CategoryNavbar = () => {
    const allCategory = useSelector(state => state.product.allCategory)
    const allSubCategory = useSelector(state => state.product.allSubCategory)

    return (
        <nav className='hidden lg:flex items-center justify-center bg-white px-4 border-b gap-8 z-30 relative'>
            {
                allCategory.map((cat) => {
                    const subCategories = allSubCategory.filter(sub =>
                        sub.category.some(c => (c._id || c) === cat._id)
                    )

                    return (
                        <div key={cat._id} className='relative group'>
                            <Link
                                to={`/${valideURLConvert(cat.name)}-${cat._id}`}
                                className='font-bold text-neutral-900 hover:text-green-600 transition-all py-4 flex items-center gap-1.5 cursor-pointer text-sm tracking-tight'
                            >
                                {cat.name}
                                {subCategories.length > 0 && (
                                    <FaChevronDown size={10} className="mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                )}
                            </Link>

                            {/* Dropdown with animation */}
                            <div className='absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50 transition-all duration-300 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto'>
                                <div className='bg-white shadow-2xl border border-neutral-100 rounded-2xl p-6 min-w-[240px]'>
                                    <h4 className='text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-4'>Sub Categories</h4>
                                    <div className='grid gap-1.5'>
                                        {
                                            subCategories.map(sub => (
                                                <Link
                                                    key={sub._id}
                                                    to={`/${valideURLConvert(cat.name)}-${cat._id}/${valideURLConvert(sub.name)}-${sub._id}`}
                                                    className='text-[14px] font-bold text-neutral-700 hover:text-green-600 hover:bg-green-50 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2'
                                                >
                                                    <span className='w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 transition-opacity bullet-point'></span>
                                                    {sub.name}
                                                </Link>
                                            ))
                                        }
                                        {subCategories.length === 0 && <p className='text-sm text-neutral-400 italic px-2'>No subcategories</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom border indicator on hover */}
                            <div className='absolute bottom-0 left-0 w-0 h-[3px] bg-green-600 transition-all duration-300 group-hover:w-full'></div>
                        </div>
                    )
                })
            }

            <style>{`
                .bullet-point {
                    transition: all 0.2s ease;
                }
                a:hover .bullet-point {
                    opacity: 1;
                }
            `}</style>
        </nav>
    )
}

export default CategoryNavbar
