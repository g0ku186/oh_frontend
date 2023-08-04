import { useEffect, useState, memo } from "react"
import PlaceHolderComponent from "./PlaceHolderComponent";
import FailedImageComponent from "./FailedImageComponent";
import { blurImage } from "../../public/blur";
import { EditIcon, TrashIcon, LoveIcon, LoveFilledIcon } from "./Icons";
import { userAuth } from "../context/AuthContext";
import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import axios from 'axios';
//import InfiniteScroll from "react-infinite-scroll-component";
import Notification from "./Notification";
import EditImage from "./EditImage";
import ConfirmationBox from "./ConfirmationBox";

const baseImgLink = `${process.env.API_BASE_URL}/generations`;

const ListUserImages = () => {
    //From GlobalContext
    const { user } = userAuth();
    //  const { images, setImages, eta, selectedImage, setSelectedImage, page, setPage, hasMore, setHasMore, newCount, bookmark } = useGlobalContext();
    const { eta, selectedImage, setSelectedImage, newCount, bookmark } = useGlobalContext();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const setNormalImages = useGlobalContext().setImages;
    const setBookmarkImages = useGlobalContext().setbookmarkImages;
    const images = bookmark ? useGlobalContext().bookmarkImages : useGlobalContext().images;
    const setImages = bookmark ? useGlobalContext().setbookmarkImages : useGlobalContext().setImages;
    const page = bookmark ? useGlobalContext().bookmarkPage : useGlobalContext().page;
    const setPage = bookmark ? useGlobalContext().setBookmarkPage : useGlobalContext().setPage;
    const hasMore = bookmark ? useGlobalContext().hasMoreBookmark : useGlobalContext().hasMore;
    const setHasMore = bookmark ? useGlobalContext().setHasMoreBookmark : useGlobalContext().setHasMore;
    const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
    const [imageIdToDelete, setImageIdToDelete] = useState(null);

    const [loading, setLoading] = useState(false);

    //local state
    const [hoveredImg, setHoveredImg] = useState(null);

    const idToken = user ? user.accessToken : null;

    const handleShowNotification = (message, type) => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };



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
                            setImages(prevImages => {
                                return prevImages.map(prevImage => {
                                    if (prevImage.imgId === image.imgId) {
                                        return {
                                            ...prevImage,
                                            status: response.data.status,
                                        };
                                    } else {
                                        return prevImage;
                                    }
                                });
                            });
                        }
                    } catch (err) {
                        console.log(err);
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

            const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/user/getImages?page=${page}&limit=10&bookmark=${bookmark}&skip=${newCount}`, {
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
            await axios.post(`${process.env.API_BASE_URL}/api/v1/image/bookmark`, { imgId, bookmark: !bookmark }, {
                headers: {
                    Authorization: idToken
                }
            });
            setNormalImages(oldImages => oldImages.map(img => img.imgId === imgId ? { ...img, bookmark: !bookmark } : img));
            setBookmarkImages(oldImages => oldImages.map(img => img.imgId === imgId ? { ...img, bookmark: !bookmark } : img));
            handleShowNotification(bookmark ? 'Image removed from bookmark' : 'Image added to bookmark', 'success');

        } catch (err) {
            console.error(err);
            handleShowNotification('Can\'t save the bookmark', 'error');
        }
    };

    const handleDelete = (imgId) => {
        setImageIdToDelete(imgId);
        setOpenConfirmationBox(true);
    };

    const proceedWithDeletion = async () => {
        if (!imageIdToDelete) return;

        try {
            await axios.delete(`${process.env.API_BASE_URL}/api/v1/image/delete`, {
                headers: {
                    Authorization: idToken
                },
                data: {
                    imgId: imageIdToDelete
                }
            });
            setNormalImages(oldImages => oldImages.filter(img => img.imgId !== imageIdToDelete));
            setBookmarkImages(oldImages => oldImages.filter(img => img.imgId !== imageIdToDelete));
            handleShowNotification('Image deleted successfully', 'success');
        } catch (err) {
            console.error(err);
            handleShowNotification('Can\'t delete the image', 'error');
        } finally {
            setImageIdToDelete(null);
            setOpenConfirmationBox(false);
        }
    };


    const handleDownload = (img) => {
        const link = document.createElement('a');
        link.href = baseImgLink + '/' + img.imgId + '.png';
        link.target = '_blank';
        link.download = 'download.png';
        link.click();
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">Please login to view your images</h1>
            </div>

        )

    } else {
        return (
            <>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
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
                                    onClick={() => handleDownload(img)}
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
                                            {img.bookmark ? (
                                                <LoveFilledIcon className="w-6 h-6 text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleBookmark(img.imgId, img.bookmark) }} />
                                            ) : (
                                                <LoveIcon className="w-6 h-6 text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleBookmark(img.imgId, img.bookmark) }} />
                                            )}
                                            <EditIcon className="w-6 h-6 text-yellow-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEditImage(img) }} />
                                            <TrashIcon className="w-6 h-6 text-gray-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(img.imgId) }} />
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    })}
                </div>
                {hasMore && <button onClick={fetchImages} className="w-24 py-2 mt-4 text-white border-2 hover:bg-blue-700 focus:outline-none">Load More</button>}
                {selectedImage && <EditImage onClose={closeOverlay} />}
                <Notification show={showNotification} setShow={setShowNotification} type={notificationType} message={notificationMessage} />
                <ConfirmationBox open={openConfirmationBox} setOpen={setOpenConfirmationBox} onConfirm={proceedWithDeletion} />
            </>
        );
    }



}

export default memo(ListUserImages);