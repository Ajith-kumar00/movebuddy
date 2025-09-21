"use client";

import React, { useState, useEffect, useRef } from "react";
import { folderApi, FolderData } from "../../utils/api";

const Add = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string>("");
    const [title, setTitle] = useState("");
    const [publishingYear, setPublishingYear] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [userId, setUserId] = useState("user-123");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [imageProcessing, setImageProcessing] = useState(false);
    const [imageSize, setImageSize] = useState<string>("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {

            window.location.href = "/";
        }
    }, []);


    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {

                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;


                ctx?.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };

            img.src = URL.createObjectURL(file);
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {

            if (file.size > 5 * 1024 * 1024) {
                setMessage("Error: Image size must be less than 5MB");
                return;
            }

            setImage(file);
            setImageProcessing(true);
            setImageSize(formatFileSize(file.size));

            try {
                const compressedBase64 = await compressImage(file);
                setImageBase64(compressedBase64);
                setMessage("");


                const compressedSize = Math.round((compressedBase64.length * 3) / 4);
                setImageSize(`${formatFileSize(file.size)} → ${formatFileSize(compressedSize)} (compressed)`);
            } catch (error) {
                setMessage("Error: Failed to process image");
                console.error('Image processing error:', error);
            } finally {
                setImageProcessing(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");


        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const folderData: FolderData = {
            name: name || title,
            title: title,
            description: description,
            publishingYear: publishingYear ? parseInt(publishingYear) : undefined,
            image: imageBase64,
            userId: userId,
            status: "pending",
            tags: ["movie", "entertainment"],
            estimatedCost: 0,
            actualCost: 0
        };

        const result = await folderApi.create(folderData);

        if (result.success) {
            setMessage(result.message || "Movie created successfully!");
            console.log('Success:', result.data);


            setTitle("");
            setPublishingYear("");
            setName("");
            setDescription("");
            setImage(null);
            setImageBase64("");
            setImageSize("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setMessage("");
            }, 2000);
        } else {
            setMessage(`Error: ${result.error || 'Failed to create movie'}`);
            console.error('Error:', result.error);
        }

        setLoading(false);
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            {
                isMobile ? (
                    <div className="min-h-screen pt-[80px] px-[24px] bg-[#092C39]">


                        <div className="flex items-center justify-between mb-[60px]">
                            <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-8">
                                Create a new movie
                            </h1>
                        </div>

                        <div className="max-w-2xl mx-auto">

                            {message && (
                                <div className={`mb-6 p-4 rounded-lg ${message.includes("Error")
                                        ? "bg-red-500/20 border border-red-500 text-red-300"
                                        : "bg-green-500/20 border border-green-500 text-green-300"
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Title *"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-[#0A1E2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#2BD17E] transition-colors"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        placeholder="Publishing year *"
                                        value={publishingYear}
                                        onChange={(e) => setPublishingYear(e.target.value)}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
                                        className="w-full px-4 py-3 bg-[#0A1E2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#2BD17E] transition-colors"
                                    />
                                </div>

                                <div className="border-2 border-dashed border-white rounded-lg p-8 bg-[#0A1E2A] text-center hover:border-[#2BD17E] transition-colors cursor-pointer relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        disabled={imageProcessing}
                                    />
                                    <div className="flex flex-col items-center space-y-3">
                                        {imageProcessing ? (
                                            <>
                                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="text-white text-sm">Processing image...</p>
                                            </>
                                        ) : image ? (
                                            <div className="w-full h-48 flex flex-col items-center justify-center space-y-2">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                    className="max-w-full max-h-full object-contain rounded-lg"
                                                />
                                                {imageSize && (
                                                    <p className="text-gray-300 text-xs">{imageSize}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-8 h-8 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                <p className="text-white text-sm">Upload an image here</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTitle("");
                                            setPublishingYear("");
                                            setName("");
                                            setDescription("");
                                            setImage(null);
                                            setImageBase64("");
                                            setImageSize("");
                                            setMessage("");

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }

                                            if (timeoutRef.current) {
                                                clearTimeout(timeoutRef.current);
                                                timeoutRef.current = null;
                                            }
                                        }}
                                        disabled={loading}
                                        className="flex-1 py-3 px-6 border border-white rounded-lg text-white hover:bg-white hover:text-[#092C39] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading || !title.trim() || !image || !publishingYear}
                                        className="flex-1 py-3 px-6 bg-[#2BD17E] text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            'Submit'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-screen bg-[#092C39] relative">

                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A1E2A] to-transparent"></div>

                        <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">

                            <h1 className="text-white text-3xl font-semibold mb-12">
                                Create a new movie
                            </h1>


                            {message && (
                                <div className={`mb-6 p-4 rounded-lg ${message.includes("Error")
                                        ? "bg-red-500/20 border border-red-500 text-red-300"
                                        : "bg-green-500/20 border border-green-500 text-green-300"
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-white rounded-lg p-12 bg-[#0A1E2A] text-center hover:border-[#2BD17E] transition-colors cursor-pointer relative min-h-[400px] flex items-center justify-center">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                            disabled={imageProcessing}
                                        />
                                        <div className="flex flex-col items-center space-y-4">
                                            {imageProcessing ? (

                                                <>
                                                    <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <p className="text-white text-lg">Processing image...</p>
                                                </>
                                            ) : image ? (
                                                <div className="w-full h-80 flex flex-col items-center justify-center space-y-2">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt="Preview"
                                                        className="max-w-full max-h-full object-contain rounded-lg"
                                                    />
                                                  
                                                </div>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="w-12 h-12 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        />
                                                    </svg>
                                                    <p className="text-white text-lg">Drop an image here</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">



                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Title *"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="w-full px-4 py-4 bg-[#0A1E2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#2BD17E] transition-colors text-lg"
                                        />
                                    </div>



                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Publishing year 2026 *"
                                            value={publishingYear}
                                            onChange={(e) => setPublishingYear(e.target.value)}
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                            className="w-full px-4 py-4 bg-[#0A1E2A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#2BD17E] transition-colors text-lg"
                                        />
                                    </div>

                                    <div className="flex space-x-4 pt-8">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTitle("");
                                                setPublishingYear("");
                                                setName("");
                                                setDescription("");
                                                setImage(null);
                                                setImageBase64("");
                                                setImageSize("");
                                                setMessage("");

                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }

                                                if (timeoutRef.current) {
                                                    clearTimeout(timeoutRef.current);
                                                    timeoutRef.current = null;
                                                }
                                            }}
                                            disabled={loading}
                                            className="flex-1 py-4 px-8 border border-white rounded-lg text-white hover:bg-white hover:text-[#092C39] transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading || !title.trim() || !image || !publishingYear}
                                            className="flex-1 py-4 px-8 bg-[#2BD17E] text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : (
                                                'Submit'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

        </>

    );
};
export default Add