import { useEffect } from "react"
import { userAuth } from "@/context/AuthContext"
import { useRouter } from "next/router"

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