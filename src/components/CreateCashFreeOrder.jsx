import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SummaryApi, { clientURL } from '../common/SummaryApi';
import { baseURL } from '../App';
import Axios from '../utils/Axios';
import Checkout from './PaymentComponent';

function CreateCashFreeOrder({ list_items, addressId, subTotalAmt, totalAmt, userDetails }) {
  const [order_generated, setOrderGenerated] = useState('');

  const generateUniqueOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const generateGuestPhone = () => {
    return `9${Math.floor(Math.random() * 1000000000)}`;
  };

  const generateGuestId = () => {
    return `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  };

  async function createOrder(amount_total = totalAmt) {
    console.log("cashfree initiation started.");
    
    // Generate unique identifiers for this transaction
    const uniqueOrderId = generateUniqueOrderId();
    const customerPhone = userDetails?.phone || generateGuestPhone();
    const customerId = userDetails?._id || generateGuestId();

    try {
      let data = await Axios({
        ...SummaryApi.cashfree_initiate,
        data: {
          list_items: list_items,
          addressId: addressId,
          subTotalAmt: subTotalAmt,
          order_amount: amount_total,
          order_currency: "INR",
          order_id: uniqueOrderId,
          customer_details: {
            customer_id: customerId,
            customer_phone: customerPhone
          },
          order_meta: {
            return_url: `${clientURL}/dashboard/myorders`,
            notify_url: `${baseURL}/api/order/payment-webhook`
          }
        }
      });

      console.log(data);

      if (data?.data?.success) {
        setOrderGenerated(data?.data?.orderId);
        console.log("Payment ID generated:", data?.data?.orderId);
      }

    } catch (err) {
      alert("Payment initiation failed.");
      console.log(err.message);
    }
  }

  return (
    <div>
      {
        order_generated ?
          <Checkout payment_id={order_generated} /> :
          <button onClick={() => createOrder()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Pay with Cashfree
          </button>
      }
    </div>
  );
}

CreateCashFreeOrder.propTypes = {
  list_items: PropTypes.array.isRequired,
  addressId: PropTypes.string.isRequired,
  subTotalAmt: PropTypes.number.isRequired,
  totalAmt: PropTypes.number.isRequired,
  userDetails: PropTypes.shape({
    phone: PropTypes.string,
    _id: PropTypes.string
  })
};

export default CreateCashFreeOrder;
