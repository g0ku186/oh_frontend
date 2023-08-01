import useProtectedRoute from '@/hooks/useProtectedRoute';

const Profile = () => {
    const { user } = useProtectedRoute();

    if (user) {
        return (<div>
            Hi {user.displayName} </div>)
    }
    return null
}

export default Profile;