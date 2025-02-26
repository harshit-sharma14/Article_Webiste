import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div><footer className="bg-gray-900 text-gray-300 py-10 mt-10">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
      
      {/* About Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">About NewsHub</h2>
        <p className="text-sm">
          NEWS is your go-to source for the latest news, covering politics, sports, technology, and more. 
          Our mission is to deliver accurate and up-to-date information to keep you informed.
        </p>
      </div>
  
      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li><Link to="/about" className="hover:text-gray-400 transition">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-gray-400 transition">Contact</Link></li>
          <li><Link to="/categories" className="hover:text-gray-400 transition">Categories</Link></li>
          <li><Link to="/privacy-policy" className="hover:text-gray-400 transition">Privacy Policy</Link></li>
        </ul>
      </div>
  
      {/* Social Media */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Follow Us</h2>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-400 transition"><FaFacebook className='text-4xl'/></a>
          <a href="#" className="hover:text-blue-500 transition"><FaInstagram className='text-4xl'/></a>
          <a href="#" className="hover:text-red-500 transition"><FaYoutube className='text-4xl'/></a>
          <a href="#" className="hover:text-pink-500 transition"><FaSquareXTwitter className='text-4xl'/></a>
        </div>
      </div>
  
    </div>
  
    {/* Copyright Section */}
    <div className="text-center text-sm border-t border-gray-700 mt-8 pt-6">
      © {new Date().getFullYear()} NewsHub. All rights reserved.
    </div>
  </footer>
  </div>
  )
}

export default Footer