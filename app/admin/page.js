"use client"
import React, {  useState} from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import Link from 'next/link';
import Howto from './HowTo/Howto';
import Knowledge from './Knowledge/Knowledge';
import ProductUpdates from './ProductUpdates/ProductUpdates';

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHowTo, setHowTo] = useState(true);
  const [isKnowledge, setKnowledge] = useState(false);
  const [isProductUpdates, setProductUpdates] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();
  //   const { isAdmin , setIsAdmin } = useContext(Admin_data);

  const handleSelection = (selected) => {
    setHowTo(selected === "howto");
    setKnowledge(selected === "knowledge");
    setProductUpdates(selected === 'productupdates')
    setIsOpen(false);
  };


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
          <div className="p-4 text-lg ml-2clg:ml-auto font-semibold border-b border-gray-700">Terapage Plateform Documentation Admin Panel</div>
          <ul className="mt-4 space-y-2">
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${isHowTo ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("howto")}
            >
              How To
            </li>

            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${isKnowledge ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("knowledge")}
            >
              Knowledge
            </li>
            <li
              className={`px-4 py-2 cursor-pointer transition duration-300 ease-in-out flex items-center rounded-md ${isProductUpdates ? 'bg-[#2c234d] text-white font-semibold' : 'bg-transparent text-white'} hover:bg-[#2c234d] hover:text-white`}
              onClick={() => handleSelection("productupdates")}
            >
              Product Updates
            </li>
        

          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 ml-0 md:ml-64">
          <div>
            <Link href={'/'}>
              <button className="absolute top-4 right-2 bg-primary text-white px-4 py-2 rounded-lg shadow-md">
                Go to Plateform Documentation
              </button>
            </Link>
          </div>

          <div className="mt-4">
            {isHowTo && <Howto />}
            {isKnowledge && <Knowledge />}
            {isProductUpdates && <ProductUpdates />}
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