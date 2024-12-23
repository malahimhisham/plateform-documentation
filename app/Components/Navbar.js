"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {  FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)

  const pathname = usePathname()

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

    fetchAdmin()
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const fetchAdmin = async () => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    const token = getCookie('authToken');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/checkAdmin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            setIsAdmin(data.isUserAdmin)
        } else {
            setIsAdmin(false)
        }
        setLoading(false);
    } catch (error) {
        // localStorage.removeItem('authToken')
        // localStorage.removeItem('userName')
        console.log("not admin")
    }
}

  return (
    <>
      {(!pathname.startsWith("/admin")) && (
        <>
          <header className="bg-white px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
            <Link href={'/'}>
              <div className="h-5 w-36 sm:w-48 md:w-56">
                <img src="/logo.png" alt="Logo" className="w-full h-auto" />
              </div>
            </Link>

            <div className="relative flex flex-col items-center sm:items-end  w-full md:w-auto mt-4 sm:mt-0">
              <div className=" underline hover:cursor-pointer text-primary">
                <span onClick={() => { window.open("https://lms-frontend-coral.vercel.app/home", "_blank") }} className="w-full rounded-full  text-primary mb-2  text-center sm:text-left">
                  Click to Visit Terapage Training Portal
                </span>

              </div>
              <div className="text-sm text-primary text-center sm:text-left mt-1 w-full md:w-auto">
                {userName !== '' && <span>You are logged in as <strong>{userName}</strong></span>}
                {isAdmin && (
                  <Link href={'/admin'}>
                    <span className="ml-2 cursor-pointer hover:underline">Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>

          </header>



          {/* Navigation Bar */}
          <nav className="bg-primary text-white py-2 px-4 md:px-8 flex justify-center items-center">

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-wrap justify-center space-x-2 md:space-x-4">
              <Link href={'/'}><div
                className={`flex items-center ${pathname === '/' ? 'text-primary bg-white' : 'text-white '}  px-4 py-2 rounded transition-colors `}
              >
                How to
              </div></Link>
              <Link href={'/howto'}><div
                className={`flex items-center text-white px-4 py-2 rounded transition-colors `}
              >
                Knowledge
              </div></Link>
              <Link href={'/howto'}><div
                className={`flex items-center text-white px-4 py-2 rounded transition-colors `}
              >
                Product Updates
              </div></Link>

            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes className="text-white text-2xl" /> : <FaBars className="text-white text-2xl" />}
              </button>
            </div>
          </nav>

          <div className={`md:hidden  ${isMenuOpen ? "block" : "hidden"} bg-primary text-white  py-4 px-8`}>
            <div className="space-y-4">
              <div className="flex items-center px-4 py-2 rounded transition-colors">
                {/* <FaHome className="mr-2" /> */}
                <Link href={'/home'}>How to</Link>
              </div>
              <div className="flex items-center  px-4 py-2 rounded transition-colors">
                {/* <FaHome className="mr-2" /> */}
                <Link href={'/home'}>Knowledge</Link>
              </div>
              <div className="flex items-center  px-4 py-2 rounded transition-colors">
                {/* <FaHome className="mr-2" /> */}
                <Link href={'/home'}>Product Updates</Link>
              </div>


            </div>

          </div>
        </>)}
    </>
  );
};

export default Navbar;