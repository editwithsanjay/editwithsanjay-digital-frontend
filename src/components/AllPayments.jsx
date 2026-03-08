import { useEffect, useState } from 'react'
import { baseURL } from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { FiCopy, FiTrendingUp, FiTrendingDown, FiDollarSign, FiFilter, FiColumns, FiCheck } from 'react-icons/fi'

function AllPayments() {

    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState('ALL')
    const [showColumnToggle, setShowColumnToggle] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState({
        srNo: true,
        product: true,
        productLink: true,
        image: true,
        driveLink: true,
        userName: true,
        userId: false,
        dateTime: true,
        status: true,
        paymentId: true,
        orderId: false,
        uniqueId: false,
        amount: false,
        actions: true
    })
    const itemsPerPage = 50

    async function getData() {
        try {
            // Fetch payments
            let data = await fetch(`${baseURL}/api/order/all-orders`)
            data = await data.json()
            console.log('Payments data:', data)

            // Fetch all users
            let usersData = await fetch(`${baseURL}/api/user/all-users`)
            usersData = await usersData.json()
            console.log('Users data:', usersData)

            if (data.success && usersData.success) {
                // Create a map of users by their ID for quick lookup
                const usersMap = {}
                usersData.data.forEach(user => {
                    usersMap[user._id] = user
                })

                // Merge user details with payment data
                const paymentsWithUserDetails = data.data.map(payment => ({
                    ...payment,
                    user_details: usersMap[payment.userId] || null
                }))

                console.log('Sample payment data:', paymentsWithUserDetails[0]); // Debug log
                setPayments(paymentsWithUserDetails)
            } else {
                console.error('Failed to fetch data:', { payments: data, users: usersData })
                setPayments(data.success ? data.data : [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load data!')
        }
    }

    async function deletePayment(paymentId) {
        let data = await fetch(`${baseURL}/api/order/deletePayment`, {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: paymentId })
        })
        data = await data.json()

        console.log(data)
        if (data.success) {
            toast.success("deleted cnt = ")
        }
        else {
            toast.error('deletion failed !')
        }
    }

    async function grantAccess(orderId) {
        let conformId = prompt("enter Unique ID : ")
        if (conformId == orderId) {
            let data = await fetch(`${baseURL}/api/order/grantAccess`, {
                method: 'post',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderId })
            })
            data = await data.json()

            console.log(data)
            if (data.success) {
                toast.success("Access Granted")
            }
            else {
                toast.error('Action failed !')
            }
        }
        else {
            toast.error("Access grant Failed !")
        }

    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        // Filter payments based on selected filter
        let filtered = payments;

        if (filter === 'PENDING') {
            filtered = payments.filter(payment => payment.payment_status === 'PENDING');
        } else if (filter === 'PAID') {
            filtered = payments.filter(payment => payment.payment_status === 'PAID');
        }

        setFilteredPayments(filtered);
        setCurrentPage(1); // Reset to first page when filter changes
    }, [payments, filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }))
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getProductUrl = (productId, productName) => {
        // Ensure productId exists and is valid
        if (!productId) {
            console.error('Product ID is missing:', { productId, productName });
            return '#';
        }

        // Generate product URL matching the format: /product/{name-slug}-{productId}
        const slug = productName?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'product'

        const url = `/product/${slug}-${productId}`;
        console.log('Generated product URL:', url, { productId, productName, slug });
        return url;
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    }

    const formatDateTime = (dateString) => {
        const utcDate = new Date(dateString);
        const istDate = utcDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        return istDate;
    }

    const getAnalytics = () => {
        const pendingPayments = payments.filter(payment => payment.payment_status === 'PENDING').length;
        const paidPayments = payments.filter(payment => payment.payment_status === 'PAID').length;
        const totalAmount = payments
            .filter(payment => payment.payment_status === 'PAID')
            .reduce((sum, payment) => sum + payment.totalAmt, 0);
        const totalProducts = payments.length;

        return {
            totalAmount,
            pendingPayments,
            paidPayments,
            totalProducts
        };
    }

    const analytics = getAnalytics();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-full">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-start gap-6 mb-6">
                        <h4 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Payment Management</h4>
                        <div className="flex items-center gap-3">
                            {/* Filter Select */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <FiFilter className="text-gray-400" />
                                <select
                                    className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer"
                                    value={filter}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                >
                                    <option value="ALL">All Payments</option>
                                    <option value="PAID">Paid</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>

                            {/* Column Toggle moved into header */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowColumnToggle(!showColumnToggle)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <FiColumns className="text-gray-500" />
                                    <span>Columns</span>
                                </button>

                                {showColumnToggle && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[100]">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 border-b border-gray-50 mb-1">Toggle Columns</div>
                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {Object.keys(visibleColumns).map((col) => (
                                                <button
                                                    key={col}
                                                    onClick={() => toggleColumn(col)}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                                                >
                                                    <span className="capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    {visibleColumns[col] && <FiCheck className="text-green-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Payments</p>
                                    <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                    <FiTrendingUp className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-gray-100 rounded-full">
                                <div className="h-1 bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pending Payments</p>
                                    <p className="text-2xl font-bold text-gray-800">{analytics.pendingPayments}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                    <FiTrendingDown className="w-6 h-6 text-red-500" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-gray-100 rounded-full">
                                <div className="h-1 bg-red-500 rounded-full" style={{ width: `${(analytics.pendingPayments / payments.length) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Success Payments</p>
                                    <p className="text-2xl font-bold text-gray-800">{analytics.paidPayments}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                    <FiTrendingUp className="w-6 h-6 text-green-500" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-gray-100 rounded-full">
                                <div className="h-1 bg-green-500 rounded-full" style={{ width: `${(analytics.paidPayments / payments.length) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount (Paid)</p>
                                    <p className="text-2xl font-bold text-gray-800">₹{analytics.totalAmount}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                                    <FiDollarSign className="w-6 h-6 text-purple-500" />
                                </div>
                            </div>
                            <div className="mt-2 h-1 bg-gray-100 rounded-full">
                                <div className="h-1 bg-purple-500 rounded-full" style={{ width: `${(analytics.paidPayments / payments.length) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} results
                            {filter !== 'ALL' && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {filter === 'PAID' ? 'Success Payments' : 'Pending Payments'}
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar pb-4 -mx-1 px-1">
                        <table className="w-full border-separate border-spacing-0 min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {visibleColumns.srNo && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-16 sticky left-0 bg-gray-50 z-10 border-b">Sr.no</th>}
                                    {visibleColumns.product && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-48 border-b">Product</th>}
                                    {visibleColumns.productLink && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-32 border-b">Product Link</th>}
                                    {visibleColumns.image && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-20 border-b">Image</th>}
                                    {visibleColumns.driveLink && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-24 border-b">Drive Link</th>}
                                    {visibleColumns.userName && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-32 border-b">User Name</th>}
                                    {visibleColumns.userId && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-32 border-b">User ID</th>}
                                    {visibleColumns.dateTime && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-44 border-b">Date & Time</th>}
                                    {visibleColumns.status && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-24 border-b">Status</th>}
                                    {visibleColumns.paymentId && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-36 border-b">Payment ID</th>}
                                    {visibleColumns.orderId && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-36 border-b">Order ID</th>}
                                    {visibleColumns.uniqueId && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-36 border-b">Unique ID</th>}
                                    {visibleColumns.amount && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-24 border-b">Amount</th>}
                                    {visibleColumns.actions && <th className="py-4 px-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider w-32 border-b">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentPayments.map((payment, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150 group">
                                        {visibleColumns.srNo && <td className="py-4 px-4 text-xs font-black text-gray-400 sticky left-0 bg-white group-hover:bg-gray-50 z-10 border-b">{startIndex + idx + 1}</td>}
                                        {visibleColumns.product && (
                                            <td className="py-4 px-4 border-b">
                                                <div className="text-sm font-black text-gray-900 max-w-[180px] truncate" title={payment.product_details.name}>
                                                    {payment.product_details.name}
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.productLink && (
                                            <td className="py-4 px-4 border-b">
                                                <div className="flex items-center space-x-2">
                                                    <a
                                                        href={getProductUrl(payment.product_details._id || payment.product_details.id || payment.productId, payment.product_details.name)}
                                                        className="text-blue-600 hover:text-blue-800 text-[10px] font-black px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-widest"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Details
                                                    </a>
                                                    <button
                                                        onClick={() => copyToClipboard(getProductUrl(payment.product_details._id || payment.product_details.id || payment.productId, payment.product_details.name))}
                                                        className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-md"
                                                    >
                                                        <FiCopy className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.image && (
                                            <td className="py-4 px-4 border-b">
                                                <img
                                                    src={payment.product_details.image[0]}
                                                    alt="Product"
                                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                                                />
                                            </td>
                                        )}
                                        {visibleColumns.driveLink && (
                                            <td className="py-4 px-4 border-b">
                                                <a
                                                    href={payment.product_details.more_details.driveLink}
                                                    className="text-green-600 hover:text-green-800 text-[10px] font-black px-3 py-1 bg-green-50 rounded-lg hover:bg-green-100 transition-colors uppercase tracking-widest"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Drive
                                                </a>
                                            </td>
                                        )}
                                        {visibleColumns.userName && (
                                            <td className="py-4 px-4 border-b">
                                                <div className="space-y-0.5">
                                                    <div className="text-sm font-black text-gray-800 max-w-[120px] truncate" title={payment.user_details?.name || payment.userId}>
                                                        {payment.user_details?.name || payment.userId}
                                                    </div>
                                                    {payment.user_details?.email && (
                                                        <div className="text-[10px] font-bold text-gray-400 max-w-[120px] truncate" title={payment.user_details.email}>
                                                            {payment.user_details.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.userId && (
                                            <td className="py-4 px-4 border-b">
                                                <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded max-w-[120px] truncate block" title={payment.userId}>
                                                    {payment.userId}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.dateTime && (
                                            <td className="py-4 px-4 border-b text-[11px] font-bold text-gray-500 whitespace-nowrap">
                                                {formatDateTime(payment.createdAt)}
                                            </td>
                                        )}
                                        {visibleColumns.status && (
                                            <td className="py-4 px-4 border-b">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${payment.payment_status === 'PENDING'
                                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                                    : 'bg-green-50 text-green-600 border border-green-100'
                                                    }`}>
                                                    {payment.payment_status}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.paymentId && (
                                            <td className="py-4 px-4 border-b">
                                                <div className="flex items-center space-x-1.5">
                                                    <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded max-w-[100px] truncate block" title={payment.paymentId}>
                                                        {payment.paymentId}
                                                    </span>
                                                    <button onClick={() => copyToClipboard(payment.paymentId)} className="text-gray-400 hover:text-gray-600"><FiCopy size={12} /></button>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.orderId && (
                                            <td className="py-4 px-4 border-b text-[10px] font-mono font-bold text-gray-500">{payment.orderId}</td>
                                        )}
                                        {visibleColumns.uniqueId && (
                                            <td className="py-4 px-4 border-b text-[10px] font-mono font-bold text-gray-500">{payment._id}</td>
                                        )}
                                        {visibleColumns.amount && (
                                            <td className="py-4 px-4 border-b">
                                                <span className="text-sm font-black text-gray-900">₹{payment.totalAmt}</span>
                                            </td>
                                        )}
                                        {visibleColumns.actions && (
                                            <td className="py-4 px-4 border-b">
                                                {payment.payment_status === 'PENDING' ? (
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            className="px-3 py-1.5 text-[10px] font-black text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95"
                                                            onClick={(e) => { e.preventDefault(); grantAccess(payment._id) }}
                                                        >
                                                            Allow
                                                        </button>
                                                        <button
                                                            className="px-3 py-1.5 text-[10px] font-black text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95"
                                                            onClick={(e) => { e.preventDefault(); deletePayment(payment.paymentId) }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="px-3 py-1.5 text-[10px] font-black text-white bg-gray-900 rounded-lg hover:bg-red-600 transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-black/10">
                                                        Block
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {
                        totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        First
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                </div>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-2 text-sm border rounded-md ${currentPage === pageNum
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            height: 6px;
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: #f1f1f1;
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: #d1d5db;
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: #9ca3af;
                        }
                    `}</style>
                </div >
            </div >
        </div >
    )
}

export default AllPayments