"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // Import motion

export default function Home() {
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState(null);
  const router = useRouter();  // Initialize the router for redirection

  useEffect(() => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    const authToken = getCookie('authToken');
    const userName = getCookie('userName');

    if (authToken && userName) {
      // Cookies exist, so they are not expired
      setToken(authToken);
      setUserName(userName);
      console.log('Cookies are valid');
    } else {
      toast.error("Please login first");

      // Redirect to the home page
      // window.open("http://localhost:3000/", "_blank");
      // console.log('Cookies have expired or not set');
    }
  }, [router]);

  return (
    <>
      {/* Header */}
      <motion.div 
        className="flex justify-between w-full px-8 mt-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-sm lg:text-2xl">Platform Documentation</h2>
        <p className="text-xs lg:text-sm text-gray-500 mt-2 md:mt-0">Platform Documentation / Platform</p>
      </motion.div>

      {/* Main Content with animation */}
      <motion.div
        className="flex flex-col lg:flex-row min-h-[680px] px-4 lg:px-8"
        initial={{ opacity: 0, x: -100 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.7 }}
      >
        {/* Left Sidebar */}
        <motion.div 
          className="lg:w-1/5 bg-white p-4 my-8 lg:mr-5 shadow-xl order-1 lg:order-1"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold">Left Sidebar</h2>
          {/* Add your sidebar content here */}
        </motion.div>

        {/* Right Sidebar */}
        <motion.div 
          className="lg:w-1/5 bg-white p-4 lg:ml-5 my-8 shadow-xl order-2 lg:order-3"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold">Right Sidebar</h2>
          {/* Add your sidebar content here */}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 bg-white p-4 my-8 shadow-xl order-3 lg:order-2"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h1>Main Content</h1>
          {/* Add your main content here */}
        </motion.div>
      </motion.div>
    </>
  );
}
