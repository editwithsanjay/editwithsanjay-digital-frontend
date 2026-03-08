import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../common/SummaryApi';

const ProductMetrics = () => {
  const [cartData, setCartData] = useState([]);
  const [filteredCartData, setFilteredCartData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, PRODUCT_ID, PRODUCT_COUNT
  const [sortOrder, setSortOrder] = useState('DESC'); // DESC, ASC
  const [selectedProductId, setSelectedProductId] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [stats, setStats] = useState({
    totalCartItems: 0,
    uniqueProducts: 0,
    uniqueUsers: 0,
    totalQuantity: 0
  });

  // Fetch all data including products
  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching all data...");
      
      // Fetch all users
      const usersResponse = await axios.get(`${baseURL}/api/user/all-users`);
      const users = usersResponse.data.data || [];
      
      // Fetch all products
      const productsResponse = await fetch(`${baseURL}/api/product/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1, limit: 1000 })
      });
      const productsResult = await productsResponse.json();
      const products = productsResult.data || [];
      setProductsData(products);
      
      console.log(`👥 Found ${users.length} users`);
      console.log(`📦 Found ${products.length} products`);

      // Extract cart items from all users
      const allCartItems = [];
      users.forEach(user => {
        if (user.shopping_cart && Array.isArray(user.shopping_cart)) {
          user.shopping_cart.forEach(productId => {
            // Find product details
            const productDetails = products.find(p => p._id === productId);
            
            allCartItems.push({
              _id: `${user._id}_${productId}`,
              productId: productId,
              userId: user._id,
              userName: user.name || 'Unknown',
              userEmail: user.email || 'Unknown',
              quantity: 1,
              createdAt: new Date().toISOString(),
              productDetails: productDetails || null
            });
          });
        }
      });

      console.log(`🛒 Found ${allCartItems.length} cart items`);
      
      // Calculate statistics
      const uniqueProducts = new Set(allCartItems.map(item => item.productId)).size;
      const uniqueUsers = new Set(allCartItems.map(item => item.userId)).size;
      const totalQuantity = allCartItems.reduce((sum, item) => sum + item.quantity, 0);

      setCartData(allCartItems);
      setStats({
        totalCartItems: allCartItems.length,
        uniqueProducts,
        uniqueUsers,
        totalQuantity
      });

    } catch (err) {
      console.error("❌ Error fetching cart data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate product URL similar to AllPayments
  const getProductUrl = (productId, productName) => {
    if (!productId) return '#';
    
    const slug = productName?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'product';
    
    return `/product/${slug}-${productId}`;
  };

  // Get product analytics for dropdown
  const getProductAnalytics = () => {
    const productCounts = {};
    cartData.forEach(item => {
      productCounts[item.productId] = (productCounts[item.productId] || 0) + 1;
    });

    return Object.entries(productCounts)
      .map(([productId, count]) => {
        const productDetails = productsData.find(p => p._id === productId);
        return {
          productId,
          count,
          productName: productDetails?.name || 'Unknown Product'
        };
      })
      .sort((a, b) => b.count - a.count);
  };

  // Apply filters to aggregated data
  useEffect(() => {
    // Get aggregated product data (one row per product with count)
    const getAggregatedProductData = () => {
      const productCounts = {};
      const productInfo = {};

      // Count occurrences and collect product info
      cartData.forEach(item => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = 0;
          productInfo[item.productId] = {
            productId: item.productId,
            productDetails: item.productDetails,
            createdAt: item.createdAt // Use first occurrence date
          };
        }
        productCounts[item.productId]++;
      });

      // Convert to array with count information
      return Object.entries(productCounts).map(([productId, count]) => ({
        ...productInfo[productId],
        count: count
      }));
    };

    const aggregatedData = getAggregatedProductData();
    let filtered = [...aggregatedData];

    // Filter by specific product ID
    if (selectedProductId !== 'ALL') {
      filtered = filtered.filter(item => item.productId === selectedProductId);
    }

    // Sort based on filter type
    if (filter === 'PRODUCT_COUNT') {
      filtered.sort((a, b) => {
        return sortOrder === 'DESC' ? b.count - a.count : a.count - b.count;
      });
    } else if (filter === 'PRODUCT_ID') {
      filtered.sort((a, b) => {
        return sortOrder === 'DESC' 
          ? b.productId.localeCompare(a.productId)
          : a.productId.localeCompare(b.productId);
      });
    }

    setFilteredCartData(filtered);
    setCurrentPage(1); // Reset to first page when data changes
  }, [cartData, filter, sortOrder, selectedProductId]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedProductId('ALL'); // Reset product selection when changing main filter
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Reset page and selection when selectedProductId changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProductId]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCartData.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredCartData.length / itemsPerPage);

  // Always show table - removed the condition that was hiding it
  const shouldShowTable = true;

  useEffect(() => {
    fetchCartData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Cart Data...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Data</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchCartData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🛒 Cart Products Analytics</h1>
              <p className="text-gray-600 mt-1">Cart collection data from MongoDB</p>
            </div>
            
            <button 
              onClick={fetchCartData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Cart Items</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCartItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Unique Products</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Unique Users</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Quantity</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuantity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">🏆 Most Popular Products in Cart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getProductAnalytics().slice(0, 6).map((item, index) => (
              <div key={item.productId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {item.count} times
                  </span>
                </div>
                <div className="mb-2">
                  <h4 className="font-medium text-gray-900 truncate" title={item.productName}>
                    {item.productName}
                  </h4>
                  <a
                    href={getProductUrl(item.productId, item.productName)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-mono"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.productId}
                  </a>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(item.count / getProductAnalytics()[0]?.count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Items Table */}
        {shouldShowTable && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">📋 Cart Items Details</h2>
              
              {/* Filter Controls in Table Header */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="ALL">All Items</option>
                    <option value="PRODUCT_ID">Sort by Product ID</option>
                    <option value="PRODUCT_COUNT">Sort by Product Count</option>
                  </select>

                  {/* Sort Order */}
                  {(filter === 'PRODUCT_ID' || filter === 'PRODUCT_COUNT') && (
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="DESC">{filter === 'PRODUCT_COUNT' ? 'High to Low' : 'Z to A'}</option>
                      <option value="ASC">{filter === 'PRODUCT_COUNT' ? 'Low to High' : 'A to Z'}</option>
                    </select>
                  )}

                  {/* Product Selection Dropdown */}
                  {filter === 'PRODUCT_COUNT' && (
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[200px]"
                    >
                      <option value="ALL">All Products</option>
                      {getProductAnalytics().map(item => (
                        <option key={item.productId} value={item.productId}>
                          {item.productName} ({item.count} times)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Results Info */}
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCartData.length)} of {filteredCartData.length} unique products
                  {selectedProductId !== 'ALL' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Filtered by Product
                    </span>
                  )}
                  {filter !== 'ALL' && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {filter === 'PRODUCT_ID' ? 'Sorted by Product ID' : 'Sorted by Product Count'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {filteredCartData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product ID
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th> */}
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Info
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First Added
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getPaginatedData().map((item, index) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {((currentPage - 1) * itemsPerPage) + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.productDetails?.image?.[0] && (
                                <img
                                  src={item.productDetails.image[0]}
                                  alt="Product"
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-200 mr-3"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900 max-w-[180px] truncate" 
                                     title={item.productDetails?.name || 'Unknown Product'}>
                                  {item.productDetails?.name || 'Unknown Product'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.productDetails?.category?.name || 'No Category'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <a
                                href={getProductUrl(item.productId, item.productDetails?.name)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium font-mono px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Product Page"
                              >
                                {item.productId}
                              </a>
                              <button 
                                onClick={() => navigator.clipboard.writeText(item.productId)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="Copy Product ID"
                              >
                                📋
                              </button>
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-purple-600 font-mono">
                              {item.userId}
                            </div>
                          </td> */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{item.userName}</div>
                              <div className="text-gray-500 text-xs">{item.userEmail}</div>
                            </div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                              {item.count} {item.count === 1 ? 'time' : 'times'}
                            </span>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {item.quantity}
                            </span>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCartData.length)}</span> of{' '}
                          <span className="font-medium">{filteredCartData.length}</span> unique products
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            ←
                          </button>
                          
                          {/* Page Numbers */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            →
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">�</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500">
                  {selectedProductId !== 'ALL' 
                    ? 'No products found for the selected filter.'
                    : 'No products have been added to any cart yet.'
                  }
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductMetrics;
