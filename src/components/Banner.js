import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'


export default function Banner() {
    const [show, setShow] = useState(true)
    return (
        <>
            {show && (<div className="flex items-center gap-x-6 bg-red-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 fixed w-full right-0 bottom-0">
                <p className="text-sm leading-6 text-white">
                    Service Notice: We are shutting down our services starting Sept 20th, 2023. If you have any queries please send an email to onlyhentaiteam@gmail.com
                </p>
                <div className="flex flex-1 justify-end">
                    <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={() => setShow(false)}>
                        <span className="sr-only">Dismiss</span>
                        <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </button>
                </div>
            </div>)}
        </>
    )
}
