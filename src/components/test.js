function ListUserImages() {
    //From GlobalContext
    const { user } = userAuth();
    console.log('Initiating variables in list user images')
    //  const { images, setImages, eta, selectedImage, setSelectedImage, page, setPage, hasMore, setHasMore, newCount, bookmark } = useGlobalContext();
    const { eta, selectedImage, setSelectedImage, newCount, bookmark } = useGlobalContext();
    const setNormalImages = useGlobalContext().setImages;
    const setBookmarkImages = useGlobalContext().setbookmarkImages;
    const images = bookmark ? useGlobalContext().bookmarkImages : useGlobalContext().images;
    const setImages = bookmark ? useGlobalContext().setbookmarkImages : useGlobalContext().setImages;
    const page = bookmark ? useGlobalContext().bookmarkPage : useGlobalContext().page;
    const setPage = bookmark ? useGlobalContext().setBookmarkPage : useGlobalContext().setPage;
    const hasMore = bookmark ? useGlobalContext().hasMoreBookmark : useGlobalContext().hasMore;
    const setHasMore = bookmark ? useGlobalContext().setHasMoreBookmark : useGlobalContext().setHasMore;

    const [loading, setLoading] = useState(false);

    //local state
    const [hoveredImg, setHoveredImg] = useState(null);

    const idToken = user ? user.accessToken : null;

    useEffect(() => {
        //some code
    }
    }, [images, setImages, idToken]);

const closeOverlay = () => {
    setSelectedImage(null);
};

const fetchImages = async () => {
    if (loading) return;
    setLoading(true);
    const source = axios.CancelToken.source();
    try {
        console.log('inside fetch images')
        console.log(page)
        console.log(bookmark)
        const res = await axios.get(`${process.env.API_BASE_URL}/api/v1/user/getImages?page=${page}&limit=10&bookmark=${bookmark}&skip=${newCount}`, {
            headers: {
                Authorization: idToken
            },
            cancelToken: source.token
        });
        setImages(oldImages => [...oldImages, ...res.data.images]);
        setPage(prevPage => prevPage + 1);
        // If currentPage equals to totalPages, there is no more data to be loaded
        if (res.data.currentPage === res.data.totalPages) {
            setHasMore(false);
        }
    } catch (err) {
        if (axios.isCancel(err)) {
            console.log('Request cancelled');
        } else {
            console.error(err);
        }
    }
    setLoading(false);
    return () => source.cancel();
};

useEffect(() => {
    console.log('Running use effect')
    if (page === 1) {
        const cancelRequest = fetchImages();
        return () => {
            cancelRequest();
        };
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
    //some code
};

const handleDelete = async (imgId) => {
    //some code
};

const handleDownload = (img) => {
    //some code
};

if (!user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Please login to view your images</h1>
        </div>

    )

} else {
    return (
        //rendering some jsx
        );
}



}
