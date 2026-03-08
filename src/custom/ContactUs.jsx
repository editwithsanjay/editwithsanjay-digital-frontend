import React, { useState } from 'react';
import { baseURL } from '../App';
import toast from 'react-hot-toast';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaBehanceSquare } from 'react-icons/fa';
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    issue: ""
  });

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "918977300290";
    const message = "Hello, I would like to know more about your services.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  async function submitForm(e) {
    e.preventDefault();

    console.log(form);

    try {
      const res = await fetch(`${baseURL}/api/survey/submitForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast.success("Your issue has been recorded.");
        setForm({})
      } else {
        const error = await res.json();
        console.error(error);
        toast.error("Failed to record your issue.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server Error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

      {/* Container for Form and Social Media Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        
        {/* Contact Form Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-96">
          <form onSubmit={submitForm} className="space-y-4">
            
            <div>
              <label htmlFor="name" className="text-gray-700 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow focus:ring-2 focus:ring-indigo-400"
                onChange={(e) =>
                  setForm((prevData) => ({ ...prevData, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow focus:ring-2 focus:ring-indigo-400"
                onChange={(e) =>
                  setForm((prevData) => ({ ...prevData, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow focus:ring-2 focus:ring-indigo-400"
                onChange={(e) =>
                  setForm((prevData) => ({ ...prevData, mobile: e.target.value }))
                }
              />
            </div>

            <div>
              <label htmlFor="issue" className="text-gray-700 font-medium">
                Issue
              </label>
              <textarea
                id="issue"
                rows="4"
                placeholder="Describe your issue"
                className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow focus:ring-2 focus:ring-indigo-400"
                onChange={(e) =>
                  setForm((prevData) => ({ ...prevData, issue: e.target.value }))
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Submit
            </button>

            
          </form>
        </div>

        {/* Social Media Links Card */}
        <div className="w-full md:w-96 bg-white shadow-lg rounded-lg p-6 mt-4">
          <h2 className="text-center text-gray-800 font-bold mb-4 text-xl"><label style={{textTransform:"uppercase"}}>Social Links</label></h2>
          <div className="flex justify-center space-x-6">


            
            {[
              { icon: <FaFacebookF />, color: "text-blue-600" , link:"https://www.facebook.com/sanjay.attelli" } ,
              { icon: <FaXTwitter/>, color: "text-black-400" ,  link:"https://twitter.com/SanjayAttelli"},
              { icon: <FaInstagram />, color: "text-red-600" ,  link:"https://www.instagram.com/editwithsanjay/"},
              { icon: <FaLinkedin />, color: "text-blue-600" ,  link:"https://www.linkedin.com/in/attelli-sanjay-kumar/" },
              { icon: <FaBehanceSquare />, color: "text-blue-600" ,  link:"https://www.behance.net/attellisanjay/" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                className={`text-4xl ${social.color} hover:opacity-75 transition`}
                aria-label="Social Media"
              >
                {social.icon}
              </a>
            ))}
          </div>



          <div className="footer-list mt-6 text-center">
            <p  style={{fontSize:"20px",fontWeight:"700"}}>WhatsApp</p>
            <p style={{fontSize:"12px",textAlign:"left",margin:"5px"}}>
              Shop Anytime, Support Every Time – 24/7 Assistance at Your
              Fingertips!
            </p>
            <button
              className="whatsapp-button"
              onClick={handleWhatsAppRedirect}
            >
              <FaWhatsapp size={25} />
              <label style={{ marginLeft: "10px", cursor: "pointer" }}>
                Contact on WhatsApp
              </label>
            </button>
          </div>



          <b>Note : </b>
          <p style={{fontSize:"12px"}}>
              We're doing our best to answer in 3 business days.
              Please avoid to report about same problem again in that period.
            </p>


        </div>

      </div>
    </div>
  );
}

export default ContactUs;
