import Link from 'next/link'
import FAQs from '@/components/FAQs'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from '@/constants/constants'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function FAQPage() {
    return (
        <div>
            <div className="relative isolate bg-white px-6 lg:px-8">
                <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                    <div
                        className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#F3B454] to-[#ED68EF] opacity-50"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>


                <FAQs />

            </div>

        </div>
    )
}