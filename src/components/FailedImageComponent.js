
import placeHolderImg from '../../public/placeholder1.jpg';
import Image from 'next/image';

const FailedImageComponent = ({ img, handleDelete }) => {
    return (
        <div className="relative cursor-pointer aspect-content aspect-[1/1] overflow-hidden">
            <Image
                fill={true}
                className="object-cover w-full h-full"
                src={placeHolderImg}
                alt="Failed to generate"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-800 bg-opacity-90">
                <p className="mt-4 text-sm text-white">Image generation failed</p>
                <button
                    className="mt-4 p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                    onClick={() => handleDelete(img.imgId)}
                >
                    Delete
                </button>
            </div>
        </div>
    )

}

export default FailedImageComponent;