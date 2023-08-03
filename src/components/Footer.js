import logo_small from '../../public/logo_small.svg'
import twitter_icon from '../../public/twitter_icon.svg'
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="flex items-center justify-center py-4 px-12 bg-gray-800 text-white space-x-2 sm:space-x-6 text-xs w-full bottom-0">
            <Link href="/" className="hover:underline"> <Image
                src={logo_small}  // replace with your actual logo path
                width={50}
                height={50}
                alt="Logo"
            /></Link>
            <Link href="/terms-and-services" className="hover:underline" target="_blank">Terms & Services</Link>
            <Link href="/privacy-policy" className="hover:underline" target="_blank">Privacy Policy</Link>
            <Link href="/contact-us" className="hover:underline" target="_blank">Contact Us</Link>
            <Link href="https://twitter.com/onlyhentaiapp" target="_blank" rel="noopener noreferrer">
                <Image
                    src={twitter_icon}  // replace with your actual logo path
                    width={26}
                    height={26}
                    alt="Logo"
                />
            </Link>
        </footer>
    );
};

export default Footer;
