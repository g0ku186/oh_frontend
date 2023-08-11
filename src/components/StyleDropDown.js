import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

const styles = [
    { id: 1, name: 'Classic Style', value: 'classic' },
    { id: 2, name: 'Pure Anime', value: 'anime' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function StyleDropDown({ style, setStyle }) {
    const currentStyle = styles.find(s => s.value === style) || styles[0];
    const [selected, setSelected] = useState(currentStyle)
    const handleStyleChange = (style) => {
        setSelected(style)
        setStyle(style.value)
    }

    return (
        <Listbox value={selected} onChange={handleStyleChange}>
            {({ open }) => (
                <>
                    {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Orientation</Listbox.Label> */}
                    <div className="relative w-36 text-xs">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
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
                                {styles.map((style) => (
                                    <Listbox.Option
                                        key={style.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-primary text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={style}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                    {style.name}
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
