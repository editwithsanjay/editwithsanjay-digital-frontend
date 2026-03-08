import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { baseURL } from '../common/SummaryApi';
import toast from 'react-hot-toast';

function ValidatePayment() {
    // here get the query parameters
    const location = useLocation();
    const [orderId , setOrderId] = useState(location.search.split('=')[1])
    const [ok , setOk] = useState(false)

    async function verifyOrder()
    {
        let verify_payment = await fetch(`${baseURL}/api/order/verify-payment`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({orderId:orderId})
                  })

        verify_payment = await verify_payment.json()
        console.log(verify_payment)
        if(verify_payment.data.modifiedCount > 0){
            setOk(true)
        }else{
            alert("unauthorized transaction.")
        }
    }

    useEffect(()=>{
        verifyOrder()
    },[])
    
  return (
    <div>
        {
            ok&&<h1>Cashfree payment success</h1>
        }
        <p>{orderId}</p>
    </div>
  )
}

export default ValidatePayment