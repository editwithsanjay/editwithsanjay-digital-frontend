import { load } from "@cashfreepayments/cashfree-js";
import { baseURL, clientURL } from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Checkout( { payment_id } ) {
    const navigate = useNavigate();

    let cashfree;
    var initializeSDK = async function () {          
        cashfree = await load({
            mode: "production"
        });
    }
    initializeSDK();
 
    const doPayment = async () => {
        let checkoutOptions = {
            paymentSessionId: payment_id,
            redirectTarget: `${clientURL}/cashfree/?orderId=${payment_id}`,
        };
       try{
          let status = await cashfree.checkout(checkoutOptions);
          console.log("status : " , status);

        //   let status2 = await handlePaymentSuccess(payment_id);
        //   console.log("status2 : ",status2)
       }catch(err)
       {
        alert("payment failed");
        console.log(err.message)
       }
    };

    async function sendEmail( id )
    {
        await fetch(`${baseURL}/api/services/send-product` , {
            headers:{"Content-Type":"application/json"},
            method:"POST",
            body:JSON.stringify( {  id:id } )
        })
    }

    const handlePaymentSuccess = async ( payment_id) => {
      // alert(`payment_id = ${payment_id}`)
      

      let verify_payment = await fetch(`${baseURL}/api/order/verify-payment`,{
                          method:"POST",
                          headers:{"Content-Type":"application/json"},
                          body:JSON.stringify({orderId:payment_id})
                        })
      
        verify_payment = await verify_payment.json()
        console.log("verify_payment : ",verify_payment)
 
        if(verify_payment.data.modifiedCount > 0){
            // alert("transaction success.")
            // sendEmail( payment_id )
            toast.success("transaction success")
            navigate('/dashboard/myorders')

        }else{
            // alert("unauthorized transaction.")
            toast.error("unauthorized transaction.")
        }

      console.log("every thing is OK !");

    }

    return (
        <div class="row">
            <button type="submit" className="bg-green-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  id="renderBtn" onClick={doPayment}>
                Pay Now
            </button>
        </div>
    );
}
export default Checkout;