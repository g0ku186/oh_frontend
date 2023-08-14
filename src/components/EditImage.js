import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { getIdToken } from 'firebase/auth';
import RingLoader from "react-spinners/RingLoader";

import { userAuth } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';

import StyleDropDown from './StyleDropDown';
import Tooltip from './Tootip';

import { TrashIcon, DownloadIcon, CloseIcon } from "@/components/Icons";
import { toolTipTexts } from '@/constants/constants';
import { blurImage } from '../../public/blur';

const baseUrl = process.env.API_BASE_URL


const constructImgLink = (cf_id, variant) => {
    return `https://imagedelivery.net/jiDyTO2MeeaRtYvAKMguuQ/${cf_id}/${variant}`
}

export default function EditImage({ onClose }) {
    const { user } = userAuth();
    const { selectedImage, setImages, setSelectedImage, setNewCount, setEta, handleShowNotification } = useGlobalContext();
    const [prompt, setPrompt] = useState(selectedImage.prompt);
    const [negativePrompt, setNegativePrompt] = useState(selectedImage.parameters.negative_prompt);
    const [guidanceScale, setGuidanceScale] = useState(selectedImage.parameters.guidance_scale);
    const [seed, setSeed] = useState(selectedImage.parameters.seed);
    const [style, setStyle] = useState(selectedImage.parameters.style);
    const idToken = user ? user.accessToken : null;
    const [loading, setLoading] = useState(false);


    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    }

    const handleNegativePromptChange = (e) => {
        setNegativePrompt(e.target.value);
    }

    const handleRemix = async () => {
        setLoading(true);
        try {
            if (user) {
                // onClose();
                //handleTabChange('My Generations');
                const idToken = await getIdToken(user);
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': idToken
                }
                const payLoad = {
                    instructions: prompt,
                    negative_prompt: negativePrompt,
                    guidance_scale: guidanceScale,
                    seed: seed,
                    image_orientation: selectedImage.image_orientation,
                    // high_quality: selectedImage.high_quality,
                    init_image: constructImgLink(selectedImage.cf_id, 'public'),
                    style: style,
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

                setLoading(false);
                setEta(Math.floor(response.data[0].eta));
                onClose();

            } else {
                console.log('You must login to continue generation');
            }

        } catch (err) {
            handleShowNotification({ 'title': err.response.data.message }, 'error')
        }
        setLoading(false);
    }


    const handleUpscale = async () => {
        setLoading(true);
        if (user) {
            try {
                const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/upscaleImage`, {
                    imgId: selectedImage.imgId,
                    url: constructImgLink(selectedImage.cf_id, 'public'),
                },
                    {
                        headers: {
                            Authorization: idToken
                        }
                    });

                const { imgId, upscaled, upscale_cf_id, upscale_jobId, upscale_status } = response.data;
                setImages(prevImages => {
                    return prevImages.map(image => {
                        if (image.imgId === imgId) {
                            return {
                                ...image,
                                upscaled: upscaled,
                                upscale_cf_id: upscale_cf_id,
                                upscale_jobId: upscale_jobId,
                                upscale_status: upscale_status,
                            }
                        } else {
                            return image;
                        }
                    })
                }
                );

                setSelectedImage(prevImage => {
                    return {
                        ...prevImage,
                        upscaled: upscaled,
                        upscale_cf_id: upscale_cf_id,
                        upscale_jobId: upscale_jobId,
                        upscale_status: upscale_status,
                    }
                });

            } catch (err) {
                handleShowNotification({ 'title': err.response.data.message }, 'error')
            }
        } else {
            handleShowNotification({ 'title': 'Please login to continue generation' }, 'error')
        }
        setLoading(false);

    };

    const handleDownloadUpscale = () => {
        const link = document.createElement('a');
        link.href = constructImgLink(selectedImage.upscale_cf_id, 'public');
        link.target = '_blank';
        link.download = 'download.png';
        link.click();
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = constructImgLink(selectedImage.cf_id, 'public');
        link.target = '_blank';
        link.download = 'download.png';
        link.click();
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) return;
        setLoading(true);
        try {
            await axios.delete(`${process.env.API_BASE_URL}/api/v1/image/delete`, {
                headers: {
                    Authorization: idToken
                },
                data: {
                    imgId: selectedImage.imgId
                }
            });

            setImages(oldImages => oldImages.filter(img => img.imgId !== selectedImage.imgId));
            onClose();
        } catch (err) {
            handleShowNotification({ 'title': err.response.data.message }, 'error')
        }
        setLoading(false);
    };

    const onGuidanceChange = (e) => {
        let value = Number(e.target.value);
        if (value < 0) value = 0;
        if (value > 20) { value = 20 };
        setGuidanceScale(value);
    }


    useEffect(() => {
        if (selectedImage.upscale_status === 'processing') {
            const interval = setInterval(async () => {
                try {
                    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/upscaleStatus/${selectedImage.upscale_jobId}`, {
                        imgId: selectedImage.imgId,
                    }, {
                        headers: {
                            Authorization: idToken
                        }
                    });

                    const { upscale_status, upscale_cf_id, upscaled } = response.data;
                    setImages(prevImages => {
                        return prevImages.map(image => {
                            if (image.imgId === selectedImage.imgId) {
                                return {
                                    ...image,
                                    upscale_status: upscale_status,
                                    upscale_cf_id: upscale_cf_id,
                                    upscaled: upscaled,
                                }
                            } else {
                                return image;
                            }
                        })
                    }
                    );

                    setSelectedImage(prevImage => {
                        return {
                            ...prevImage,
                            upscale_status: upscale_status,
                            upscale_cf_id: upscale_cf_id,
                            upscaled: upscaled,
                        }
                    });

                    if (upscale_status !== 'processing') {
                        clearInterval(interval);
                    }
                } catch (err) {
                    handleShowNotification({ 'title': err.response.data.message }, 'error')
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [selectedImage.upscale_status]);

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
                                src={constructImgLink(selectedImage.cf_id, 'public')}
                                width={selectedImage.parameters.width}
                                height={selectedImage.parameters.height}
                                alt="User generated"
                                placeholder='blur'
                                blurDataURL={blurImage}
                                loader={({ src }) => src}
                            />
                        </div>
                        <div className='flex flex-col mt-4 space-y-4 grow text-sm text-gray-900'>
                            <label className="">Prompt</label>
                            <textarea rows={4} type="text" defaultValue={prompt} onChange={handlePromptChange} className={inputClasses} />
                            <label className="">Negative Prompt</label>
                            <textarea rows={4} type="text" defaultValue={negativePrompt} onChange={handleNegativePromptChange} className={inputClasses} />
                            <div className='flex flex-row space-x-2 '>
                                <div className='flex flex-col space-y-1'>
                                    <label className='flex items-center'>
                                        Guidance Scale
                                        <Tooltip text={toolTipTexts.guidance_scale} />
                                    </label>
                                    <input type="number" step="0.5" value={guidanceScale} onChange={onGuidanceChange} className={inputClasses} />
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label className='flex items-center'>Seed <Tooltip text={toolTipTexts.seed} />
                                    </label>
                                    <input type="number" defaultValue={seed} onChange={(e) => setSeed(e.target.value)} className={inputClasses} />
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label className=''>Style</label>
                                    <StyleDropDown style={style} setStyle={setStyle} />
                                </div>
                            </div>
                            {!loading ? (<div className='flex flex-row space-x-2 text-sm'>
                                <button onClick={handleRemix} className="px-4 py-2 text-sm flex items-center justify-center font-bold text-white bg-purple-500 rounded-md border border-purple-500 hover:bg-purple-700">Remix
                                    <Tooltip text={toolTipTexts.remix} color="text-white" />
                                </button>
                                {!selectedImage.upscaled && <button onClick={handleUpscale} className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-md border border-primary hover:bg-primaryDark">Go Super Resolution</button>}
                                {selectedImage.upscaled && <button onClick={handleDownloadUpscale} className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-md border border-primary hover:bg-primaryDark">Download Super Resolution</button>}
                                <button onClick={handleDownload} className="p-1 text-gray-800 rounded-md">
                                    <div className="relative cursor-pointer inline-block ml-1 group">
                                        <DownloadIcon className="w-6 h-6 hover:text-primary" />
                                        <span className="absolute text-xs bg-gray-800 text-white rounded z-30 rounded rounded-md bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 p-2 w-32 transition ease-in-out duration-300 hidden group-hover:block">
                                            Download high quality
                                        </span>
                                    </div>
                                </button>
                                <button onClick={handleDelete} className="flex items-center p-1 text-red-500 rounded-md">
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>) : (
                                <div className='mt-4'>
                                    <RingLoader color="#36d7b7" />
                                    <p>Please hold on...</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
