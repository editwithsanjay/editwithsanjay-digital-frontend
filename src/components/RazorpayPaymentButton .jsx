import React from "react";
import axios from "axios";
import Axios from "../utils/Axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const RazorpayPaymentButton = ( { list_items, addressId, subTotalAmt, totalAmt,userDetails } ) => {
  const orderDetails = {
    list_items:list_items,
    addressId:addressId,
    subTotalAmt:subTotalAmt,
    totalAmt:totalAmt
  }

  const initiateRazorpayPayment = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.rzp_initiate, 
        data : {
          list_items : list_items,
          addressId : addressId,
          subTotalAmt : subTotalAmt,
          totalAmt :  totalAmt,
        }
      })

      console.log(response)

      const { orderId } = response.data;
      // orderId is coming till here

      let verify_payment = false;

      const options = {
        key: 'rzp_live_xkabeTkYs1O92K' , 
        amount: orderDetails.totalAmt * 100,
        currency: "INR",
        name: "EDIT WITH SANJAY",
        description: "enjoy your video templates !",
        order_id: orderId,
        handler: async (paymentResult) => {
          // Verify payment result with backend

          // verify_payment = await Axios({
          //   ...SummaryApi.rzp_verify, 
          //   orderId   
          // } )
           

          // await axios.post("http://localhost:4000/api/order/verify-payment", paymentResult);


          // let baseURL = 'https://blinkit-clone-full-stack-ecommerce.onrender.com'
          
          verify_payment = fetch(`${baseURL}/api/order/verify-payment`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({orderId:orderId})
          })

          console.log(verify_payment)


          alert("Payment successful!",verify_payment.data.success,verify_payment.data.error);

          window.location.reload()

        },
        prefill: {
          name: '',
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: {
          color: "#3399cc"
        },
        method: {
          netbanking: true,
          card: true,
          upi: true, 
          upiQR:false
        },
      };

      console.log("check point 2")

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      console.log("check point 3")

     


    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <button onClick={initiateRazorpayPayment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Pay with Razorpay
    </button>
  );
};

export default RazorpayPaymentButton;
 