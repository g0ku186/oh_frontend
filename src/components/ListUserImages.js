import { useEffect, useState, memo } from "react"
import PlaceHolderComponent from "./PlaceHolderComponent";
import FailedImageComponent from "./FailedImageComponent";
import { blurImage } from "../../public/blur";
import { EditIcon, TrashIcon, LoveIcon, LoveFilledIcon } from "./Icons";
import { userAuth } from "../context/AuthContext";
import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
//import InfiniteScroll from "react-infinite-scroll-component";
import Notification from "./Notification";
import EditImage from "./EditImage";
import ConfirmationBox from "./ConfirmationBox";

//const baseUrl = `https://imagedelivery.net/jiDyTO2MeeaRtYvAKMguuQ/d794ad00-6b85-460d-c57e-82b65cdd0d00/public`;
const constructImgLink = (cf_id, variant) => {
    return `https://imagedelivery.net/jiDyTO2MeeaRtYvAKMguuQ/${cf_id}/${variant}`
}

// const constructImgLink = (cf_id, variant) => {
//     return `https://www.onlyhentai.ai/cdn-cgi/imagedelivery/jiDyTO2MeeaRtYvAKMguuQ/${cf_id}/${variant}`
// }

const ListUserImages = () => {
    //From GlobalContext
    const { user } = userAuth();
    //  const { images, setImages, eta, selectedImage, setSelectedImage, page, setPage, hasMore, setHasMore, newCount, bookmark } = useGlobalContext();
    const { eta, selectedImage, setSelectedImage, setNewCount, setNewBookmarkCount, bookmark, handleShowNotification
    } = useGlobalContext();

    const setNormalImages = useGlobalContext().setImages;
    const setBookmarkImages = useGlobalContext().setbookmarkImages;
    const images = bookmark ? useGlobalContext().bookmarkImages : useGlobalContext().images;
    const setImages = bookmark ? useGlobalContext().setbookmarkImages : useGlobalContext().setImages;
    const page = bookmark ? useGlobalContext().bookmarkPage : useGlobalContext().page;
    const setPage = bookmark ? useGlobalContext().setBookmarkPage : useGlobalContext().setPage;
    const hasMore = bookmark ? useGlobalContext().hasMoreBookmark : useGlobalContext().hasMore;
    const setHasMore = bookmark ? useGlobalContext().setHasMoreBookmark : useGlobalContext().setHasMore;
    const newCount = bookmark ? useGlobalContext().newBookmarkCount : useGlobalContext().newCount;
    const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
    const [imageIdToDelete, setImageIdToDelete] = useState(null);


    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    //local state
    const [hoveredImg, setHoveredImg] = useState(null);

    const idToken = user ? user.accessToken : null;


    useEffect(() => {
        const processingImages = images.filter(image => image.status === 'processing');
        if (processingImages.length > 0) {
            const interval = setInterval(async () => {
                for (let image of processingImages) {
                    try {
                        const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/status/${image.jobId}}`,
                            {
                                imgId: image.imgId
                            },
                            {
                                headers: {
                                    Authorization: idToken
                                },
                            });
                        if (response.data.status === 'success' || response.data.status === 'failed') {
                            const cf_id = response.data.cf_id || null;
                            setImages(prevImages => {
                                return prevImages.map(prevImage => {
                                    if (prevImage.imgId === image.imgId) {
                                        return {
                                            ...prevImage,
                                            status: response.data.status,
                                            cf_id: cf_id,
                                        };
                                    } else {
                                        return prevImage;
                                    }
                                });
                            });
                        }
                    } catch (err) {

                        handleShowNotification({ 'title': err.response.data.message }, 'error')
                    }
                }
                // Check if there are still any 'processing' or 'failed' images left
                const remainingImages = images.filter(image => image.status === 'processing');
                if (remainingImages.length === 0) {
                    // If not, clear the interval
                    clearInterval(interval);
                }
            }, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        }
    }, [images, setImages, idToken]);

    const closeOverlay = () => {
        setSelectedImage(null);
    };

    const fetchImages = async () => {
        if (loading) return;
        setLoading(true);
        try {
            console.log('inside fetch images')
            console.log(page)
            console.log(bookmark)

            const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/image/getImages?page=${page}&limit=10&bookmark=${bookmark}&skip=${newCount}`, {
                headers: {
                    Authorization: idToken
                },
            });
            setImages(oldImages => [...oldImages, ...res.data.images]);
            setPage(prevPage => prevPage + 1);
            // If currentPage equals to totalPages, there is no more data to be loaded
            if (res.data.currentPage === res.data.totalPages) {
                setHasMore(false);
            }
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    };

    useEffect(() => {
        console.log('Running use effect')
        if (page === 1) {
            fetchImages();
        }

    }, [bookmark]);


    const handleHover = (imgId) => {
        setHoveredImg(imgId);
    };

    const handleMouseLeave = () => {
        setHoveredImg(null);
    };

    const handleEditImage = (img) => {
        setSelectedImage(img);
    };

    const handleBookmark = async (imgId, bookmark) => {
        try {
            setNormalImages(oldImages => oldImages.map(img => img.imgId === imgId ? { ...img, bookmark: !bookmark } : img));
            if (!bookmark) {
                setBookmarkImages(oldImages => [...oldImages, { ...images.find(img => img.imgId === imgId), bookmark: !bookmark }]);
            } else {
                setBookmarkImages(oldImages => oldImages.filter(img => img.imgId !== imgId));
            }

            await axios.post(`${process.env.API_BASE_URL}/api/v1/image/bookmark`, { imgId, bookmark: !bookmark }, {
                headers: {
                    Authorization: idToken
                }
            });

            handleShowNotification(bookmark ? { "title": 'Image removed from favourites' } : { "title": "Image added to favourites" }, 'success');

        } catch (err) {
            console.error(err);
            handleShowNotification({ "title": "Can\'t save the bookmark" }, 'error');
        }
    };

    const handleDelete = (imgId) => {
        setImageIdToDelete(imgId);
        setOpenConfirmationBox(true);
    };

    const proceedWithDeletion = async () => {
        if (!imageIdToDelete) return;

        try {
            setActionLoading(true);
            await axios.delete(`${process.env.API_BASE_URL}/api/v1/image/delete`, {
                headers: {
                    Authorization: idToken
                },
                data: {
                    imgId: imageIdToDelete
                }
            });

            setNormalImages(oldImages => oldImages.filter((img) => {
                if (img.imgId !== imageIdToDelete) {
                    return img
                }
                else {
                    setNewCount(oldCount => oldCount - 1)
                }
            }));
            setBookmarkImages(oldImages => oldImages.filter(img => {
                if (img.imgId !== imageIdToDelete) {
                    return img
                }
                else {
                    setNewBookmarkCount(oldCount => oldCount - 1)
                }
            }));
            handleShowNotification({ "title": 'Image deleted successfully' }, 'success');




        } catch (err) {
            console.error(err);
            handleShowNotification({ "title": 'Can\'t delete the image' }, 'error');
        } finally {
            setActionLoading(false);
            setImageIdToDelete(null);
            setOpenConfirmationBox(false);
        }
    };


    const handleDownload = (img) => {
        const link = document.createElement('a');
        link.href = constructImgLink(img.cf_id, "public");
        link.target = '_blank';
        link.download = 'download.png';
        link.click();
    };

    if (!user) {
        return (
            <div className="flex justify-center items-start h-screen">
                <h1 className="text-2xl font-bold">Please login to view your images</h1>
            </div>

        )

    } else {
        return (
            <>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 px-6">
                    {images.map((img, index) => {
                        if (img.status && img.status === 'processing') {
                            return <PlaceHolderComponent key={index} eta={eta} />
                        } else if (img.status && img.status === 'failed') {
                            return <FailedImageComponent key={index} img={img} handleDelete={handleDelete} />
                        }

                        else {
                            return (
                                <div
                                    key={img.imgId}
                                    className={`relative cursor-pointer aspect-content aspect-[1/1] overflow-hidden border border-gray-900 rounded-md shadow-sm shadow-gray-900 ${hoveredImg === img.imgId && 'bg-gray-800'}`}
                                    onMouseEnter={() => handleHover(img.imgId)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link href={constructImgLink(img.cf_id, "public")}
                                        target="_blank">
                                        <Image
                                            fill={true}
                                            className={`object-contain w-full h-full transition duration-300 ease-in-out ${hoveredImg === img.imgId && 'opacity-50'}`}
                                            src={constructImgLink(img.cf_id, "public")}
                                            alt="User generated"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            placeholder="blur"
                                            blurDataURL={blurImage}
                                            loader={({ src }) => src}
                                            unoptimized
                                        />
                                    </Link>

                                    {hoveredImg === img.imgId && (
                                        <div className="absolute flex justify-around w-full px-4 py-2 bottom-0 bg-black">
                                            {img.bookmark ? (
                                                <LoveFilledIcon className="w-6 h-6 text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleBookmark(img.imgId, img.bookmark) }} />
                                            ) : (
                                                <LoveIcon className="w-6 h-6 text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleBookmark(img.imgId, img.bookmark) }} />
                                            )}
                                            <EditIcon className="w-6 h-6 text-primary cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEditImage(img) }} />
                                            <TrashIcon className="w-6 h-6 text-gray-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(img.imgId) }} />
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    })}
                </div>
                {hasMore && images.length > 0 && <button onClick={fetchImages} className="w-24 py-2 mt-4 ml-6 text-white border-2 hover:bg-primary focus:outline-none">Load More</button>}
                {selectedImage && <EditImage onClose={closeOverlay} />}
                <ConfirmationBox open={openConfirmationBox} setOpen={setOpenConfirmationBox} onConfirm={proceedWithDeletion} loading={actionLoading} />
            </>
        );
    }



}

export default memo(ListUserImages);