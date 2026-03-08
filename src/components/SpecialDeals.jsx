import React, { useEffect, useState } from 'react'
import CardProduct from './CardProduct'
import CardLoading from './CardLoading'
import { baseURL } from '../common/SummaryApi'
import toast from 'react-hot-toast'

function SpecialDeals() {
    const [loading , setLoading] = useState(true)
    const [deals , setDeals] = useState([])

    async function getData(){
        let data = await fetch(`${baseURL}/api/product/get-deals`,{
            method:"POST",
            headers:{"Content-Type":"application/json"}
        })
        data = await data.json()
        if(data.success){
            setDeals(data.data)
        }else{
            toast.warning("problem loading special deals")
        }
        setLoading(false)
    }

    useEffect(()=>{
        getData()
    },[])

    const DailyText = () => 
    {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date();
        const day = date.getDay(); // Returns a number between 0 (Sunday) and 6 (Saturday)
    
        let text = '';
        if (day % 3 === 0) 
        {
        text = '🔥 Exclusive Deals – Up to 60% OFF!';
        } 
        else if (day % 3 === 1) 
        {
        text = '⚡Price Drop! Get Your Favorites at the Best Price!';
        } 
        else 
        {
        text = '💸Best Offers of the Week – Grab Now!';
        }
    
        return text;
    };

  return (
    <div>
        <div className=' mx-auto p-4 gap-4'>
            <h3 className='font-semibold text-lg md:text- text-center uppercase'> {  DailyText()   } </h3>
        </div>

        <div className='relative flex items-center '>
            <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' >
                {
                loading &&
                    [1,2,3,4,5].map((_, index) => {
                        return (
                            <CardLoading key={"CategorywiseProductDisplay123" + index} />
                        )
                    })  
                }


                {
                    deals?.map((p, index) => {
                        return (
                            <CardProduct
                                data={p}
                                key={p?._id + "CategorywiseProductDisplay" + index}
                            />
                        )
                    })
                }

            </div>
        </div>

        
    </div>
  )
}

export default SpecialDeals;