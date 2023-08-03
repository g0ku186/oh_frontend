import React from 'react';
import { userAuth } from '@/context/AuthContext';
import { TrashIcon, DownloadIcon, CloseIcon } from "@/components/Icons";
import axios from 'axios';
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext';
import { blurImage } from '../../public/blur';

const baseImgLink = `${process.env.API_BASE_URL}/generations`;

export default function ViewPublicImage({ onClose }) {
    const { user } = userAuth();
    const { selectedPublicImage, setPublicImages } = useGlobalContext();
    const idToken = user ? user.accessToken : null;

    const handleGenerate = () => {
        console.log('generating from public image');
        onClose();
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-60 px-20 pt-20 pb-4 md:pb-10">
            <div className='relative h-full w-full'>
                <div className="relative bg-white rounded-lg shadow-lg h-full">

                    <CloseIcon onClick={onClose} className="absolute cursor-pointer top-2 right-2 w-6 h-6 text-gray-600 hover:text-red-500 z-30" />

                    <div className="p-6 mt-6 relative flex flex-col md:flex-row space-x-4 h-full w-full overflow-y-auto">
                        <div className='max-w-[600px]'>
                            <Image
                                className=""
                                src={baseImgLink + '/' + selectedPublicImage.imgId + '.png'}
                                width={selectedPublicImage.parameters.width}
                                height={selectedPublicImage.parameters.height}
                                alt="User generated"
                                placeholder='blur'
                                blurDataURL={blurImage}
                            />
                        </div>
                        <div className='flex flex-col mt-4 space-y-4 grow'>
                            <textarea rows={4} type="text" defaultValue={selectedPublicImage.prompt} className="w-full px-2 py-1 mt-4 border text-gray-800 rounded-md" />
                            <div className='flex flex-row space-x-2 text-sm'>
                                <button onClick={handleGenerate} className="px-4 py-2 text-white bg-blue-500 rounded-md">Generate Similar</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
