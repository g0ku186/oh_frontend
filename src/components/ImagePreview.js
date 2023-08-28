import Image from 'next/image';
import placeHolderImg from '../../public/placeholder1.jpg';
import blurImg from '../../public/blur.png';
import Link from 'next/link';

import { gumRoadLink } from '../constants/constants'


const ImagePreview = () => {
    return (
        <div className="relative cursor-pointer h-full col-span-2 aspect-[1/1] border border-gray-600 shadow shadow-md">
            <Image
                fill={true}
                className={`object-cover w-full h-full transition duration-300 ease-in-out`}
                src={blurImg}
                alt="User generated"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <p className="mt-4 text-sm text-white text-center">Daily free limit exceeded. Upgrade to view the image.</p>
                <Link
                    className="mt-4 p-3 text-sm text-white bg-primary font-bold hover:bg-primaryDark rounded"
                    href={gumRoadLink}
                    target='_blank'
                >
                    Upgrade Now <span className='underline'>@50% OFF</span>
                </Link>
            </div>
        </div>
    )
}

export default ImagePreview;