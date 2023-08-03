import React, { useState, useEffect } from 'react'
import { RightArrowIcon } from './Icons';
import axios from 'axios';
import RingLoader from "react-spinners/RingLoader";
import Image from 'next/image';
import { userAuth } from "../context/AuthContext";

import { useGlobalContext } from '@/context/GlobalContext';
import { getIdToken } from 'firebase/auth';
const baseUrl = process.env.API_BASE_URL
const baseImgLink = `${process.env.API_BASE_URL}/generations`;

function CreateImage({ handleTabChange }) {
    const { setImages, eta, setEta, setNewCount } = useGlobalContext();
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = userAuth();
    // const samplePrompts = [
    //     'realistic, 1girl, ponytail, parted lips, blush, makeup, light smile, white hair, sportswear, skirt, see through clothes, visible nipples, perfect tits, glow, thighs, purple eye, bare shoulders, collarbone, narrow waist, sunbeam, sunlight, rose, wind, nude, (masterpiece), sweat,',
    //     'absurdres, 1girl, nude, red hair, long hair, forest,',
    //     'absurdres, 1girl, 1boy, vaginal, doggystyle, sex, blonde hair, nude, bra, bottomless,',
    //     'masterpiece, best quality, 1girl, 1boy, very long hair, nude, red eyes, black hair, fellatio, nipples, penis, room,',
    //     'masterpiece, best quality, 1girl, standing, train interior, brown eyes, pointing at viewer, (police), angry, hat, pants,',
    //     'masterpiece, best quality, 1girl, 1boy, spread legs, sex, nude, medium breasts, penis, vaginal, open mouth, brown eyes, long hair, cum, black hair, on bed, pov, stomach bulge,'
    // ]

    const samplePrompts = [
        'masterpiece, best quality, 1girl, white hair, green eyes, looking up, floating hair, butterfly, from side, wings, nature,',
        'masterpiece, best quality, 1girl, long hair, glasses, burger, bored, braid,',
        'masterpiece, best quality, 1girl, standing, train interior, brown eyes, pointing at viewer, (police), angry, hat, pants,',
        'masterpiece, best quality, 1girl, long black hair, smiling, gym, karate, fighting,'
    ]

    const handleInspireClick = () => {
        const randomIndex = Math.floor(Math.random() * samplePrompts.length);
        setInstructions(samplePrompts[randomIndex]);
    }

    // const generateImgUrlsAndSetImages = (newImages) => {
    //     setImages((prevImages) => {
    //         return [...newImages, ...prevImages];
    //     });
    //     setNewCount((prevCount) => {
    //         return prevCount + newImages.length;
    //     }
    //     )
    // }

    const handleArrowClick = async () => {
        if (user) {
            setLoading(true);
            handleTabChange('My Generations');
            const prompt = instructions;
            setInstructions('');
            const idToken = await getIdToken(user);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': idToken
            }
            const response = await axios.post(`${baseUrl}/api/v1/generateImage`, { instructions: prompt, image_orientation: "portrait" }, { headers: headers });
            // generateImgUrlsAndSetImages(response.data);
            setImages((prevImages) => {
                return [...response.data, ...prevImages];
            });
            setNewCount((prevCount) => {
                return prevCount + response.data.length;
            }
            );

            setLoading(false);
            setEta(Math.floor(response.data[0].eta));

        } else {
            console.log('You must login to continue generation');
        }
    }
    return (
        <div className="flex flex-col items-start justify-center min-h-full p-24">
            <h1 className="text-4xl font-bold text-center text-zinc-100 mb-5">Create any image</h1>
            <div className="relative w-full max-w-4xl">
                <input
                    type="text"
                    placeholder="Enter detailed instructions"
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleArrowClick();
                        }
                    }
                    }
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <RightArrowIcon className="w-6 h-6 text-gray-500 hover:text-blue-500 cursor-pointer" onClick={handleArrowClick} />
                </div>
            </div>
            <div className='flex space-x-4'>
                <button
                    onClick={handleArrowClick}
                    className="mt-5 px-4 py-3 text-sm font-bold text-white bg-secondary rounded-md shadow-sm hover:bg-black border"
                >
                    Generate
                </button>
                <button
                    onClick={handleInspireClick}
                    className="mt-5 px-4 py-3 text-sm font-bold text-white rounded-md border hover:bg-secondary"
                >
                    Show me an example
                </button>
            </div>

            {loading && (<div>
                <RingLoader color="#36d7b7" />
                <p>Please hold on...</p>
            </div>)}
        </div>
    );
}

export default CreateImage
