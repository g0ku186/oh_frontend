import React, { useState } from 'react'

import axios from 'axios';
import RingLoader from "react-spinners/RingLoader";
import { getIdToken } from 'firebase/auth';

import { userAuth } from "../context/AuthContext";
import { useGlobalContext } from '@/context/GlobalContext';

import OrientationDropDown from './OrientationDropDown';
import StyleDropDown from './StyleDropDown';
import Tooltip from './Tootip';

import { samplePrompts } from '@/constants/constants';
import { toolTipTexts } from '@/constants/constants';
import { RightArrowIcon } from './Icons';
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const baseUrl = process.env.API_BASE_URL

const AdvancedSettings = ({ instructions, setInstructions, negativePrompt, setNegativePrompt, guidance_scale, onGuidanceChange, seed, setSeed }) => {
    const inputClasses = 'w-full px-2 py-1 border text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary rounded-md';
    return (
        <div className='flex flex-col my-4 space-y-4 grow'>
            <div>
                <label className='text-sm'>Prompt</label>
                <textarea rows={4} type="text" value={instructions} onChange={(e) => setInstructions(e.target.value)} className={inputClasses} />
            </div>
            <div>
                <label className='text-sm'>Negative Prompt</label>
                <textarea rows={4} type="text" defaultValue={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className={inputClasses} />
            </div>
            <div className='flex flex-row space-x-2 text-sm'>
                <label className='text-sm flex items-start'>Guidance Scale <Tooltip text={toolTipTexts.guidance_scale} color='text-white' /></label>
                <input type="number" step="0.5" value={guidance_scale} onChange={onGuidanceChange} className={inputClasses} />
                <label className='text-sm flex items-start'>Seed <Tooltip text={toolTipTexts.seed} color='text-white' /></label>
                <input type="number" defaultValue={seed} onChange={(e) => setSeed(e.target.value)} className={inputClasses} />
            </div>
        </div>
    )
}

function CreateImage({ handleTabChange }) {
    const defaultNegativePrompt = '[worst quality], [low quality], bad legs, bad arms, deformed body parts, low res, blurry, worst quality, extra limbs, bad quality, ugly, text, logo, signature, greyscale, bokeh, sepia, monochrome, disfigured, bad anatomy, extra limbs, bokeh, poorly drawn, washed out, zombie, (interlocked fingers:1.2), multiple views';
    const { images, setImages, eta, setEta, setNewCount, handleShowNotification } = useGlobalContext();
    const [expertMode, setExpertMode] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [orientation, setOrientation] = useState('square');
    const [style, setStyle] = useState('anime');
    // const [highQuality, setHighQuality] = useState(false);
    const [negativePrompt, setNegativePrompt] = useState(defaultNegativePrompt);
    const [guidance_scale, setGuidanceScale] = useState(6);
    const [seed, setSeed] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = userAuth();


    const onGuidanceChange = (e) => {
        let value = Number(e.target.value);
        if (value < 0) value = 0;
        if (value > 20) { value = 20 };
        setGuidanceScale(value);
    }

    const handleInspireClick = () => {
        const randomIndex = Math.floor(Math.random() * samplePrompts.length);
        setInstructions(samplePrompts[randomIndex]);
    }

    const handleArrowClick = async () => {

        if (images[0].status === 'limit_exceeded') {
            handleShowNotification({ "title": "You have exceeded your daily free limit. Please check back tomorrow." }, 'error');
            return;
        }


        try {
            if (user && user.emailVerified) {
                if (instructions.trim().length === 0) {
                    handleShowNotification({ "title": "Please enter a prompt" }, "error");
                    return;
                }
                setLoading(true);
                handleTabChange('My Generations');
                const prompt = instructions;
                const negative_prompt = negativePrompt;
                const idToken = await getIdToken(user);
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': idToken
                }
                const payLoad = {
                    instructions: prompt.trim(),
                    image_orientation: orientation,
                    // high_quality: highQuality,
                    negative_prompt: negative_prompt,
                    guidance_scale: guidance_scale,
                    seed: seed,
                    style: style
                }
                const response = await axios.post(`${baseUrl}/api/v1/generateImage`, payLoad, { headers: headers });
                setImages((prevImages) => {
                    return [...response.data, ...prevImages];
                });
                setNewCount((prevCount) => {
                    return prevCount + response.data.length;
                }
                );
                setEta(Math.floor(response.data[0].eta));

            } else {
                if (!user) {
                    handleShowNotification({ "title": "You must login to continue image generation" }, 'error');
                    return;
                }
                if (!user.emailVerified) {
                    handleShowNotification({ "title": "You must verify your email to continue image generation" }, 'error');
                    return;
                }
            }
        } catch (err) {

            if (err.response.data.status === 'limit_exceeded') {
                const newImage = {
                    status: err.response.data.status,
                }
                //await for 5 secs
                await new Promise(r => setTimeout(r, 5000));
                setImages((prevImages) => {
                    return [newImage, ...prevImages];
                });
            }

            //Coz when it is limit_exceeded, we are showing a blur image view. We want user to focus more on that than the notification
            //hence disabling notification just when error is 'limit_exceeded'
            if (err.response.data.status !== 'limit_exceeded') {
                handleShowNotification({ "title": err.response.data.message }, 'error');
            }


        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-start justify-center min-h-full p-10 sm:p-12 md:p-24 w-full">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-medium sm:font-bold text-left text-zinc-100 mb-5 font-serif">Create any hentai</h1>
            <div className="relative w-full max-w-4xl">
                {!expertMode ? (<>
                    <textarea
                        type="text"
                        rows={3}
                        placeholder="Enter detailed instructions"
                        className="w-full px-4 py-2 mb-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                        <RightArrowIcon className="w-6 h-6 text-gray-500 hover:text-primary cursor-pointer" onClick={handleArrowClick} />
                    </div>
                </>) : (

                    <AdvancedSettings instructions={instructions} negativePrompt={negativePrompt} guidance_scale={guidance_scale} seed={seed} setInstructions={setInstructions} setNegativePrompt={setNegativePrompt} onGuidanceChange={onGuidanceChange} setSeed={setSeed} />)}

            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-center md:space-x-4 mt-2 space-y-4 md:space-y-0'>
                <button
                    onClick={handleArrowClick}
                    className="px-2 md:px-4 py-2 text-sm font-bold text-white bg-primary rounded-md border border-primary hover:bg-primaryDark "
                >
                    Generate
                </button>
                <button
                    onClick={handleInspireClick}
                    className="px-2 md:px-4 py-2 text-sm font-bold text-white rounded-md border hover:bg-black hover:bg-opacity-25 hover:border-black"
                >
                    Show me an example
                </button>
                <div className='flex items-center space-x-2'>
                    <StyleDropDown style={style} setStyle={setStyle} />
                    <OrientationDropDown orientation={orientation} setOrientation={setOrientation} />
                    {/* <HighQualityToggle highQuality={highQuality} setHighQuality={setHighQuality} /> */}
                </div>
                <div className='text-sm underline flex cursor-pointer' onClick={() => setExpertMode(!expertMode)}>

                    {expertMode ? <><p>Hide additional settings</p> <ChevronUpIcon className='w-5 h-5 ml-1' /></> : (<><p>Show additional settings</p> <ChevronDownIcon className='w-5 h-5 ml-1' /></>)}
                </div>

            </div>

            {loading && (<div className='mt-4'>
                <RingLoader color="#36d7b7" />
                <p>Please hold on...</p>
            </div>)}
        </div>
    );
}

export default CreateImage
