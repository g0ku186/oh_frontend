import Link from 'next/link'
import FAQs from '@/components/FAQs'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from '@/constants/constants'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Plans() {
    return (
        <div>
            <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                    <div
                        className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#F3B454] to-[#ED68EF] opacity-50"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                    <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
                    <p className="mt-2 text-lg font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Join hundreds of happy customers
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    Cancel your subscription anytime. No commitments! Our product speaks for itself.
                </p>
                {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    We offer 'Build your own plan'. <span className='font-bold text-indigo-600 underline'> <Link href="https://onlyhentai.gumroad.com/l/jhbig" target='_blank'>Click here </Link></span> to buy 50 image credits for $1 .
                </p> */}
                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                    {tiers.map((tier, tierIdx) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
                                tier.featured
                                    ? ''
                                    : tierIdx === 0
                                        ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                                        : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
                                'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
                            )}
                        >

                            <h3
                                id={tier.id}
                                className={classNames(
                                    tier.featured ? 'text-primary' : 'text-primary',
                                    'text-base font-semibold leading-7'
                                )}
                            >
                                {tier.name} {tier.featured ? <span>(-50%)</span> : null}
                            </h3>
                            <p className="mt-4 flex items-baseline gap-x-2">
                                <span
                                    className={classNames(
                                        tier.featured ? 'text-white flex flex-row' : 'text-gray-900',
                                        'text-5xl font-bold tracking-tight'
                                    )}
                                >
                                    {tier.price}
                                </span>
                                <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>{tier.frequency}</span>
                            </p>
                            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}>
                                {tier.description}
                            </p>
                            <ul
                                role="list"
                                className={classNames(
                                    tier.featured ? 'text-gray-300' : 'text-gray-600',
                                    'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
                                )}
                            >
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon
                                            className={classNames(tier.featured ? 'text-primary' : 'text-primary', 'h-6 w-5 flex-none')}
                                            aria-hidden="true"
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                target='_blank'
                                href={tier.href}
                                aria-describedby={tier.id}
                                className={classNames(
                                    tier.featured
                                        ? 'bg-primary text-white shadow-sm hover:bg-primaryDark focus-visible:outline-primary'
                                        : 'text-primary ring-1 ring-inset ring-primary hover:bg-primary hover:text-white hover:ring-primary focus-visible:outline-primary',
                                    'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                                )}
                            >
                                Get started today
                            </Link>
                        </div>
                    ))}
                </div>

                <FAQs />

            </div>

        </div>
    )
}