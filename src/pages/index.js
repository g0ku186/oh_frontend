import { useEffect, useState } from "react"
import CreateImage from "../components/CreateImage"
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import Image from "next/image";
import { userAuth } from "../context/AuthContext";
import { EditIcon, TrashIcon, LoveIcon, LoveFilledIcon } from "@/components/Icons";
import EditImage from "@/components/EditImage";
import { useGlobalContext } from "@/context/GlobalContext";
import placeHolderImg from '../../public/placeholder1.jpg';
import RingLoader from "react-spinners/RingLoader";

const baseImgLink = `${process.env.API_BASE_URL}/generations`;

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
        <RingLoader color="#FFFFFF" size={60} />
        {eta !== null && <p className="mt-4 text-2xl text-white">ETA: {eta} sec</p>}
      </div>
    </div>
  )
}


function ListImages({ onImageClick }) {
  //From GlobalContext
  const { user } = userAuth();
  const { images, setImages, eta } = useGlobalContext();

  //local state
  const [hoveredImg, setHoveredImg] = useState(null);

  const idToken = user ? user.accessToken : null;

  useEffect(() => {
    const processingImages = images.filter(image => image.status === 'processing');
    if (processingImages.length > 0) {
      // Only set the interval if there are any 'processing' images
      const interval = setInterval(async () => {
        console.log('running set interval');
        // Use the updated list of 'processing' images
        for (let image of processingImages) {
          try {
            const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/status/${image.jobId}}`, {
              headers: {
                Authorization: idToken
              }
            });
            if (response.data.status === 'success') {
              setImages(prevImages => {
                return prevImages.map(prevImage => {
                  if (prevImage.imgId === image.imgId) {
                    return {
                      ...prevImage,
                      status: 'success',
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
        // Check if there are still any 'processing' images left
        const remainingProcessingImages = images.filter(image => image.status === 'processing');
        if (remainingProcessingImages.length === 0) {
          // If not, clear the interval
          clearInterval(interval);
        }
      }, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [images, setImages]);



  const handleHover = (imgId) => {
    setHoveredImg(imgId);
  };

  const handleMouseLeave = () => {
    setHoveredImg(null);
  };

  const handleEditImage = (img) => {
    onImageClick(img);
  };

  const handleBookmark = async (imgId, bookmark) => {
    try {
      await axios.post(`${process.env.API_BASE_URL}/api/v1/image/bookmark`, { imgId, bookmark: !bookmark }, {
        headers: {
          Authorization: idToken
        }
      });
      setImages(oldImages => oldImages.map(img => img.imgId === imgId ? { ...img, bookmark: !bookmark } : img));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (imgId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.API_BASE_URL}/api/v1/image/delete`, {
        headers: {
          Authorization: idToken
        },
        data: {
          imgId
        }
      });
      setImages(oldImages => oldImages.filter(img => img.imgId !== imgId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
      {images.map((img, index) => {
        if (img.status && img.status === 'processing') {
          return <PlaceHolderComponent key={index} eta={eta} />
        } else {
          return (
            <div
              key={img.imgId}
              className={`relative cursor-pointer aspect-content aspect-[1/1] overflow-hidden ${hoveredImg === img.imgId && 'bg-gray-800'}`}
              onMouseEnter={() => handleHover(img.imgId)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleEditImage(img)}
            >
              <Image
                fill={true}
                className={`object-cover w-full h-full transition duration-300 ease-in-out ${hoveredImg === img.imgId && 'opacity-50'}`}
                src={baseImgLink + '/' + img.imgId + '.png'}
                alt="User generated"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {hoveredImg === img.imgId && (
                <div className="absolute flex justify-around w-full px-4 py-2 bottom-0 bg-gray-800">
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
  );
}

export default function Home() {
  //loading from contexts
  const { user } = userAuth();
  const { images, setImages, selectedImage, setSelectedImage, page, setPage, hasMore, setHasMore } = useGlobalContext();

  //local state

  const [loading, setLoading] = useState(false);

  const idToken = user ? user.accessToken : null;

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setSelectedImage(null);
  };

  const fetchImages = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/user/getImages?page=${page}&limit=10`, {
        headers: {
          Authorization: idToken
        }
      });
      setImages(oldImages => [...oldImages, ...res.data.images]);
      setPage(page + 1);
      // If currentPage equals to totalPages, there is no more data to be loaded
      if (res.data.currentPage === res.data.totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page === 1) {
      fetchImages();
    }

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <div className="w-full">
        <CreateImage />
        <InfiniteScroll
          dataLength={images.length}
          next={fetchImages}
          hasMore={hasMore}
          loader={<h4>Loading yo</h4>}
        >
          <ListImages onImageClick={handleImageClick} />
        </InfiniteScroll>
        {hasMore && <button onClick={fetchImages} className="w-24 py-2 mt-4 text-white border-2 hover:bg-blue-700 focus:outline-none">Load More</button>}
        {selectedImage && <EditImage onClose={closeOverlay} />}
      </div>
    </main>
  )
}
