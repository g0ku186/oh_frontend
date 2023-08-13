import useProtectedRoute from '@/hooks/useProtectedRoute';
import { useState, useEffect } from 'react';
import { userAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext';
import HashLoader from "react-spinners/HashLoader";
import profile from '../../../public/profile.webp';

const baseUrl = process.env.API_BASE_URL

const Profile = () => {
    const { user } = useProtectedRoute();
    const [userDetails, setUserDetails] = useState({});
    const { changePassword } = userAuth();
    const [changePasswordClicked, setChangePasswordClicked] = useState(false);
    const [licenseKey, setLicenseKey] = useState('');
    const { handleShowNotification } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [passwordLoader, setPasswordLoader] = useState(false);


    useEffect(() => {
        if (user) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken
            }
            const getUser = async () => {
                try {
                    const response = await axios.get(`${baseUrl}/api/v1/user/profile`, { headers: headers });
                    setUserDetails(response.data);
                    setLicenseKey(response.data.license_key);
                } catch (err) {
                    handleShowNotification({ "title": err.response.data.message }, 'error');
                }

            }
            getUser();
        }

    }, []);

    const handleActivateLicense = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken
            }
            const payLoad = {
                license_key: licenseKey
            }
            const response = await axios.post(`${baseUrl}/api/v1/user/activateLicense`, payLoad, { headers: headers });
            handleShowNotification({ "title": "Activated Successfully. Auto refreshing the page in 3 seconds" }, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 3000);


        } catch (err) {
            handleShowNotification({ "title": err.response.data.message }, 'error');
        }
        setLoading(false);

    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        handleShowNotification({ "title": "Please mail us to delete your account" }, 'error');
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (e.target.newPassword.value !== e.target.confirmPassword.value) {
            alert('Passwords do not match');
            return;
        }
        try {
            setPasswordLoader(true);
            await changePassword(e.target.newPassword.value);
            handleShowNotification({ "title": "Password Changed Successfully" }, 'success')

        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    handleShowNotification({ "title": "Please signup first" }, "error");
                    break;
                case "auth/requires-recent-login":
                    handleShowNotification({ "title": "Please login again" }, "error");
                default:
                    handleShowNotification({ "title": "Something went wrong" }, "error");
            }
            handleShowNotification({ "title": "Please try again" }, 'error')
        }
        setChangePasswordClicked(false);
        setPasswordLoader(false);
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
                        {passwordLoader ? <HashLoader color={'#fff'} size={20} /> : 'Change Password'}
                    </button>
                </div>
            </form>
        )
    }
    const inputClasses = 'w-full px-2 py-1 border text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary rounded-md text-xs';

    if (user) {
        return (
            <div className="flex text-gray-800">

                <div className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Account Details</h2>
                    <hr />
                    <div className='flex flex-col md:flex-row md:items-center md:space-x-36 space-y-12'>
                        <div className='flex flex-col space-y-4'>
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
                                <span className="block text-grey-darker font-bold mb-2">License Key:</span>
                                <div className='flex space-x-2'>
                                    <input type="text" defaultValue={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} className={inputClasses} />
                                    <button
                                        onClick={handleActivateLicense}
                                        className="px-2 py-1 text-xs font-base text-white bg-green-600 rounded-md border border-green-600 hover:bg-white hover:text-green-600"
                                    >
                                        {loading ? <HashLoader color={"#ffffff"} size={10} /> : 'Activate'}
                                    </button>

                                </div>
                            </div>
                            <div className='text-sm underline flex cursor-pointer' onClick={() => setChangePasswordClicked(!changePasswordClicked)}>

                                <p>Change Password</p> {changePasswordClicked ? <ChevronUpIcon className='w-5 h-5 ml-1' /> : (<ChevronDownIcon className='w-5 h-5 ml-1' />)}
                            </div>
                            {changePasswordClicked && <ChangePasswordForm />}

                            <div className='flex space-x-2'>
                                <Link
                                    href="https://app.gumroad.com/library"
                                    target="_blank"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md border border-primary hover:bg-primaryDark"
                                >
                                    Manage Subscription
                                </Link>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-white rounded-md border border-red-600 hover:bg-red-600 hover:text-white"
                                >
                                    Delete Account
                                </button>
                            </div>

                        </div>
                        <div className='md:ml-12'>
                            <Image src={profile} width={400} height={400} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export default Profile;
