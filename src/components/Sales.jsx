import { useEffect, useState } from 'react';
import { baseURL } from '../App';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler 
} from 'chart.js';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiCalendar, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  Filler
);

function Sales() {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('year'); // 'year', 'month', 'day'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Fetch payments data
  async function getData() {
    setLoading(true);
    try {
      // Fetch payments
      let response = await fetch(`${baseURL}/api/order/all-orders`);
      if (response.ok) {
        response = await response.json();
        if (response.success) {
          setPayments(response.data);
        }
      }

      // Fetch all users
      let usersResponse = await fetch(`${baseURL}/api/user/all-users`);
      if (usersResponse.ok) {
        usersResponse = await usersResponse.json();
        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch sales data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // Filter payments based on payment status (only PAID) and merge with user data
  const paidPayments = payments.filter(payment => payment.payment_status === 'PAID').map(payment => {
    // Find user details from users array
    const userDetails = users.find(user => user._id === payment.userId);
    
    return {
      ...payment,
      user_details: userDetails || payment.user_details || null
    };
  });

  // Get available years from payments
  const availableYears = [...new Set(paidPayments.map(payment => 
    new Date(payment.createdAt).getFullYear()
  ))].sort((a, b) => b - a);

  // Calculate analytics data
  const getAnalytics = () => {
    const totalRevenue = paidPayments.reduce((sum, payment) => sum + payment.totalAmt, 0);
    const totalOrders = paidPayments.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = payments.filter(payment => payment.payment_status === 'PENDING').length;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders
    };
  };

  // Get chart data based on filter type
  const getChartData = () => {
    if (filterType === 'year') {
      return getYearlyData();
    } else if (filterType === 'month') {
      return getMonthlyData(selectedYear);
    } else {
      return getDailyData(selectedYear, selectedMonth);
    }
  };

  // Yearly data (by month)
  const getYearlyData = () => {
    const monthlyData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    monthNames.forEach((month) => {
      monthlyData[month] = { revenue: 0, orders: 0 };
    });

    paidPayments
      .filter(payment => new Date(payment.createdAt).getFullYear() === selectedYear)
      .forEach(payment => {
        const month = monthNames[new Date(payment.createdAt).getMonth()];
        monthlyData[month].revenue += payment.totalAmt;
        monthlyData[month].orders += 1;
      });

    return {
      labels: monthNames,
      revenue: monthNames.map(month => monthlyData[month].revenue),
      orders: monthNames.map(month => monthlyData[month].orders)
    };
  };

  // Monthly data (by day)
  const getMonthlyData = (year) => {
    const dailyData = {};
    const daysInMonth = new Date(year, selectedMonth, 0).getDate();
    
    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { revenue: 0, orders: 0 };
    }

    paidPayments
      .filter(payment => {
        const date = new Date(payment.createdAt);
        return date.getFullYear() === year && date.getMonth() + 1 === selectedMonth;
      })
      .forEach(payment => {
        const day = new Date(payment.createdAt).getDate();
        dailyData[day].revenue += payment.totalAmt;
        dailyData[day].orders += 1;
      });

    const labels = Object.keys(dailyData);
    return {
      labels,
      revenue: labels.map(day => dailyData[day].revenue),
      orders: labels.map(day => dailyData[day].orders)
    };
  };

  // Daily data (by hour)
  const getDailyData = (year, month) => {
    const hourlyData = {};
    
    // Initialize all hours with 0
    for (let hour = 0; hour < 24; hour++) {
      hourlyData[hour] = { revenue: 0, orders: 0 };
    }

    paidPayments
      .filter(payment => {
        const date = new Date(payment.createdAt);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      })
      .forEach(payment => {
        const hour = new Date(payment.createdAt).getHours();
        hourlyData[hour].revenue += payment.totalAmt;
        hourlyData[hour].orders += 1;
      });

    const labels = Object.keys(hourlyData).map(hour => `${hour}:00`);
    return {
      labels,
      revenue: Object.values(hourlyData).map(data => data.revenue),
      orders: Object.values(hourlyData).map(data => data.orders)
    };
  };

  // CSV Download functionality
  const downloadCSV = () => {
    const headers = ['Date', 'Product Name', 'User Name', 'User Email', 'Amount', 'Status', 'Payment ID'];
    const csvData = paidPayments.map(payment => [
      new Date(payment.createdAt).toLocaleDateString('en-IN'),
      payment.product_details?.name || 'N/A',
      payment.user_details?.name || `User ${payment.userId.substring(0, 8)}`,
      payment.user_details?.email || 'N/A',
      payment.totalAmt,
      payment.payment_status,
      payment.paymentId
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
    link.setAttribute('download', `sales_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Sales CSV downloaded successfully!');
  };

  // Get top products by revenue and orders
  const getTopProducts = () => {
    const productStats = {};
    
    paidPayments.forEach(payment => {
      const productId = payment.product_details?._id || payment.productId;
      const productName = payment.product_details?.name || 'Unknown Product';
      
      if (!productStats[productId]) {
        productStats[productId] = {
          name: productName,
          revenue: 0,
          orders: 0
        };
      }
      
      productStats[productId].revenue += payment.totalAmt;
      productStats[productId].orders += 1;
    });
    
    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Get top customers by revenue
  const getTopCustomers = () => {
    const customerStats = {};
    
    paidPayments.forEach(payment => {
      const userId = payment.userId;
      // Use merged user_details which should have the correct email from users array
      const userName = payment.user_details?.name || `User ${payment.userId.substring(0, 8)}`;
      const userEmail = payment.user_details?.email || null;
      
      if (!customerStats[userId]) {
        customerStats[userId] = {
          userId: userId,
          name: userName,
          email: userEmail,
          revenue: 0,
          orders: 0
        };
      }
      
      customerStats[userId].revenue += payment.totalAmt;
      customerStats[userId].orders += 1;
    });
    
    return Object.values(customerStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Get hourly revenue data
  const getHourlyRevenue = () => {
    const hourlyData = Array(24).fill(0);
    
    paidPayments.forEach(payment => {
      const hour = new Date(payment.createdAt).getHours();
      hourlyData[hour] += payment.totalAmt;
    });
    
    return hourlyData;
  };

  // Get growth metrics
  const getGrowthMetrics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Current month data
    const currentMonthPayments = paidPayments.filter(payment => {
      const date = new Date(payment.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // Previous month data
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthPayments = paidPayments.filter(payment => {
      const date = new Date(payment.createdAt);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });
    
    const currentRevenue = currentMonthPayments.reduce((sum, p) => sum + p.totalAmt, 0);
    const prevRevenue = prevMonthPayments.reduce((sum, p) => sum + p.totalAmt, 0);
    
    const currentOrders = currentMonthPayments.length;
    const prevOrders = prevMonthPayments.length;
    
    const currentCustomers = [...new Set(currentMonthPayments.map(p => p.userId))].length;
    const prevCustomers = [...new Set(prevMonthPayments.map(p => p.userId))].length;
    
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue * 100) : 0;
    const orderGrowth = prevOrders > 0 ? ((currentOrders - prevOrders) / prevOrders * 100) : 0;
    const customerGrowth = prevCustomers > 0 ? ((currentCustomers - prevCustomers) / prevCustomers * 100) : 0;
    const conversionRate = (analytics.totalOrders / (analytics.totalOrders + analytics.pendingOrders) * 100);
    
    return {
      revenueGrowth: revenueGrowth.toFixed(1),
      orderGrowth: orderGrowth.toFixed(1),
      customerGrowth: customerGrowth.toFixed(1),
      conversionRate: conversionRate.toFixed(1)
    };
  };

  // Get unique customers count
  const getUniqueCustomers = () => {
    return [...new Set(paidPayments.map(payment => payment.userId))].length;
  };

  // Get unique products count
  const getUniqueProducts = () => {
    return [...new Set(paidPayments.map(payment => 
      payment.product_details?._id || payment.productId
    ))].length;
  };

  const analytics = getAnalytics();
  const chartData = getChartData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-bold text-gray-800">Sales Analytics</h4>
            
            <div className="flex items-center gap-4">
              {/* CSV Download Button */}
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                title="Download sales data as CSV"
              >
                <FiDownload className="text-sm" />
                <span className="text-sm font-medium">Download CSV</span>
              </button>

              {/* Filter Controls */}
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="year">Yearly View</option>
                  <option value="month">Monthly View</option>
                  <option value="day">Daily View</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                {(filterType === 'month' || filterType === 'day') && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-800">₹{analytics.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <FiDollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-100 rounded-full">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-800">{analytics.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <FiShoppingCart className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-100 rounded-full">
                    <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-800">₹{analytics.avgOrderValue.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-100 rounded-full">
                    <div className="h-1 bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-800">{analytics.pendingOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                      <FiTrendingDown className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-100 rounded-full">
                    <div className="h-1 bg-yellow-500 rounded-full" style={{ width: `${(analytics.pendingOrders/(analytics.totalOrders + analytics.pendingOrders))*100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">
                    Revenue Trend ({filterType === 'year' ? 'Monthly' : filterType === 'month' ? 'Daily' : 'Hourly'})
                  </h5>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: chartData.labels,
                        datasets: [{
                          label: 'Revenue (₹)',
                          data: chartData.revenue,
                          borderColor: 'rgb(16, 185, 129)',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderWidth: 2,
                          fill: true,
                          tension: 0.3
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: {
                            callbacks: {
                              label: (context) => `Revenue: ₹${context.raw.toLocaleString()}`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => '₹' + value.toLocaleString()
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">
                    Orders Count ({filterType === 'year' ? 'Monthly' : filterType === 'month' ? 'Daily' : 'Hourly'})
                  </h5>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: chartData.labels,
                        datasets: [{
                          label: 'Orders',
                          data: chartData.orders,
                          backgroundColor: 'rgba(59, 130, 246, 0.6)',
                          borderColor: 'rgb(59, 130, 246)',
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: {
                            callbacks: {
                              label: (context) => `Orders: ${context.raw}`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Status Distribution */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">Payment Status Distribution</h5>
                  <div className="h-64">
                    <Doughnut
                      data={{
                        labels: ['Paid', 'Pending'],
                        datasets: [{
                          data: [analytics.totalOrders, analytics.pendingOrders],
                          backgroundColor: ['#10B981', '#F59E0B'],
                          borderWidth: 2,
                          borderColor: '#fff'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.label}: ${context.raw} orders`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">Quick Statistics</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {((analytics.totalOrders / (analytics.totalOrders + analytics.pendingOrders)) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{(analytics.totalRevenue / (chartData.labels.length || 1)).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Avg per Period</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.max(...chartData.revenue)}
                      </p>
                      <p className="text-sm text-gray-600">Peak Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.max(...chartData.orders)}
                      </p>
                      <p className="text-sm text-gray-600">Peak Orders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products Performance */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">Top Products by Revenue</h5>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: getTopProducts().map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
                        datasets: [{
                          label: 'Revenue (₹)',
                          data: getTopProducts().map(p => p.revenue),
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 205, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)'
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 205, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                          ],
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) => `Revenue: ₹${context.raw.toLocaleString()}`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => '₹' + value.toLocaleString()
                            }
                          },
                          x: {
                            ticks: {
                              maxRotation: 45
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">Top Products by Orders</h5>
                  <div className="h-80">
                    <Doughnut
                      data={{
                        labels: getTopProducts().map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
                        datasets: [{
                          data: getTopProducts().map(p => p.orders),
                          backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                          ],
                          borderWidth: 2,
                          borderColor: '#fff'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { 
                            position: 'right',
                            labels: {
                              boxWidth: 12,
                              padding: 10
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.label}: ${context.raw} orders`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Customer Insights */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">Revenue by Hour</h5>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                        datasets: [{
                          label: 'Revenue (₹)',
                          data: getHourlyRevenue(),
                          borderColor: 'rgb(139, 69, 19)',
                          backgroundColor: 'rgba(139, 69, 19, 0.1)',
                          borderWidth: 2,
                          fill: true,
                          tension: 0.4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: {
                            callbacks: {
                              label: (context) => `Revenue: ₹${context.raw.toLocaleString()}`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => '₹' + value.toLocaleString()
                            }
                          },
                          x: {
                            ticks: {
                              maxRotation: 45
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-lg font-semibold text-gray-700 mb-4">Growth Metrics</h5>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Revenue Growth</p>
                          <p className="text-xl font-bold text-green-700">+{getGrowthMetrics().revenueGrowth}%</p>
                        </div>
                        <FiTrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Order Growth</p>
                          <p className="text-xl font-bold text-blue-700">+{getGrowthMetrics().orderGrowth}%</p>
                        </div>
                        <FiShoppingCart className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Customer Growth</p>
                          <p className="text-xl font-bold text-purple-700">+{getGrowthMetrics().customerGrowth}%</p>
                        </div>
                        <FiTrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p className="text-xl font-bold text-orange-700">{getGrowthMetrics().conversionRate}%</p>
                        </div>
                        <FiDollarSign className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Overview */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Sales Performance Overview</h5>
                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                    <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiTrendingUp className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-700">₹{(analytics.totalRevenue / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{analytics.totalOrders}</p>
                    <p className="text-xs text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiDollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-700">₹{analytics.avgOrderValue.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Avg Order Value</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiTrendingDown className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{analytics.pendingOrders}</p>
                    <p className="text-xs text-gray-600">Pending Orders</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiCalendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-700">{getUniqueCustomers()}</p>
                    <p className="text-xs text-gray-600">Unique Customers</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiTrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-indigo-700">{getUniqueProducts()}</p>
                    <p className="text-xs text-gray-600">Products Sold</p>
                  </div>
                </div>
              </div>

              {/* Top Customers Section - Horizontal Layout */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h5 className="text-xl font-bold text-gray-800">🏆 Top Customers by Revenue</h5>
                  <div className="text-sm text-gray-500">
                    Based on total purchase amount
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {getTopCustomers().map((customer, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-3">
                        {/* Rank Badge */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                          index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                          'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Customer Info */}
                        <div className="w-full">
                          <h6 className="font-bold text-gray-800 text-sm truncate mb-2" title={customer.name}>
                            {customer.name}
                          </h6>
                          
                          {/* Email Display */}
                          {customer.email ? (
                            <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full border mb-2 truncate" title={customer.email}>
                              {customer.email.includes('@gmail.com') ? customer.email.replace('@gmail.com', '') : 
                               customer.email.includes('@') ? customer.email.split('@')[0] : customer.email}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full border mb-2">
                              No Email
                            </div>
                          )}
                          
                          {/* User ID Display */}
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border mb-2 font-mono truncate" title={customer.userId}>
                            ID: {customer.userId.substring(0, 8)}...
                          </div>
                          
                          {/* Verification Badge */}
                          {customer.email && (
                            <span className="inline-block text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        
                        {/* Revenue */}
                        <div className="w-full bg-white p-3 rounded-lg border">
                          <p className="text-lg font-bold text-green-600">₹{customer.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Total Revenue</p>
                        </div>
                        
                        {/* Stats */}
                        <div className="w-full grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded-lg border text-center">
                            <p className="text-sm font-bold text-blue-600">{customer.orders}</p>
                            <p className="text-xs text-gray-500">Orders</p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border text-center">
                            <p className="text-sm font-bold text-purple-600">₹{(customer.revenue / customer.orders).toFixed(0)}</p>
                            <p className="text-xs text-gray-500">Avg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sales;

