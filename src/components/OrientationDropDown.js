import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

const orientations = [
    { id: 1, name: 'Square', value: 'square' },
    { id: 2, name: 'Landscape (3:2)', value: 'landscape' },
    { id: 3, name: 'Portrait (2:3', value: 'portrait' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function OrientationDropDown({ orientation, setOrientation }) {

    const [selected, setSelected] = useState(orientations[0])
    const handleOrientationChange = (orientation) => {
        setSelected(orientation)
        setOrientation(orientation.value)
    }



    return (
        <Listbox value={selected} onChange={handleOrientationChange}>
            {({ open }) => (
                <>
                    {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Orientation</Listbox.Label> */}
                    <div className="relative w-36 text-xs">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {orientations.map((orientation) => (
                                    <Listbox.Option
                                        key={orientation.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={orientation}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                    {orientation.name}
                                                </span>

                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
