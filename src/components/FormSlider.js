import { useState } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function FormSlider({ formOpened, setFormOpened }) {
  const [isSignIn, setIsSignIn] = useState(true);

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
                      {isSignIn ? <SignIn setFormOpened={setFormOpened} setIsSignIn={setIsSignIn} /> : <SignUp setFormOpened={setFormOpened} setIsSignIn={setIsSignIn} />}
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
