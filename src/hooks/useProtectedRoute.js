import { useEffect } from "react"
import { useRouter } from "next/router"
import { userAuth } from "@/context/AuthContext"


const useProtectedRoute = () => {
    const { user, initializing } = userAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !initializing) {
            router.push('/')
        }
    }, [user, initializing]);
    return { user }
}

export default useProtectedRoute;