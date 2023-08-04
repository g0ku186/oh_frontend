import useProtectedRoute from '@/hooks/useProtectedRoute';
import { useState, useEffect } from 'react';
import { userAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const baseUrl = process.env.API_BASE_URL

const Profile = () => {
    const { user } = useProtectedRoute();
    const [userDetails, setUserDetails] = useState({});
    const { changePassword } = userAuth();
    const [changePasswordClicked, setChangePasswordClicked] = useState(false);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': user.accessToken
        }
        const getUser = async () => {
            const response = await axios.get(`${baseUrl}/api/v1/user/profile`, { headers: headers });
            console.log(response.data);
            setUserDetails(response.data);
        }
        getUser();

    }, []);



    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (e.target.newPassword.value !== e.target.confirmPassword.value) {
            alert('Passwords do not match');
            return;
        }
        try {
            await changePassword(e.target.newPassword.value);
        } catch (err) {
            alert('Failed')
        }
        setChangePasswordClicked(false);
    }

    const ChangePasswordForm = () => {
        return (
            <form
                onSubmit={handlePasswordChange}
                className="space-y-6 text-gray-900 w-full mt-4"
            >
                <div>
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        New Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="form-input block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Confirm Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="form-input block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        )
    }

    if (user) {
        return (
            <div className="flex text-gray-800">

                <div className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Account Details</h2>
                    <hr />
                    <div className="mb-4">
                        <span className="block text-grey-darker font-bold mb-2">Email:</span>
                        <span className="block">{userDetails.email}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-grey-darker font-bold mb-2">Subscription:</span>
                        <span className="block">{userDetails.plan}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-grey-darker font-bold mb-2">Images Generated:</span>
                        <span className="block">{userDetails.current_usage} / {userDetails.plan === 'pro' ? "unlimited" : userDetails.limit}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-grey-darker font-bold mb-2">Renews On:</span>
                        <span className="block">{userDetails.renewalDate ? userDetails.renewalDate : 'N/A'}</span>
                    </div>
                    <div className='text-sm underline flex cursor-pointer' onClick={() => setChangePasswordClicked(!changePasswordClicked)}>

                        <p>Change Password</p> {changePasswordClicked ? <ChevronUpIcon className='w-5 h-5 ml-1' /> : (<ChevronDownIcon className='w-5 h-5 ml-1' />)}
                    </div>
                    {changePasswordClicked && <ChangePasswordForm />}

                    <div className='flex space-x-2'>
                        <Link
                            href="https://www.google.com"
                            target="_blank"
                            className="px-4 py-2 text-sm font-bold text-white bg-secondary rounded-md shadow-sm hover:bg-black border block text-center"
                        >
                            Manage Subscription
                        </Link>
                        <button
                            onClick={() => setChangePasswordClicked(true)}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-700 rounded-md shadow-sm hover:bg-black border block text-center"
                        >
                            Delete Account
                        </button>
                    </div>


                </div>
            </div>
        )
    }
    return null
}

export default Profile;
