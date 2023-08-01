import React, { useState, useEffect } from 'react'
import { RightArrowIcon } from './Icons';
import axios from 'axios';
import CircularProgressBar from './ProgressBar';
import RingLoader from "react-spinners/RingLoader";
import Image from 'next/image';
import { userAuth } from "../context/AuthContext";
import { getIdToken } from 'firebase/auth';
const baseUrl = process.env.API_BASE_URL
const baseImgLink = `${process.env.API_BASE_URL}/generations`;

const ProgressBar = ({ percentage }) => {
    return (
        <CircularProgressBar
            selectedValue={percentage}
            maxValue={100}
            radius={100}
            activeStrokeColor='#0f4fff'
            withGradient
        />)
}

function CreateImage({ setImages }) {
    const [instructions, setInstructions] = useState('');
    const [imgId, setImgId] = useState('');
    const [imgUrls, setImgUrls] = useState([]);
    const [status, setStatus] = useState('');
    const [eta, setEta] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [shouldCheckImage, setShouldCheckImage] = useState(false);
    const [lastSubmittedInstructions, setLastSubmittedInstructions] = useState('');
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

    useEffect(() => {
        let interval;
        if (eta) {
            setCountdown(eta);
            interval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 0) {
                        return 5;
                    } else {
                        return prevCountdown - 1;
                    }
                });
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [eta]);

    useEffect(() => {
        if (status === 'processing' && countdown <= 5) {
            setShouldCheckImage(true);
        } else {
            setShouldCheckImage(false);
        }
    }, [status, countdown]);

    useEffect(() => {
        let interval2;
        console.log('Calling interval 2')
        if (shouldCheckImage) {
            interval2 = setInterval(() => {
                console.log('Calling axios')
                console.log(imgUrls[0])
                axios.get(imgUrls[0])
                    .then((response) => {
                        if (response.status === 200) {
                            setStatus('success');
                            const newImages = imgUrls.map((url) => {
                                const thisImgId = url.split('/').pop().replace('.png', '');
                                return {
                                    imgId: thisImgId,
                                    imgLink: url,
                                    prompt: lastSubmittedInstructions,
                                    bookmark: false,
                                    upscaled: false,
                                }
                            })
                            console.log('New Images are:')
                            console.log(newImages);
                            setImages((prevImages) => {
                                return [...newImages, ...prevImages];
                            });
                            clearInterval(interval2);
                        }
                    }).catch(() => { });
            }, 5000);
        }
        return () => {
            clearInterval(interval2);
        };
    }, [shouldCheckImage, imgId]);

    const handleInspireClick = () => {
        const randomIndex = Math.floor(Math.random() * samplePrompts.length);
        setInstructions(samplePrompts[randomIndex]);
    }

    const generateImgUrls = (imgId) => {
        const urls = [];
        for (let i = 0; i < 2; i++) {
            urls.push(`${baseImgLink}/${i}-${imgId}.png`);
        }
        console.log('Image Urls are')
        console.log(urls)
        setImgUrls(urls);
    }

    const handleArrowClick = async () => {
        if (user) {
            setStatus('loading');
            const instruction = instructions;
            setLastSubmittedInstructions(instruction);
            setInstructions('');
            const idToken = await getIdToken(user);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': idToken
            }
            const response = await axios.post(`${baseUrl}/api/v1/generateImage`, { instructions: instruction }, { headers: headers });
            setImgId(response.data.imgId);
            generateImgUrls(response.data.imgId);
            setStatus(response.data.status);
            setEta(Math.floor(response.data.eta) + 10);
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

            {status &&
                <>
                    <h2 className="mt-8 text-2xl">{status === "success" ? "Generated Image" : "Generating Image"}</h2>
                    {status === 'loading' &&
                        <div>
                            <p>{lastSubmittedInstructions}</p>
                            <RingLoader color="#36d7b7" />
                            <p>Please hold on...</p>
                        </div>
                    }
                    {status === 'processing' &&
                        <div className='mt-4'>
                            <ProgressBar percentage={Math.floor(((eta - countdown) / eta) * 100)} />
                            <p className='mt-4'>Image ETA: {countdown} seconds</p>
                        </div>
                    }
                    {status === 'success' &&
                        <>
                            <p className='mb-4'>{lastSubmittedInstructions}</p>
                            <div className="flex flex-col items-center justify-center">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {imgUrls.map((url, index) => {
                                        return (
                                            <div key={index} className="flex flex-col items-center justify-center">
                                                <img src={url} alt="Generated Image" className='h-auto w-96' />
                                                <p className="text-sm text-gray-500">Image {index + 1}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </div>
    );
}

export default CreateImage
