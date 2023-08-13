import { useState } from 'react';
import { userAuth } from '@/context/AuthContext';
import { TrashIcon, DownloadIcon, CloseIcon } from "@/components/Icons";
import axios from 'axios';
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext';
import { blurImage } from '../../public/blur';
import Tooltip from './Tootip';
import { toolTipTexts } from '@/constants/constants';

const baseImgLink = `${process.env.API_BASE_URL}/generations`;

const constructImgLink = (cf_id, variant) => {
    return `https://imagedelivery.net/jiDyTO2MeeaRtYvAKMguuQ/${cf_id}/${variant}`
}

export default function ViewPublicImage({ onClose }) {
    const { user } = userAuth();
    const { selectedPublicImage, handleShowNotification } = useGlobalContext();
    const [prompt, setPrompt] = useState(selectedPublicImage.prompt);
    const [negativePrompt, setNegativePrompt] = useState(selectedPublicImage.parameters.negative_prompt);
    const [guidanceScale, setGuidanceScale] = useState(selectedPublicImage.parameters.guidance_scale);
    const [seed, setSeed] = useState(selectedPublicImage.parameters.seed);
    const idToken = user ? user.accessToken : null;

    const handleCopy = () => {
        //this should copy the prompt and negative prompt to the clipboard
        navigator.clipboard.writeText(`Prompt:\n${prompt}\n\nNegative Prompt:\n${negativePrompt} \n\nGuidance Scale: ${guidanceScale} \n\nSeed: ${seed}`);
        handleShowNotification({ "title": "Copied to clipboard" }, 'success');
    }

    const inputClasses = 'w-full px-2 py-1 border text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary rounded-md';

    return (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-60 px-20 pt-20 pb-4 md:pb-10">
            <div className='relative h-full w-full'>
                <div className="relative bg-white rounded-lg shadow-lg h-full">

                    <CloseIcon onClick={onClose} className="absolute cursor-pointer top-2 right-2 w-6 h-6 text-gray-600 hover:text-red-500 z-30" />

                    <div className="p-6 mt-6 relative flex flex-col md:flex-row space-x-4 h-full w-full overflow-y-auto">
                        <div className='max-w-[600px]'>
                            <Image
                                className=""
                                src={constructImgLink(selectedPublicImage.cf_id, 'public')}
                                width={selectedPublicImage.parameters.width}
                                height={selectedPublicImage.parameters.height}
                                alt="User generated"
                                placeholder='blur'
                                blurDataURL={blurImage}
                            />
                        </div>
                        <div className='flex flex-col mt-4 space-y-4 grow text-sm text-gray-900'>
                            <label className="">Prompt</label>
                            <textarea rows={4} type="text" defaultValue={prompt} onChange={(e) => setPrompt(e.target.value)} className={inputClasses} />
                            <label className="">Negative Prompt</label>
                            <textarea rows={4} type="text" defaultValue={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className={inputClasses} />
                            <div className='flex flex-row space-x-2 '>
                                <div className='flex flex-col space-y-1'>
                                    <label className='flex items-center'>Guidance Scale  <Tooltip text={toolTipTexts.guidance_scale} /></label>
                                    <input type="number" defaultValue={guidanceScale} onChange={(e) => setGuidanceScale(e.target.value)} className={inputClasses} />
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label className='flex items-center'>Seed  <Tooltip text={toolTipTexts.seed} /></label>
                                    <input type="number" defaultValue={seed} onChange={(e) => setSeed(e.target.value)} className={inputClasses} />
                                </div>
                            </div>
                            <div className='flex flex-row space-x-2 text-sm'>
                                <button onClick={handleCopy} className="px-4 py-2 text-sm font-bold text-white bg-purple-500 rounded-md border border-purple-500 hover:bg-purple-700">Copy Data</button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
