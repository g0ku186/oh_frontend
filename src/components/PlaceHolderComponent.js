import placeHolderImg from '../../public/placeholder1.jpg';
import RingLoader from "react-spinners/RingLoader";
import Image from 'next/image';

const PlaceHolderComponent = ({ eta }) => {
    return (
        <div className="relative cursor-pointer aspect-content aspect-[1/1] overflow-hidden">
            <Image
                fill={true}
                className="object-cover w-full h-full"
                src={placeHolderImg}
                alt="User generated"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-800 bg-opacity-90">
                <RingLoader color="#EFA12B" size={60} />
                {eta === null ? (<p className="mt-4 text-sm text-white">Generating image...</p>) : (<p className="mt-4 text-sm text-white">ETA: {eta} sec</p>)}
            </div>
        </div>
    )
}

export default PlaceHolderComponent;