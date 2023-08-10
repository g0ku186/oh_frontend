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
    const [newBookmarkCount, setNewBookmarkCount] = useState(0);

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const handleShowNotification = (message, type) => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    const value = {
        images, setImages, selectedImage, setSelectedImage, page, setPage, hasMore, setHasMore, eta, setEta, newCount, setNewCount,
        publicImages, setPublicImages, selectedPublicImage, setSelectedPublicImage, publicImagePage, setPublicImagePage, hasMorePublic, setHasMorePublic,
        bookmark, setBookmark,
        bookmarkImages, setbookmarkImages, bookmarkPage, setBookmarkPage, hasMoreBookmark, setHasMoreBookmark,
        showNotification, setShowNotification, notificationMessage, setNotificationMessage, notificationType, setNotificationType,
        handleShowNotification, newBookmarkCount, setNewBookmarkCount
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



