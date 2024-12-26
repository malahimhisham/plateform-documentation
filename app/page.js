"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowRightLong } from "react-icons/fa6";

export default function Home() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter()

  useEffect(() => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }

    const authToken = getCookie("authToken");
    const userName = getCookie("userName");

    if (authToken && userName) {
      router.push('/howto')
    }
  }, [])

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // If the input is a number and not empty
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input field
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle pasting of OTP
  const handleOtpPaste = (e) => {
    const pastedValue = e.clipboardData.getData('Text');
    if (/^\d{6}$/.test(pastedValue)) {
      setOtp(pastedValue.split(''));
    }
  };

  // Handle email input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handle password input change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle OTP form submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join('') }),
      });

      const data = await response.json();
      if (response.ok) {
        // localStorage.setItem("authToken", data.token);
        // localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`)
        document.cookie = `authToken=${data.token}; path=/;  secure; SameSite=None;}`;
        document.cookie = `userName=${data.user.firstName} ${data.user.lastName}; path=/;  secure; SameSite=None;}`;

        toast.success(data.message);
        router.push('/howto')
        setEmail("");
        setOtp(['', '', '', '', '', '']);
        setIsLoginSuccessful(false);
        setLoading(false);
        window.location.reload();
      } else {
        toast.error(data.message);
        setError(data.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP.");
      setError("An error occurred while verifying OTP.");
    }
  };

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      toast.success('OTP sent to your email');
      setPassword("");
      setIsLoginSuccessful(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleOtpSubmit(e);
    }
  };

  const slides = [
    { image: '/login1.png', text: 'Collaborate with experts worldwide' },
    { image: '/login2.png', text: 'Enhance your research capabilities' },
    { image: '/login3.png', text: 'Discover new learning pathways' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side - slideshow */}
      <div className="w-full lg:w-1/2 bg-purple-200 flex flex-col items-center justify-center relative p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{slides[currentSlide].text}</h2>
        <div className="relative w-full max-w-md h-80">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].text}
            className="w-full h-full object-contain rounded-lg shadow-md"
          />
        </div>
        <div className="flex space-x-2 mt-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#6610f2]' : 'bg-gray-300'
                }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6">
          <div className="flex justify-center mb-4">
            <img src='/logo.png' className="w-1/3 md:w-1/2" alt="Logo" />
          </div>
          {!isLoginSuccessful ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6610f2] focus:border-[#6610f2] sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6610f2] focus:border-[#6610f2] sm:text-sm"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full bg-[#6610f2] text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6610f2]"
                aria-label="Sign in"
                disabled={loading}
              >
                {loading ? 'Signing in ...' : 'Sign in'} <FaArrowRightLong />
              </button>
            </form>
          ) : (
            <>
              <label className="block text-sm font-bold text-gray-700">
                Authentication Code
              </label>
              <div className="flex space-x-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e, index)}
                    placeholder="0"
                    className="w-10 p-2 border text-center focus:outline-none focus:ring-[#6610f2] focus:border-[#6610f2]"
                    onPaste={handleOtpPaste} // Allow pasting
                    onKeyDown={handleKeyDown}
                  />
                ))}
              </div>
              <button
                onKeyDown={handleKeyDown}
                onClick={handleOtpSubmit}
                className="w-full bg-[#6610f2] text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6610f2]"
                disabled={loading}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}