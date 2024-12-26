"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaPrint } from 'react-icons/fa';
import '../admin/HowTo/table.modules.css'

export default function Home() {
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [subSearchQuery, setSubSearchQuery] = useState("");

    const [sortOption, setSortOption] = useState("default"); // Default sorting
    const [filteredSections, setFilteredSections] = useState([]);

    const [section, setSection] = useState([])
    const router = useRouter();

    const sectionRef = useRef();

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
            setToken(authToken);
            setUserName(userName);
        } else {
            toast.error("Please login first");
            router.push('/')
        }
    }, [router]);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategory1/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setCategories(data.categories);
                    setFilteredCategories(data.categories);
                    setSection(data.categories)
                    setSelectedCategory(data.categories[0]);

                } else {
                    setCategories([]);
                    setFilteredCategories([]);
                    setSection([])
                    setFilteredSections([])
                }
            } catch (error) {
                console.log("Network error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [token]);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories();
            fetchSessions(selectedCategory._id)
        }

    }, [selectedCategory]);
    useEffect(() => {
        if (selectedSubCategory) {
            fetchSubSessions(selectedSubCategory._id);
        }
    }, [selectedSubCategory]);

    const fetchSubSessions = async (id) => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        const token = getCookie('authToken');
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/psubcategorysession1/search/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {

                setSection(data.sessions);
                setFilteredSections(data.sections);
                console.log("data.subsessions", data.sessions)
            } else {
                setSection([])
                setFilteredSections([])
            }
        } catch (error) {
            console.log("Network error:", error);
        } finally {
            setLoading(false)
        }
    };

    const fetchSessions = async (id) => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        const token = getCookie('authToken');
        setLoading(true)
        try {
            // console.log("selectedCourse._id", category._id)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategorysession1/search/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setSection(data.sessions);
                console.log("data.sessions", data.sessions)
                setFilteredSections(data.sections);
            } else {
                setSection([])
                setFilteredSections([]);
            }
        } catch (error) {
            console.log("Network error:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const sortedSections = [...section];
        if (sortOption === "sortA-Z") {
            sortedSections.sort((a, b) => a.desc.localeCompare(b.desc)); // Sort A-Z by `desc`
        } else if (sortOption === "sortLastUpdated") {
            sortedSections.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by `lastUpdated`
        } else if (sortOption === "sortByPopularity") {
            sortedSections.sort((a, b) => b.popularity - a.popularity); // Sort by popularity (higher values first)
        }
        setFilteredSections(sortedSections);
    }, [sortOption, section]);



    const fetchSubCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/psubcategory1/all?categoryAssign=${selectedCategory._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setSubCategories(data.pSubCategory1s);
                // setSelectedSubCategory(data.pSubCategory1s[0])
                setFilteredSubCategories(data.pSubCategory1s);
            } else {
                setSubCategories([]);
                setSection([])
                setFilteredSections([])
            }
        } catch (error) {
            console.log("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    const handleSubCategorySearch = (e) => {
        setSubSearchQuery(e.target.value);
        const filtered = subCategories.filter((subCategory) =>
            subCategory.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredSubCategories(filtered);
    };



    const captureVideoScreenshot = (videoElement) => {
        if (!videoElement) {
            console.error('No video element found.');
            return null;
        }

        // Ensure the video is ready to be drawn onto a canvas
        if (videoElement.readyState >= 3) { // `HAVE_FUTURE_DATA` state (video is ready to be drawn)
            // Set cross-origin policy
            videoElement.crossOrigin = 'anonymous';  // Enables cross-origin access

            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            try {
                return canvas.toDataURL(); // returns base64 image URL
            } catch (e) {
                console.error('Error capturing screenshot:', e);
                return null;
            }
        } else {
            console.error('Video is not ready to be drawn.');
            return null;
        }
    };



    const handlePrint = () => {
        if (!filteredSections || filteredSections.length === 0) {
            toast.error("Data is still loading, please wait.");
            return;
        }

        // Select all video elements
        const videoElements = document.querySelectorAll('video');
        const screenshots = [];

        // Capture screenshots for each video
        videoElements.forEach((videoElement) => {
            const screenshotDataUrl = captureVideoScreenshot(videoElement);
            if (screenshotDataUrl) {
                screenshots.push(screenshotDataUrl);
            }

            videoElement.removeAttribute('controls');
            videoElement.removeAttribute('autoplay');
            videoElement.removeAttribute('crossorigin');
            // videoElement.removeAttribute('class');
        });

        // If no screenshots were captured, return early
        if (screenshots.length === 0) {
            toast.error("Failed to capture video screenshots.");
            return;
        }

        // Create a temporary element to print the specific content (including the screenshots)
        const contentToPrint = document.getElementById('content-to-print').innerHTML;
        const newWindow = window.open('', '_blank');
        newWindow.document.write('<html><head><title>Print</title><style>body { font-family: Arial, sans-serif; } img { max-width: 100% ;  margin-top: 10px; } video { max-width: 100% ; margin-top: 10px; } audio { max-width: 100% ;  margin-top: 10px; } </style></head><body>');

        // Replace video tags with the corresponding screenshot for each video
        let updatedContent = contentToPrint;
        screenshots.forEach((screenshotDataUrl) => {
            updatedContent = updatedContent.replace('<video>', `<img src="${screenshotDataUrl}" alt="Video Screenshot" />`);
        });

        newWindow.document.write(updatedContent);

        newWindow.document.write('</body></html>');
        newWindow.document.close();

        // Ensure everything is loaded before printing
        setTimeout(() => {
            newWindow.print();
        }, 500);  // Delay to ensure everything is loaded
    };





    return (
        <>
            {/* Header */}
            <motion.div
                className="flex justify-between w-full px-6 md:px-8 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="font-bold text-sm sm:text-base md:text-lg lg:text-2xl">
                    Platform Documentation
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 md:mt-0">
                    <span >
                        Platform Documentation
                    </span>{" "}
                    {selectedCategory && (
                        <>
                            /{" "}
                            <span
                                onClick={() => { setSelectedSubCategory(null); fetchSessions(selectedCategory._id) }}
                                className="hover:underline cursor-pointer"
                            >
                                {selectedCategory?.name || "Platform"}
                            </span>
                        </>
                    )}{" "}
                    {selectedSubCategory && (
                        <span>
                            / {selectedSubCategory?.name || "no subcategory selected"}
                        </span>
                    )}
                </p>

            </motion.div>


            {/* Main Content with animation */}
            <motion.div
                className="flex flex-col lg:flex-row flex-wrap-reverse lg:flex-nowrap min-h-[680px] px-4 lg:px-8"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
            >
                {/* Right Sidebar */}
                {selectedCategory && <motion.div
                    className="lg:w-1/5 bg-white p-4 lg:ml-5 my-8 shadow-xl order-1 lg:order-3"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >

                    <h2 className="font-bold mb-4">Subcategories</h2>
                    <input
                        type="text"
                        placeholder="Search subcategories..."
                        value={subSearchQuery}
                        onChange={handleSubCategorySearch}
                        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                    />
                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredSubCategories.length > 0 ? (
                        <ul>
                            {filteredSubCategories.map((subCategory) => (
                                <li key={subCategory._id}
                                    onClick={() => setSelectedSubCategory(subCategory)}
                                    className={`cursor-pointer hover:underline p-2 ${selectedSubCategory?._id === subCategory._id
                                        ? "font-bold text-primary"
                                        : "text-gray-700"
                                        }`}
                                >
                                    {subCategory.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No subcategories found</p>
                    )}
                </motion.div>}



                {/* Main Content */}
                <motion.div
                    className="flex-1 bg-white p-4 lg:p-14 my-8 shadow-xl order-2 lg:order-2 relative" // Adjusted padding for responsiveness
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Print Icon */}
                    <div className="absolute top-4 left-4">
                        <FaPrint
                            onClick={handlePrint}
                            className="cursor-pointer text-2xl text-gray-600"
                        />
                    </div>
                    {/* Dropdown Filter */}
                    <div id="dropdown-filter" className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md">
                        <select
                            className="w-full p-2 border rounded-md bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="default" className="bg-primary text-white">Default</option>
                            <option value="sortA-Z" className="bg-primary text-white">Sort A-Z</option>
                            <option value="sortLastUpdated" className="bg-primary text-white">Sort by Last Updated</option>
                            <option value="sortByPopularity">Sort by Popularity</option>
                        </select>
                    </div>

                    <div id="content-to-print">


                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredSections && filteredSections.length > 0 ? (
                            filteredSections.map((section) => (
                                <div key={section._id} className="mb-4">
                                    {/* Display section description */}
                                    {section.desc && <p className="font-bold mt-14 prose text-lg lg:text-xl mx-4 md:mx-8" dangerouslySetInnerHTML={{ __html: section.desc }} />} {/* Added responsive margins */}

                                    {/* Display video if available */}
                                    {section.video && (
                                        <div className="mt-12 flex justify-center mx-4 md:mx-8">
                                            <video controls autoPlay crossOrigin="anonymous" muted className="max-w-[90%] h-auto">
                                                <source src={section.video} type="video/mp4" />
                                            </video>
                                        </div>
                                    )}

                                    {/* Display image if available */}
                                    {section.image && (
                                        <div className="mt-12 flex justify-center mx-4 md:mx-8"> {/* Added responsive margins */}
                                            <img src={section.image} alt="Section" className="max-w-[90%] h-auto rounded-sm" />
                                        </div>
                                    )}

                                    {/* Display audio if available */}
                                    {section.audio && (
                                        <div className="mt-12 mx-4 md:mx-8"> {/* Added responsive margins */}
                                            <audio controls className="w-full">
                                                <source src={section.audio} type="audio/mp3" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No Section found</p>
                        )}
                    </div>

                    {
                        loading ? (
                            <p>Loading...</p>
                        ) : section && section.length > 0 && (
                            (() => {
                                console.log("clg", section);

                                // Flatten the data arrays safely and handle empty data arrays
                                const latestUpdatedAt = section
                                    .flatMap((session) => session.data || [])  // Safely access session.data (fallback to empty array if undefined)
                                    .reduce((latest, item) => {
                                        // Only process items that have an updatedAt field
                                        if (item.updatedAt) {
                                            const itemUpdatedAt = new Date(item.updatedAt);
                                            return itemUpdatedAt > new Date(latest) ? item.updatedAt : latest;
                                        }
                                        return latest;
                                    }, section[0]?.updatedAt || '');  // Initialize with the first session's updatedAt if available

                                console.log("latestUpdatedAt", latestUpdatedAt);

                                return (
                                    <div>
                                        {latestUpdatedAt && (
                                            <div className="absolute bottom-4 right-4 text-sm text-gray-500 font-medium">
                                                Last Updated: {new Date(latestUpdatedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        )
                    }



                </motion.div>

                {/* Left Sidebar */}
                <motion.div
                    className="lg:w-1/5 bg-white p-4 my-8 lg:mr-5 shadow-xl order-3 lg:order-1"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="font-bold mb-4">Categories</h2>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={handleCategorySearch}
                        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                    />
                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredCategories.length > 0 ? (
                        <ul>
                            {filteredCategories.map((category) => (
                                <li
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`cursor-pointer p-2 ${selectedCategory?._id === category._id
                                        ? "font-bold text-primary"
                                        : "text-gray-700"
                                        }`}
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No categories found</p>
                    )}
                </motion.div>
            </motion.div>

        </>
    );
}
