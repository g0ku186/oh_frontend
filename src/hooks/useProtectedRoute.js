import { useEffect } from "react"
import { useRouter } from "next/router"
import { userAuth } from "@/context/AuthContext"


const useProtectedRoute = () => {
    const { user, userDetails, initializing } = userAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !initializing) {
            router.push('/')
        }
    }, [user, userDetails, initializing]);
    return { user, userDetails }
}

export default useProtectedRoute;