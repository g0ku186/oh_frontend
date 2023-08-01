import { useState } from 'react'
import Link from 'next/link'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../../public/logo.svg'
import logo_small from '../../public/logo_small.svg'
import Image from 'next/image'
import FormSlider from './FormSlider'
import { userAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const navigation = [
    { name: 'Profile', href: '/profile' },
]
const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [formOpened, setFormOpened] = useState(false)
    const { user, logOut } = userAuth();
    const router = useRouter();
    return (
        <header className="bg-white">
            <nav className="fixed h-20 z-20 bg-white w-full mx-auto flex items-center justify-between p-6 lg:px-20 top-0" aria-label="Global">
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
                        <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                            {item.name}
                        </Link>
                    ))}
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
                    <button
                        onClick={() => router.push('/plans')}
                        className="px-4 py-2 text-sm font-bold text-white bg-secondary rounded-md shadow-sm hover:bg-black border"
                    >
                        Upgrade
                    </button>

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
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6">
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
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}


export default Header;