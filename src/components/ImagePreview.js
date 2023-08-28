import Image from 'next/image';
import placeHolderImg from '../../public/placeholder1.jpg';
import blurImg from '../../public/blur.png';
import Link from 'next/link';
import { blurImage } from "../../public/blur";

import { gumRoadLink } from '../constants/constants'

const constructImgLink = (cf_id, variant) => {
    return `https://imagedelivery.net/jiDyTO2MeeaRtYvAKMguuQ/${cf_id}/${variant}`
}

const ImagePreview = ({ imageObj }) => {
    return (
        <div>
            <Image
                fill={true}
                className={`object-cover w-full h-full transition duration-300 ease-in-out`}
                src={constructImgLink(imageObj.cf_id, "blur")}
                alt="User generated"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={blurImage}
                loader={({ src }) => src}
                unoptimized
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