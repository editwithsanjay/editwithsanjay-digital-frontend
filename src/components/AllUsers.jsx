import { useEffect, useState } from 'react'

import { baseURL } from '../App'
import toast from 'react-hot-toast'
import { Line } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { FaUsers, FaUserPlus, FaChartLine, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa'
import { MdOutlineCalendarMonth } from 'react-icons/md'
import { format } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function AllUsers() {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState('ALL')
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        todayNewUsers: 0,
        monthlyNewUsers: 0
    })
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    })
    const [selectedDate, setSelectedDate] = useState(new Date())
    const itemsPerPage = 50

    async function getData() {
        let data = await fetch(`${baseURL}/api/user/all-users`)
        data = await data.json()

        console.log(data)
        if (data.success) {
            setUsers(data.data)
            
            // Calculate metrics
            const totalUsers = data.data.length
            const today = new Date().toISOString().split('T')[0]
            const todayNewUsers = data.data.filter(user => 
                user.createdAt && user.createdAt.split('T')[0] === today
            ).length
            
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            const monthlyNewUsers = data.data.filter(user => 
                user.createdAt && new Date(user.createdAt) >= thirtyDaysAgo
            ).length
            
            setMetrics({
                totalUsers,
                todayNewUsers,
                monthlyNewUsers
            })
            
            // Prepare chart data (last 7 days)
            const last7Days = Array.from({length: 7}, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - i)
                return date.toISOString().split('T')[0]
            }).reverse()
            
            const userCountsByDay = last7Days.map(date => 
                data.data.filter(user => 
                    user.createdAt && user.createdAt.split('T')[0] === date
                ).length
            )
            
            setChartData({
                labels: last7Days.map(date => date.split('-')[2]), // Just show day
                datasets: [
                    {
                        label: 'New Users',
                        data: userCountsByDay,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        tension: 0.3
                    }
                ]
            })
        } else {
            toast.error("Failed to load Data!")
        }
    }

    useEffect(() => {
        getData()
    }, [])

    // Filter and sort users based on selected filter
    useEffect(() => {
        let filtered = [...users];
        
        if (filter === 'RECENT_CREATED') {
            filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filter === 'RECENT_LOGIN') {
            filtered = filtered.sort((a, b) => {
                const dateA = a.last_login_date ? new Date(a.last_login_date) : new Date(0);
                const dateB = b.last_login_date ? new Date(b.last_login_date) : new Date(0);
                return dateB - dateA;
            });
        }
        
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filter changes
    }, [users, filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Format date/time to IST 12-hour format
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Never';
        
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
    };

    // CSV Download functionality
    const downloadCSV = () => {
        const headers = ['Sr.No', 'Name', 'Email', 'Mobile', 'Last Login', 'Status', 'Role', 'Created On'];
        const csvData = users.map((user, index) => [
            index + 1,
            user.name || 'N/A',
            user.email || 'N/A',
            user.mobile || 'N/A',
            formatDateTime(user.last_login_date),
            user.status || 'N/A',
            user.role || 'N/A',
            formatDateTime(user.createdAt)
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(field => 
                typeof field === 'string' && field.includes(',') ? `"${field}"` : field
            ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `users_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('CSV file downloaded successfully!');
    };

    const handleDateChange = (direction) => {
        const newDate = new Date(selectedDate)
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setSelectedDate(newDate)
        // Here you would typically fetch data for the new month
        // For now we'll just update the UI
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800">User Management Dashboard</h4>
                
                <div className="flex items-center gap-4">
                    {/* CSV Download Button */}
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        title="Download all users data as CSV"
                    >
                        <FaDownload className="text-sm" />
                        <span className="text-sm font-medium">Download CSV</span>
                    </button>
                    
                    {/* Filter Section */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        <select
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                            <option value="ALL">All Users</option>
                            <option value="RECENT_CREATED">Recent Created</option>
                            <option value="RECENT_LOGIN">Recent Logged In</option>
                        </select>
                    </div>
                    
                    {/* Date Navigation */}
                    <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                        <button 
                            onClick={() => handleDateChange('prev')}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaChevronLeft className="text-gray-600" />
                        </button>
                        <div className="mx-4 text-left">
                             <div className="text-sm text-gray-500">Current Date</div>
                                <div className="font-semibold text-gray-800">
                                         {format(new Date(), 'MMMM d, yyyy')}
                                </div>
                            </div>
                  
                        <button 
                            onClick={() => handleDateChange('next')}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaChevronRight className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 mr-4">
                            <FaUsers className="text-blue-500 text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-800">{metrics.totalUsers}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 mr-4">
                            <FaUserPlus className="text-green-500 text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Today&apos;s New Users</p>
                            <h3 className="text-2xl font-bold text-gray-800">{metrics.todayNewUsers}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 mr-4">
                            <MdOutlineCalendarMonth className="text-purple-500 text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Monthly New Users</p>
                            <h3 className="text-2xl font-bold text-gray-800">{metrics.monthlyNewUsers}</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FaChartLine className="text-indigo-500 text-xl mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">User Growth (Last 7 Days)</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                        {format(selectedDate, 'MMMM yyyy')}
                    </div>
                </div>
                <div className="h-64">
                    <Line 
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
            
            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                        </span>
                        {filter !== 'ALL' && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {filter === 'RECENT_CREATED' ? 'Recent Created' : 'Recent Logged In'}
                            </span>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                                <th className="py-4 px-4 text-left">Sr.no</th>
                                <th className="py-4 px-4 text-left">Name</th>
                                <th className="py-4 px-4 text-left">Email</th>
                                {/* Avatar column hidden */}
                                <th className="py-4 px-4 text-left">Mobile</th>
                                <th className="py-4 px-4 text-left">Last Login</th>
                                <th className="py-4 px-4 text-left">Status</th>
                                <th className="py-4 px-4 text-left">Role</th>
                                <th className="py-4 px-4 text-left">Created On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user, idx) => (
                                <tr className="hover:bg-gray-50 transition-colors" key={idx}>
                                    <td className="py-4 px-4 text-sm text-gray-700">{startIndex + idx + 1}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">{user.name}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{user.email}</td>
                                    {/* Avatar column hidden */}
                                    <td className="py-4 px-4 text-sm text-gray-700">{user.mobile || 'N/A'}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{formatDateTime(user.last_login_date)}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.status === 'active' ? 'bg-green-100 text-green-800' : 
                                            user.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{user.role}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{formatDateTime(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
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
                                            className={`px-3 py-2 text-sm border rounded-md ${
                                                currentPage === pageNum
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
                        
                        <div className="mt-2 text-center text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllUsers
