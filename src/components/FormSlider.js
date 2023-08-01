import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SignIn from './SignIn';

export default function FormSlider({ formOpened, setFormOpened }) {


  const inputClassName =
    'form-input block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6';
  const inputErrorClassName =
    'form-input block w-full rounded-md border-0 p-1.5 text-red-700 shadow-sm ring-1 ring-inset ring-red-500 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary text-xs sm:leading-6';
  const inputLabelClassName =
    'block text-sm font-medium leading-6 text-gray-900';
  return (
    <>
      <Transition.Root show={formOpened} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={setFormOpened}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className='bg-white h-full flex flex-col items-center justify-center'>
                      <SignIn setFormOpened={setFormOpened} />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
