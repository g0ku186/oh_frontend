import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/router'
import { Dialog } from '@headlessui/react'

import { userAuth } from '../context/AuthContext'
import FormSlider from './FormSlider'

import { Bars3Icon, XMarkIcon, HomeIcon, UserIcon, PowerIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import logo from '../../public/logo.svg'
import logo_small from '../../public/logo_small.svg'
import { gumRoadLink } from '../constants/constants'



const navigation = [
    { name: 'Home', href: '/', Icon: HomeIcon },
    { name: 'Profile', href: '/profile', Icon: UserIcon },
    { name: 'FAQs', href: '/faqs', Icon: QuestionMarkCircleIcon }
]
const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [formOpened, setFormOpened] = useState(false)
    const { user, logOut } = userAuth();
    const router = useRouter();
    return (
        <header className="text-white text-sm font-semibold font-serif">
            <nav className="fixed h-20 bg-black z-20 w-full mx-auto flex items-center justify-between p-6 lg:px-20 top-0" aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5">
                    <Image className="h-10 w-auto" src={logo} alt="only hentai" />
                </Link>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-8 flex flex-row items-center">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className="leading-6 hover:underline flex items-center">
                            <item.Icon className='w-5 h-5 mr-2' />
                            {item.name}
                        </Link>
                    ))}
                    <div className='flex items-center'>
                        <PowerIcon className='w-5 h-5 mr-2' />
                        {!user ? (<button
                            onClick={() => setFormOpened(true)}
                            className="leading-6 hover:underline"
                        >
                            Log in
                        </button>) : (<button
                            onClick={logOut}
                            className="leading-6 hover:underline"
                        >
                            Log Out
                        </button>)}
                    </div>

                    {/* <Link
                        href={gumRoadLink}
                        target='_blank'
                        className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-md hover:bg-primaryDark"
                    >
                        Upgrade
                    </Link> */}

                </div>
            </nav>
            <FormSlider formOpened={formOpened} setFormOpened={setFormOpened} />
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Only Hentai</span>
                            <Image
                                className="h-8 w-auto"
                                src={logo_small}
                                alt="only hentai"
                            />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-12 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (

                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >  <item.Icon className='w-5 h-5 mr-2 text-gray-900' />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="flex items-center py-6">
                                <PowerIcon className='w-5 h-5 mr-2 text-gray-900' />
                                {!user ? (<button
                                    onClick={() => setFormOpened(true)}
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Log in
                                </button>) : (<button
                                    onClick={logOut}
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Log Out
                                </button>)}
                            </div>
                            <button
                                onClick={() => {
                                    router.push('/plans')
                                    setMobileMenuOpen(false)
                                }}
                                className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-md hover:bg-primaryDark"
                            >
                                Upgrade
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}


export default Header;