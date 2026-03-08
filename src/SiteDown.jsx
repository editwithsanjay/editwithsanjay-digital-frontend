import React from 'react'

function SiteDown() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Under Construction</h1>
            <div className="mb-4">
                <b className="text-lg text-gray-700 block mb-2">From the last month, we are getting huge traffic, and frequently our servers are going down.</b>
                <p className="text-gray-600 mb-4">So we are working on it to solve the issue.</p>
                <b className="text-lg text-gray-700 block mb-2">If you have any queries, you can contact us at:</b>
                <a href="mailto:editwithsanjay@gmail.com" className="text-blue-600 hover:underline">editwithsanjay@gmail.com</a>
            </div>

            <b>Last modified on :- 07-March-2025 </b>
        </div>
    </div>
  ) 
}

export default SiteDown;