import { useEffect, useState } from "react"
import { blurImage } from "../../public/blur";
import { ViewIcon } from "./Icons";
import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";
import ViewPublicImage from "./ViewPublicImage";

const baseImgLink = `${process.env.API_BASE_URL}/generations`;

function ListPublicImages() {
    //From GlobalContext
    const { publicImages, setPublicImages, selectedPublicImage, setSelectedPublicImage, publicImagePage, setPublicImagePage, hasMorePublic, setHasMorePublic } = useGlobalContext();
    const [loading, setLoading] = useState(false);

    //local state
    const [hoveredImg, setHoveredImg] = useState(null);


    const closeOverlay = () => {
        setSelectedPublicImage(null);
    };

    const fetchPublicImages = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/user/getPublicImages?page=${publicImagePage}`);
            setPublicImages(oldImages => [...oldImages, ...res.data.images]);
            setPublicImagePage(prevPage => prevPage + 1);
            // If currentPage equals to totalPages, there is no more data to be loaded
            if (res.data.currentPage === res.data.totalPages) {
                setHasMorePublic(false);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (publicImagePage === 1) {
            fetchPublicImages();
        }

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleHover = (imgId) => {
        setHoveredImg(imgId);
    };

    const handleMouseLeave = () => {
        setHoveredImg(null);
    };

    const handleViewImage = (img) => {
        setSelectedPublicImage(img);
    };

    return (
        <div>
            <InfiniteScroll
                dataLength={publicImages.length}
                next={fetchPublicImages}
                hasMore={hasMorePublic}
                loader={<h4>Loading public images</h4>}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                    {publicImages.map((img, index) => {
                        return (
                            <div
                                key={img.imgId}
                                className={`relative cursor-pointer aspect-content aspect-[1/1] overflow-hidden border border-gray-900 rounded-md shadow-sm shadow-gray-900 ${hoveredImg === img.imgId && 'bg-gray-800'}`}
                                onMouseEnter={() => handleHover(img.imgId)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleViewImage(img)}
                            >
                                <Image
                                    fill={true}
                                    className={`object-contain w-full h-full transition duration-300 ease-in-out ${hoveredImg === img.imgId && 'opacity-50'}`}
                                    src={baseImgLink + '/' + img.imgId + '.png'}
                                    alt="User generated"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    placeholder="blur"
                                    blurDataURL={blurImage}
                                />

                                {hoveredImg === img.imgId && (
                                    <div className="absolute flex justify-around w-full px-4 py-2 bottom-0 bg-black">
                                        <ViewIcon className="w-6 h-6 text-yellow-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleViewImage(img) }} />
                                    </div>
                                )}
                            </div>
                        )

                    })}
                </div>
            </InfiniteScroll>
            {hasMorePublic && <button onClick={fetchPublicImages} className="w-24 py-2 mt-4 text-white border-2 hover:bg-blue-700 focus:outline-none">Load More</button>}
            {selectedPublicImage && <ViewPublicImage onClose={closeOverlay} />}
        </div>
    );
}

export default ListPublicImages;