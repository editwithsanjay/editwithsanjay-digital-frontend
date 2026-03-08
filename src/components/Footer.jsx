import React from "react";
import { Link } from "react-router-dom"; // React Router for navigation
import "./Footer.css";
import logoIcon from "../assets/logo.png";
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaYoutube, FaBehance, FaGithub } from "react-icons/fa6";
import Version from "./Version";

// WhatsApp redirection handler
const handleWhatsAppRedirect = () => {
  const phoneNumber = "918977300290";
  const message = "Hello, I would like to know more about your services.";
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
};

function scrollUp()
{
  window.scroll(
    {
      top:0,
      animation:'smooth'
    }
  )
}

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top section">
        <div className="container">
          <div className="footer-link-box">
            {/* Contact Us Section */}
            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Contact Us</p>
              </li>
              <li>
                <address className="footer-link">
                  <span className="footer-link-text">
                    Hyderabad, Telangana, INDIA
                  </span>
                </address>
              </li>
              <li>
                <a href="tel:+918977300290" target="_blank" className="footer-link">
                  <span className="footer-link-text">+91 89773 00290</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:editwithsanjay@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <span className="footer-link-text">editwithsanjay@gmail.com</span>
                </a>
              </li>
              
              {/* Branded Social Links */}
              <li>
                <div className="flex items-center gap-4 mt-4 py-2 border-t border-gray-700/30">
                  <a href="#" className="text-[#E4405F] hover:scale-110 transition-transform duration-300" title="Instagram">
                    <FaInstagram size={18} />
                  </a>
                  <a href="#" className="text-[#0A66C2] hover:scale-110 transition-transform duration-300" title="LinkedIn">
                    <FaLinkedinIn size={18} />
                  </a>
                  <a href="#" className="text-[#FF0000] hover:scale-110 transition-transform duration-300" title="YouTube">
                    <FaYoutube size={18} />
                  </a>
                  <a href="#" className="text-[#25D366] hover:scale-110 transition-transform duration-300" title="WhatsApp">
                    <FaWhatsapp size={18} />
                  </a>
                  <a href="#" className="text-[#1769FF] hover:scale-110 transition-transform duration-300" title="Behance">
                    <FaBehance size={18} />
                  </a>
                  <a href="#" className="text-[#181717] hover:scale-110 transition-transform duration-300" title="GitHub">
                    <FaGithub size={18} />
                  </a>
                </div>
              </li>
            </ul>

            {/* Info Section */}
            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Info</p>
              </li>
              <li>
                <Link to="/license" className="footer-link">
                  <span className="footer-link-text">License</span>
                </Link>
              </li>
              <li>
                <Link to="/contact-us" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/cookies" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">Cookies</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">Privacy Policy</span>
                </Link>
              </li>
            </ul>

            {/* My Account Section */}
            <ul className="footer-list">
              <li>
                <p className="footer-list-title">My Account</p>
              </li>
              <li>
                <Link to="/dashboard/profile" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">My Account</span>
                </Link>
              </li>
              <li>
                <Link to="/checkout" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">View Cart</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/myorders" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">My Orders</span>
                </Link>
              </li>
              <li>
                <Link to="/new-products" onClick={()=>scrollUp()} className="footer-link">
                  <span className="footer-link-text">New Products</span>
                </Link>
              </li>
            </ul>

            {/* Categories Section */}
            <div className="footer-list">
              <p className="footer-list-title">Categories</p>
              <ul>
                <li>
                  <Link
                    to="/After-Effects-Template's--67365c078c2f3f39f73e2cac/CINEMATIC-TITLE'S-6737a6d76a02825477b37d3b"
                    onClick={()=>scrollUp()}
                    target="_blank"
                    className="footer-link"
                  >
                    <span className="footer-link-text">After Effects</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Premiere-Pro-Templates-673b6ce9af2ab53e052de8f6/CHANNEL-INTRO'S-673b6db1af2ab53e052de90c"
                    onClick={()=>scrollUp()}
                    target="_blank"
                    className="footer-link"
                  >
                    <span className="footer-link-text">Premiere Pro</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Photoshop-Templates-67365d008c2f3f39f73e2d02/GAMING-THUMBNAIL'S-67371075f28bba4b5ad08e4f"
                    onClick={()=>scrollUp()}
                    target="_blank"
                    className="footer-link"
                  >
                    <span className="footer-link-text">Photoshop</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Davinci-Resolve-Templates-6737a49d6a02825477b37c64/CINEMATIC-TITLE'S-6737a4ad6a02825477b37c69"
                    onClick={()=>scrollUp()}
                    target="_blank"
                    className="footer-link"
                  >
                    <span className="footer-link-text">Davinci Resolve</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* WhatsApp Section */}
            <div className="footer-list">
              <p className="footer-list-title">WhatsApp</p>
              <p className="newsletter-text">
                "Shop Anytime, Support Every Time – 24/7 Assistance at Your
                Fingertips!"
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
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; 2025{" "}
            <a href="#" className="copyright-link">
              @editwithsanjay
            </a>
            . All Rights Reserved
          </p>
          <Version />
        </div>
      </div>
    </footer>
  );
};

export default Footer;



































/* ***********************************************************************************************************************************************************************************************************************************************************/
























// import React from 'react'
// import { FaBehance } from "react-icons/fa";
// import { FaInstagram } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa";

// import { RiShareBoxLine } from "react-icons/ri";

// import Version from './Version';

// const Footer = () => {
//   return (
//     <footer className='border-t'>
//         <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
//             <div>
                
//                 <Version/>
//             </div>

//             <div>
//                 <p
//                     style={{ fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
//                     onClick={() => window.open('https://designwithsanjay.netlify.app/', '_blank')}
//                 >
//                     <b>Created By @editwithsanjay All Rights Reserved</b>
//                     <RiShareBoxLine />
//                 </p>
//                 <br/>

//                 <p
//                     style={{ fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
//                     onClick={() => window.open('https://goutham469.netlify.app', '_blank')}
//                 >
//                     <b>- developed by Goutham reddy</b>
//                     <RiShareBoxLine />
//                 </p>
//             </div>


//             <div className='flex items-center gap-4 justify-center text-2xl'>
//                 <a href='https://www.behance.net/attellisanjay/' className='hover:text-primary-100'>
//                     <FaBehance/>
//                 </a>
//                 <a href='https://www.instagram.com/editwithsanjay/' className='hover:text-primary-100'>
//                     <FaInstagram/>
//                 </a>
//                 <a href='https://www.linkedin.com/in/attelli-sanjay-kumar-7073b9274/?originalSubdomain=in' className='hover:text-primary-100'>
//                     <FaLinkedin/>
//                 </a>
//             </div>
//         </div>


        



//     </footer>
//   )
// }

// export default Footer
