import { useContext, createContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export function useGlobalContext() {
    return useContext(GlobalContext);
}


export function GlobalProvider({ children }) {

    //for public Images
    const [publicImages, setPublicImages] = useState([]);
    const [selectedPublicImage, setSelectedPublicImage] = useState(null);
    const [publicImagePage, setPublicImagePage] = useState(1);
    const [hasMorePublic, setHasMorePublic] = useState(true);

    //for User Images
    const [bookmark, setBookmark] = useState(false);

    const [images, setImages] = useState([]);
    const [bookmarkImages, setbookmarkImages] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);

    const [page, setPage] = useState(1);
    const [bookmarkPage, setBookmarkPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);
    const [hasMoreBookmark, setHasMoreBookmark] = useState(true);

    const [eta, setEta] = useState(null);
    const [newCount, setNewCount] = useState(0);

    const value = {
        images, setImages, selectedImage, setSelectedImage, page, setPage, hasMore, setHasMore, eta, setEta, newCount, setNewCount,
        publicImages, setPublicImages, selectedPublicImage, setSelectedPublicImage, publicImagePage, setPublicImagePage, hasMorePublic, setHasMorePublic,
        bookmark, setBookmark,
        bookmarkImages, setbookmarkImages, bookmarkPage, setBookmarkPage, hasMoreBookmark, setHasMoreBookmark
    }

    useEffect(() => {
        let interval;
        if (eta !== null) {
            interval = setInterval(() => {
                setEta(prevEta => {
                    if (prevEta === 1) {
                        return null;
                    } else if (prevEta) {
                        return prevEta - 1;
                    }
                    return null;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [eta]);

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}



