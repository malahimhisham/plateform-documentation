"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Home1 from "./Home1";

const UpdateCategorySession = ({ setUpdateSessionPopup, sessionData }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
     const [content, setContent] = useState(sessionData.desc || "");
     const [popularity, setPopularity] = useState(sessionData.popularity || 0); 
    

    // File type validation function
    const validateFile = (file, type) => {
        const validTypes = {
            video: ['video/mp4', 'video/webm', 'video/ogg'],
            audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
            image: ['image/jpeg', 'image/png', 'image/gif']
        };
        const fileType = file.type;

        if (validTypes[type].includes(fileType)) {
            return true; // File type is valid
        } else {
            toast.error(`Please select a valid ${type} file.`);
            return false; // File type is invalid
        }
    };

    // Handle file selection based on content type
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];

        if (!file) return; // Exit if no file is selected

        if (type === "video") {
            if (validateFile(file, "video")) {
                setVideoFile(file);
            } else {
                setVideoFile(null);
            }
        } else if (type === "audio") {
            if (validateFile(file, "audio")) {
                setAudioFile(file);
            } else {
                setAudioFile(null);
            }
        } else if (type === "image") {
            if (validateFile(file, "image")) {
                setImageFile(file);
            } else {
                setImageFile(null);
            }
        }
    };

    const handleUpdateSession = async () => {

        if (!content && !videoFile && !audioFile && !imageFile) {
            return toast.error("Please provide a description, video, audio, or image to update the session");
        }

        const formData = new FormData();
        formData.append("desc", content);
        formData.append("popularity", popularity);

        // Append files based on the selected content type
        if (videoFile) {
            formData.append("video", videoFile);
        }
        if (audioFile) {
            formData.append("audio", audioFile);
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
     
            setLoading(true);
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
                return null;
              }
          
              const token = getCookie('authToken');

            // Send PUT request to update the session
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategorysession1/update/${sessionData._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure the token is available
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                return toast.error(errorData.message || "Section update failed");
            }

            toast.success("Section updated successfully");
            setContent("")
            setUpdateSessionPopup(false);
        } catch (error) {
            toast.error("Error updating section");
        }finally{
            setLoading(false);
            setUpdateSessionPopup(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-300 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80  max-h-[80%] overflow-y-auto  sm:w-[40vw] md:w-[50vw] lg:w-[60vw]">
                <h3 className="text-lg font-bold mb-4">Update Section</h3>

                <div className="mb-4">
                    <label htmlFor="popularity" className="block text-sm font-semibold mb-1">
                        Popularity (0 to 100)
                    </label>
                    <input
                        type="range"
                        id="popularity"
                        min="0"
                        max="100"
                        value={popularity}
                        onChange={(e) => setPopularity(e.target.value)}
                        className="w-full accent-primary"
                    />
                    <div className="text-sm text-gray-600">Popularity: {popularity}</div>
                </div>

                {/* Description Field */}
                {sessionData.desc && <div className="mb-4">
                        <label htmlFor="desc" className="block text-sm font-semibold mb-1">
                            Description
                        </label>
                        <Home1 setContent={setContent} content={content} />
                    </div>}

                {/* Video File Input */}
                {sessionData.video && (
                    <div className="mb-4">
                        <label htmlFor="video" className="block text-sm font-semibold mb-1">
                            Upload Video
                        </label>
                        <input
                            type="file"
                            id="video"
                            onChange={(e) => handleFileChange(e, "video")}
                            className="border rounded-lg w-full p-2"
                            accept="video/mp4,video/webm,video/ogg"
                        />
                    </div>
                )}

                {/* Audio File Input */}
                {sessionData.audio && (
                    <div className="mb-4">
                        <label htmlFor="audio" className="block text-sm font-semibold mb-1">
                            Upload Audio
                        </label>
                        <input
                            type="file"
                            id="audio"
                            onChange={(e) => handleFileChange(e, "audio")}
                            className="border rounded-lg w-full p-2"
                            accept="audio/mpeg,audio/wav,audio/ogg"
                        />
                    </div>
                )}

                {/* Image File Input */}
                {sessionData.image && (
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-semibold mb-1">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            onChange={(e) => handleFileChange(e, "image")}
                            className="border rounded-lg w-full p-2"
                            accept="image/jpeg,image/png,image/gif"
                        />
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleUpdateSession}
                        className="bg-primary text-white rounded px-4 py-2 hover:bg-[#2c234d] transition disabled:opacity-50"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="spinner-border animate-spin border-2 border-t-2 border-gray-400 w-4 h-4 rounded-full"></div>
                            </div>
                        ) : (
                            "Update"
                        )}
                    </button>
                    <button
                        onClick={() => setUpdateSessionPopup(false)}
                        className="ml-2 border rounded px-4 py-2 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateCategorySession;
