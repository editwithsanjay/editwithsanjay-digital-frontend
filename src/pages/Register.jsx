import React, { useEffect, useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi, { baseURL, clientURL } from '../common/SummaryApi';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { googleClientId } from './Login';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const validateValue = Object.values(data).every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be the same");
            return;
        }

        // Send POST request with fetch
        try {
            console.log(data);

            const response = await fetch(`${baseURL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Sending the data as a JSON string
            });

            console.log(response)

            const result = await response.json(); // Parse JSON response

            console.log(result)

            if (!response.ok) {
                // If response code is not OK (e.g., 4xx or 5xx)
                toast.error(`Error: ${result.message}`);
                return;
            }

            if (result.success) 
            {
                toast.success(`Registration successful: ${result.message}`);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                // navigate("/login");
                // start of Login
                console.log("registration started " , data)

                try {
                    const response = await Axios({
                        ...SummaryApi.login,
                        data : data
                    })
                    
                    console.log(response)
                     
                    if(response.data.error){
                        toast.error(response.data.message)
                    }
        
                    if(response.data.success){
                        toast.success(response.data.message)
                        localStorage.setItem('accesstoken',response.data.data.accesstoken)
                        localStorage.setItem('refreshToken',response.data.data.refreshToken)
        
                        const userDetails = await fetchUserDetails()
                        console.log(userDetails);

                        dispatch(setUserDetails(userDetails.data))
        
                        window.location.reload();
                        console.log("every thing is done.");
                        navigate("/")
                        
                    }


        
                } catch (error) {
                    console.log(error)
                    AxiosToastError(error)
                }

                window.location.href = `${clientURL}`


                // end of Login
            } else {
                toast.error("An error occurred during registration");
            }
        } catch (error) {
            console.log("error at the end : ",error)
            toast.error(`Error: ${error.message}`);
        }
    };

    function generateRandom10DigitNumber() {
        const min = 1000000000; // Minimum 10-digit number
        const max = 9999999999; // Maximum 10-digit number
      
        return String(Math.floor(Math.random() * (max - min + 1)) + min);
    }


    async function onSuccess(response)
    {
        let credential = jwtDecode(response.credential)

        // alert(credential.email)
        console.log(credential)

        let data2 = data; 

        data2.confirmPassword = generateRandom10DigitNumber()
        data2.password = data2.confirmPassword;
        data2.name = credential.name;
        data2.email = credential.email;

        try {
            const response = await fetch(`${baseURL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Sending the data as a JSON string
            });

            console.log(response)

            const result = await response.json(); // Parse JSON response

            console.log(result)

            if (!response.ok) {
                // If response code is not OK (e.g., 4xx or 5xx)
                toast.error(`Error: ${result.message}`);
                return;
            }

            if (result.success) {
                toast.success(`Registration successful: ${result.message}`);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });

                // Login functionality
                // navigate("/login");
                let data3 = {
                    email: "",
                    password: data2.password,
                }

                data3.OAuth = true;
                data3.email = credential.email;

                try {
                    const response = await Axios({
                        ...SummaryApi.login,
                        data : data3
                    })
                     
                    if(response.data.error){
                        toast.error(response.data.message)
                    }
        
                    if(response.data.success){
                        toast.success(response.data.message)
                        localStorage.setItem('accesstoken',response.data.data.accesstoken)
                        localStorage.setItem('refreshToken',response.data.data.refreshToken)
        
                        const userDetails = await fetchUserDetails()
                        dispatch(setUserDetails(userDetails.data))
        
                        // setData({
                        //     email : "",
                        //     password : "",
                        // })

                        window.location.reload();
                    }
                    
        
                } catch (error) {
                    AxiosToastError(error)
                }

                window.location.href = `${clientURL}`;


            } else {
                toast.error(result.message || "An error occurred during registration");
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    }

    async function checkLogged()
    {
        const userDetails = await fetchUserDetails()
        if(userDetails?.data){
            navigate("/")
        }
    }
    useEffect(()=>{
        checkLogged()
        window.scroll('top',0)
        },[])

    return (
        <section className="w-full container mx-auto px-2">
            <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
                <p className='text-center font-bold text-2xl'>Welcome, Register to continue...</p>
                <p className='text-center font-bold'>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-green-700 hover:text-green-800">
                        Login
                    </Link>
                </p>
                <br/>
                <center>
                    <GoogleOAuthProvider clientId={googleClientId} >
                        <GoogleLogin onSuccess={onSuccess}/>
                    </GoogleOAuthProvider>
                </center>
                

                <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
                    <div className="grid gap-1">
                        <label htmlFor="name">Name :</label>
                        <input
                            type="text"
                            id="name"
                            autoFocus
                            className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="password">Password :</label>
                        <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full outline-none"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer">
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="confirmPassword">Confirm Password :</label>
                        <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full outline-none"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter your confirm password"
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className="cursor-pointer">
                                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!validateValue}
                        className={`${
                            validateValue ? "bg-green-800 hover:bg-green-700" : "bg-green-500"
                        } text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Register
                    </button>
                </form>


                

                
            </div>
        </section>
    );
};

export default Register;
