import React, { useState, useEffect } from 'react'
import { RightArrowIcon } from './Icons';
import axios from 'axios';
import RingLoader from "react-spinners/RingLoader";
import Image from 'next/image';
import { userAuth } from "../context/AuthContext";
import OrientationDropDown from './OrientationDropDown';
import HighQualityToggle from './HighQualityToggle';
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import StyleDropDown from './StyleDropDown';

import { useGlobalContext } from '@/context/GlobalContext';
import { getIdToken } from 'firebase/auth';
const baseUrl = process.env.API_BASE_URL

const AdvancedSettings = ({ instructions, setInstructions, negativePrompt, setNegativePrompt, guidance_scale, setGuidanceScale, seed, setSeed }) => {
    const inputClasses = 'w-full px-2 py-1 border text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary rounded-md';
    return (
        <div className='flex flex-col my-4 space-y-4 grow'>
            <div>
                <label className='text-sm'>Prompt</label>
                <textarea rows={4} type="text" defaultValue={instructions} value={instructions} onChange={(e) => setInstructions(e.target.value)} className={inputClasses} />
            </div>
            <div>
                <label className='text-sm'>Negative Prompt</label>
                <textarea rows={4} type="text" defaultValue={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className={inputClasses} />
            </div>
            <div className='flex flex-row space-x-2 text-sm'>
                <label className='text-sm'>Guidance Scale</label>
                <input type="number" defaultValue={guidance_scale} onChange={(e) => setGuidanceScale(e.target.value)} className={inputClasses} />
                <label className='text-sm'>Seed</label>
                <input type="number" defaultValue={seed} onChange={(e) => setSeed(e.target.value)} className={inputClasses} />
            </div>
        </div>
    )
}

function CreateImage({ handleTabChange }) {
    const defaultNegativePrompt = '[worst quality], [low quality], bad legs, bad arms, deformed body parts, low res, blurry, worst quality, extra limbs, bad quality, ugly, text, logo, signature, greyscale, bokeh, sepia, monochrome, disfigured, bad anatomy, extra limbs, bokeh, poorly drawn, washed out, zombie, (interlocked fingers:1.2), multiple views';
    const { setImages, eta, setEta, setNewCount, handleShowNotification } = useGlobalContext();
    const [expertMode, setExpertMode] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [orientation, setOrientation] = useState('square');
    const [style, setStyle] = useState('classic');
    // const [highQuality, setHighQuality] = useState(false);
    const [negativePrompt, setNegativePrompt] = useState(defaultNegativePrompt);
    const [guidance_scale, setGuidanceScale] = useState(7.5);
    const [seed, setSeed] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = userAuth();


    const samplePrompts = [
        'Disney, Snow White, long hair, (cum on face and hair), nude, naked, perfect breasts, perfect fingers',
        'Disney style, girl playing a piano, nude, naked, perfect breasts, perfect hands and fingers',
        'emma watson, meditating, nude, naked, perfect breasts, perfect fingers',
        'Ultra realistic 8k photograph,picture-perfect face,flawless, clean, masterpiece, professional artwork, famous artwork,perfect face, beautiful face, beautiful eyes,((perfect female body, narrow waist,nude)),black hair,huge breasts,crown,nsfw,breasts out,soft light,absurdly long hair,very long hair, (rich:1.4),(high detailed skin:1.2),sexy, charming, alluring, seductive, erotic, enchanting,lovely,vagina, dark studio,Bokeh,',
        'Cute fairy in a glass jar filled with water, smiling, fully nude',
        'Oil painting, nude girl,  golden tiara, nude, naked, judging crowd in the background, close shot at from the side, crawling on the street, beautiful expressive eyes, seductive look, ((on all fours lead through city streets)), tension, dangerous atmosphere, torch light, city square at night after revolution, masterpiece, cinematic light, nude, naked',
        'Oil portrait featuring broken automata girls, fully nude, full body, steampunk machines ((gear pupils)), machine eyes, cinematic lighting, highres, good saturation, color gradient, multicolored hair',
        '2girls, nude, dark skin, from behind, ass, looking back, indoors, pussy, smiling, animal ears, bedroom, long hair, yellow eyes, breast on breast, fox tail, tongue',
        '1girl, 1boy, spread legs, sex, nude, medium breasts, penis, vaginal, open mouth, brown eyes, long hair, cum, black hair, on bed, pov, stomach bulge,',
        '1girl, long black hair, smiling, gym, karate, fighting, naked,',
        '1girl, pink eyes, long hair, red hair, (temple in the background), sitting, kimono, medium breasts, topless, light smile, wide hips, arms behind back',
        '1girl, white hair, green eyes, looking up, floating hair, butterfly, from side, wings, nature, topless, perfect tits',
        '((beautiful asian)) 1woman, ((beautiful kimono)), ((no panty)), ((trimmed pussy:1.3)), detailed, squatting bending over, spreading legs apart, rain, (translucent clothes), (cleavage:0.7), ((medium breasts)), (sideboob), (wet body), pavement, messy bun, long hair coming down on shoulders, sweaty body, blush, grey eyes, black hair, smiling at viewer, happy expression, (detailed pussy:1.4), ((sakura blooms background)), (darkened background)',
        'absurdres, 1girl, nude, red hair, long hair, forest, perfect breasts, shaved vagina, sitting on a tree branch',
        '1girl, white hair, green eyes, looking up, floating hair, butterfly, from side, wings, nature, topless, perfect tits',
        '1girl, long black hair, smiling, gym, karate, fighting, naked,',
        '1girl, long hair, glasses, burger, bored, braid, naked, perfect breasts', ,
        '1girl, 1boy, vaginal, doggystyle, sex, blonde hair, nude, bra, bottomless,',
        '1girl, 1boy, very long hair, nude, red eyes, black hair, fellatio, nipples, sucking penis, mountains',
        '1 girl, standing, train interior, brown eyes, pointing at viewer, (police), angry, hat, no pants, see through top, clean pussy, naked, nude',
        'absurdres, 1girl, nude, red hair, long hair, forest, perfect breasts, shaved vagina, sitting on a tree branch',
        'realistic, 1girl, ponytail, parted lips, blush, makeup, light smile, white hair, sportswear, skirt, see through clothes, visible nipples, perfect tits, glow, thighs, purple eye, bare shoulders, collarbone, narrow waist, sunbeam, sunlight, rose, wind, nude, (masterpiece), sweat',
        '2 big boob topless waifus hugging each other, long hair',
        '1girl rin tohsaka, dancefloor, upper body, ((2boy)), pov, brown hair, long hair, ((blue eyes)), ((naked)),  (((buckake))) (((exhausted))), ((((covered with sperm)))), medium breasts, (((messy, cum shot, sweating)))',
        '((beautiful asian)) 1woman, ((beautiful kimono)), ((no panty)), ((trimmed pussy:1.3)), detailed, squatting bending over, spreading legs apart, rain, (translucent clothes), (cleavage:0.7), ((medium breasts)), (sideboob), (wet body), pavement, messy bun, long hair coming down on shoulders, sweaty body, blush, grey eyes, black hair, smiling at viewer, happy expression, (detailed pussy:1.4), ((sakura blooms background)), (darkened background)',
        '1girl, blue eyes, long blond hair, (japanese city in background), sitting, kimono, medium breasts, topless, light smile, arms behind back, [nipples], night, beautiful, water',
        '1girl, pink eyes, long hair, black hair, (temple in the background), sitting, kimono, medium breasts, topless, light smile, wide hips, arms behind back',
        '((beautiful asian)) multiple woman, ((one piece short dress)), ((no panties)), detailed, squatting bending over, spreading legs apart, rain, (translucent clothes), (cleavage:0.7), ((medium breasts)), (sideboob), (wet body), pavement, messy bun, long hair coming down on shoulders, sweaty body, blush, grey eyes, ((cameltoe:1.3)), black hair, smiling at viewer, happy expression, (open crotch), ((sakura blooms background)), (darkened background)'
    ];




    // const samplePrompts = [
    //     'masterpiece, best quality, 1girl, white hair, green eyes, looking up, floating hair, butterfly, from side, wings, nature,',
    //     'masterpiece, best quality, 1girl, long hair, glasses, burger, bored, braid,',
    //     'masterpiece, best quality, 1girl, standing, train interior, brown eyes, pointing at viewer, (police), angry, hat, pants,',
    //     'masterpiece, best quality, 1girl, long black hair, smiling, gym, karate, fighting,'
    // ]

    const handleInspireClick = () => {
        const randomIndex = Math.floor(Math.random() * samplePrompts.length);
        setInstructions(samplePrompts[randomIndex]);
    }

    const handleArrowClick = async () => {
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
                // generateImgUrlsAndSetImages(response.data);
                setImages((prevImages) => {
                    return [...response.data, ...prevImages];
                });
                setNewCount((prevCount) => {
                    return prevCount + response.data.length;
                }
                );
                setEta(Math.floor(response.data[0].eta));

            } else {
                console.log('You must login to continue generation');
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
            handleShowNotification({ "title": err.response.data.message }, 'error');
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

                    <AdvancedSettings instructions={instructions} negativePrompt={negativePrompt} guidance_scale={guidance_scale} seed={seed} setInstructions={setInstructions} setNegativePrompt={setNegativePrompt} setGuidanceScale={setGuidanceScale} setSeed={setSeed} />)}

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
