import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
    {
        question: "Can I produce NSFW content?",
        answer:
            "Yes, you can. We do not censor the generated images. But, it's important to act responsibly and legally while generating these NSFW images. Please remember that we prohibit any illegal content, and we hold the right to remove or ban inappropriate content.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "For your convenience, we process payments through Gumroad, a widely trusted payment provider utilized by numerous businesses. Gumroad accepts both credit card and PayPal payments. Rest assured, we do not store your credit card information.",
    },
    {
        question: "Who owns the license to the images I create?",
        answer:
            "You retain full ownership of the images you generate using our service.",
    },
    {
        question: "How do I cancel my plan?",
        answer:
            "Yes, you are free to cancel your plan any time. Canceling your subscription is easy. Just log into your account, and visit the profile page. You can find options to manage your subscription.",
    },
    {
        question: "Can I get a refund?",
        answer:
            "Regrettably, due to the unique nature of our service, we are unable to offer refunds at this time. If you're uncertain about committing, consider trying our service for a single month before opting for a longer subscription.",
    },

]

export default function FAQs() {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                    <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        <h2 className="text-base font-semibold leading-7 text-primary">FAQs</h2>
                        <p className="mt-2 text-lg font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Know before you buy
                        </p>
                    </div>
                    <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                        {faqs.map((faq) => (
                            <Disclosure as="div" key={faq.question} className="pt-6">
                                {({ open }) => (
                                    <>
                                        <dt>
                                            <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                                <span className="text-base font-semibold leading-7">{faq.question}</span>
                                                <span className="ml-6 flex h-7 items-center">
                                                    {open ? (
                                                        <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                                    ) : (
                                                        <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                            <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}