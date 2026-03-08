import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import BannerAdmin from "../pages/BannerAdmin";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import AllPayments from "../components/AllPayments";
import AllUsers from "../components/AllUsers";
import ProductMetrics from "../components/ProductMetrics";
import ProductAnalysis from "../pages/ProductAnalysis";
import License from "../custom/License";
import Info from "../custom/Info";
import ContactUs from "../custom/ContactUs";
import Cookies from "../custom/Cookies";
import PrivacyPolicy from "../custom/PrivacyPolicy";
import ContactUsTickets from "../components/ContactUsTickets";
import Sales from "../components/Sales";
import ValidatePayment from "../pages/ValidatePayment";
import RecycleBinProduct from "../components/RecycleBinProduct";
import Deals from "../components/Deals";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: 'license',
                element: <License />
            },
            {
                path: 'contact-us',
                element: <ContactUs />
            },
            {
                path: 'cookies',
                element: <Cookies />
            },
            {
                path: 'privacy-policy',
                element: <PrivacyPolicy />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: 'category',
                        element: <AdminPermision><CategoryPage /></AdminPermision>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermision><SubCategoryPage /></AdminPermision>
                    },
                    {
                        path: 'upload-product',
                        element: <AdminPermision><UploadProduct /></AdminPermision>
                    },
                    {
                        path: 'product',
                        element: <AdminPermision><ProductAdmin /></AdminPermision>
                    },
                    {
                        path: 'recycle-bin',
                        element: <AdminPermision><RecycleBinProduct /></AdminPermision>
                    },
                    {
                        path: 'deals',
                        element: <AdminPermision><Deals /></AdminPermision>
                    },
                    {
                        path: 'payments',
                        element: <AdminPermision><AllPayments /></AdminPermision>
                    },
                    {
                        path: 'all-users',
                        element: <AdminPermision><AllUsers /></AdminPermision>
                    },
                    {
                        path: 'metrics',
                        element: <AdminPermision><ProductMetrics /></AdminPermision>
                    },
                    {
                        path: 'product-analysis',
                        element: <AdminPermision><ProductAnalysis /></AdminPermision>
                    },
                    {
                        path: 'tickets',
                        element: <AdminPermision><ContactUsTickets /></AdminPermision>
                    },
                    {
                        path: 'banners',
                        element: <AdminPermision><BannerAdmin /></AdminPermision>
                    },
                    {
                        path: 'sales',
                        element: <AdminPermision><Sales /></AdminPermision>
                    }
                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: "",
                        element: <ProductListPage />
                    },
                    {
                        path: ":subCategory",
                        element: <ProductListPage />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            },
            {
                path: 'cart',
                element: <CartMobile />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            }
        ]
    },
    {
        path: 'cashfree',
        element: <ValidatePayment />
    }
])

export default router