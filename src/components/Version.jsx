import React, { version } from 'react'
import isAdmin from '../utils/isAdmin'
import { useSelector } from 'react-redux'

function Version() {
    const versions = [
        {
            version:'1.3',
            data:['Payments PENDING will not be showed' , 'add address tab at UserMenu.jsx component removed' , 'Social media icons refrers added for sanjay' , 'Banner image changed']
        },
        {
            version:'1.4',
            data:['admin dashboard changes' , 'all users tab added' , 'all payments tab added' , 'profile dropdown changed as per new need']
        },
        {
            version:'1.5',
            data:['search bar place holder and animations changed, functionality disabled' , 'CATEGORIES icons changes']
        },
        {
            version:'1.6',
            data:['RZP , multiple payments will be accepted !, change made only on backend' , 'index.html icons added' , 'chat bot integrated' , 'Cart side delivery time removed' , 'add and remove to cart , icons added']
        },
        {
            version:'1.7',
            data : ['Chat bot removed' , 'Date of product purchase added in My Orders' , 'Failed purchases showed in User Orders' , 'advertisement banner at Checkout Page added'  ]
        },
        {
            version:'1.8',
            data : ['Mobile view updated for Sub-Categories page' , 'Recomendation system added under complete produuct' , 'on-refresh products shuffled' , 'recomendation system for Mobile updated' , 'Google OAuth added' , 'Footer changed']
        },
        {
            version:'1.9',
            data : ['Feed back form for remove cart added' , 'admin dashboard for metrics added' , 'product page opened , tracking of metrics']
        },
        {
            version:'2.0',
            data : [ 'search functionality updated' , 'AWS Lambda cold starts updated.'  , 'banner image for both Mobile and Desktop size reduced.'  , 'search for admin product updated' , 'Sub categories filters updated' , 'footer page all changes made' , 'main page category displayed.']
        },
        {
            version:'3.1',
            data : ['payment redirect changed' , 'recovery mechanism added' , 'image upload set to upload preset' , 'deals section added for both user and admin' ]
        }
    ]
    const user = useSelector((state)=> state.user)

    const cur_version = versions[ versions.length -1 ]

    // console.log(versions)
  return (
    <div style={{fontSize:"12px",color:"white"}}>
        <center>
            <b>version : {cur_version.version}, Last updated on 13-02-2025</b>
        </center>
         
        <div style={{textAlign:"left"}}>
            {
                isAdmin(user.role)&&<b>key changes</b>
            }
            {
                isAdmin(user.role)&&cur_version.data.map((item,idx)=><p>{idx+1}. {item}</p>)
            }
        </div>
    </div>
  )
}

export default Version