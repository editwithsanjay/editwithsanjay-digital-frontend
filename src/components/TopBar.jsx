import React from 'react';
import {
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaWhatsapp,
    FaBehance,
    FaGithub
} from 'react-icons/fa';

const TopBar = () => {
    return (
        <div className="bg-white text-gray-700 py-1.5 border-b border-gray-100 hidden lg:block">
            <div className="container mx-auto px-4 flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
                {/* Left Side: Trending Count */}
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                    <span className="opacity-70">Total Trending Templates :</span>
                    <span className="text-gray-900">520+</span>
                </div>

                {/* Center: Tagline */}
                <div className="absolute left-1/2 -translate-x-1/2 text-gray-400 font-medium normal-case tracking-normal text-[12px] italic">
                    Premium Assets for Every Creator
                </div>

                {/* Right Side: Social Links */}
                <div className="flex items-center gap-5">
                    <a href="#" className="text-[#E4405F] hover:scale-110 transition-transform duration-300" title="Instagram">
                        <FaInstagram size={14} />
                    </a>
                    <a href="#" className="text-[#0A66C2] hover:scale-110 transition-transform duration-300" title="LinkedIn">
                        <FaLinkedinIn size={14} />
                    </a>
                    <a href="#" className="text-[#FF0000] hover:scale-110 transition-transform duration-300" title="YouTube">
                        <FaYoutube size={14} />
                    </a>
                    <a href="#" className="text-[#25D366] hover:scale-110 transition-transform duration-300" title="WhatsApp">
                        <FaWhatsapp size={14} />
                    </a>
                    <a href="#" className="text-[#1769FF] hover:scale-110 transition-transform duration-300" title="Behance">
                        <FaBehance size={14} />
                    </a>
                    <a href="#" className="text-[#181717] hover:scale-110 transition-transform duration-300" title="GitHub">
                        <FaGithub size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
