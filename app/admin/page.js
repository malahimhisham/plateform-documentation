"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Howto from './HowTo/Howto';
import Knowledge from './Knowledge/Knowledge';
import ProductUpdates from './ProductUpdates/ProductUpdates';
import toast from 'react-hot-toast';
import FeedBack from './HowTo/FeedBack';
import FeedBack2 from './Knowledge/FeedBack';
import FeedBack3 from './ProductUpdates/FeedBack';

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHowTo, setHowTo] = useState(true);
  const [isKnowledge, setKnowledge] = useState(false);
  const [isProductUpdates, setProductUpdates] = useState(false)
  const [feedBack, setFeedBack] = useState(false)
  const [feedBack2, setFeedBack2] = useState(false)
  const [feedBack3, setFeedBack3] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();
  //   const { isAdmin , setIsAdmin } = useContext(Admin_data);

  const handleSelection = (selected) => {
    setHowTo(selected === "howto");
    setKnowledge(selected === "knowledge");
    setProductUpdates(selected === 'productupdates')
    setFeedBack(selected === 'feedback')
    setFeedBack2(selected === 'feedback2')
    setFeedBack3(selected === 'feedback3')

    setIsOpen(false);
  };

  const logout = () => {
    // localStorage.removeItem("authToken")
    // localStorage.removeItem('userName')
    // Delete cookies by setting their expiration date to the past
    document.cookie = "authToken=; domain=.terapage.ai; path=/; secure; SameSite=None; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userName=; domain=.terapage.ai; path=/; secure; SameSite=None; expires=Thu, 01 Jan 1970 00:00:00 UTC;";


    toast.success("Logout User Successfully")
    router.push('/')
  }

  return (
    <>
      <div className="flex">
        {/* Button to toggle sidebar on small screens */}
        <button
          className="md:hidden fixed top-4 left-2 z-50 required:mb-6 bg-primary text-white p-2 rounded"
          onClick={toggleSidebar}
        >
          {isOpen ? '' : <FaBars size={24} />} {/* Toggle between icons */}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-primary shadow-md text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 z-20`}
        >
          <div className="p-4 text-lg ml-2clg:ml-auto font-semibold border-b border-gray-700">Terapage Platform Documentation Admin Panel</div>
          <ul className="mt-4 space-y-2">
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${isHowTo ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("howto")}
            >
              General Guides
            </li>

            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${isKnowledge ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("knowledge")}
            >
              Knowledge Base
            </li>
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${isProductUpdates ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("productupdates")}
            >
              Release Notes
            </li>
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${feedBack ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("feedback")}
            >
              General Guides feedbacks
            </li>
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${feedBack2 ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("feedback2")}
            >
              Knowledge Base feedbacks
            </li>
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${feedBack3 ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("feedback3")}
            >
              Release Notes feedbacks
            </li>


          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 ml-0 md:ml-64">
          <div>
            <button
              onClick={() => logout()}
              className="absolute top-4 right-64 bg-primary text-white px-4 py-2 rounded-lg shadow-md z-50"
            >
              Logout
            </button>

            <Link href={'/GeneralGuides'}>
              <button className="absolute top-4 right-1 bg-primary text-white px-4 py-2 rounded-lg shadow-md">
                Go to Platform Documentation
              </button>
            </Link>
          </div>

          <div className="mt-4">
            {isHowTo && <Howto />}
            {isKnowledge && <Knowledge />}
            {isProductUpdates && <ProductUpdates />}
            {feedBack && <FeedBack />}
            {feedBack2 && <FeedBack2 />}
            {feedBack3 && <FeedBack3 />}
          </div>
        </div>

        {/* Overlay for small screens */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 md:hidden z-10"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
};

export default Page;