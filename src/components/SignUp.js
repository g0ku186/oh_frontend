import Link from "next/link";
import Image from "next/image";
import google_icon from "../../public/google_icon.svg";
import { userAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import axios from 'axios';
import { useGlobalContext } from "@/context/GlobalContext";
const baseUrl = process.env.API_BASE_URL;

const SignUp = ({ setFormOpened, setIsSignIn }) => {
  const { googleSignIn, emailSignUp, verifyEmail, logOut } = userAuth();
  const router = useRouter();
  const { handleShowNotification } = useGlobalContext();

  // Function to handle Email and Password sign-in
  // Function to handle Google sign-in
  const signInWithGoogle = async () => {
    try {
      const userCredential = await googleSignIn();
      const user = userCredential.user;
      // Redirect to the home page after successful sign-in
      if (user) {
        const idToken = userCredential._tokenResponse.idToken;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': idToken
        }
        const response = await axios.post(`${baseUrl}/api/v1/user/login`, {}, { headers: headers });
        setFormOpened(false);
        router.push("/profile");
      }
    } catch (error) {
      handleShowNotification({ "title": "Something went wrong. Please reach out to support" }, "error");
    }
  };

  const handleEmailSignUp = async (event) => {
    event.preventDefault();
    // Get email and password from form
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
      const userCredential = await emailSignUp(email, password);
      await verifyEmail();
      handleShowNotification({ "title": "Please check your mail for verification link" }, "success");

      const idToken = userCredential._tokenResponse.idToken;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': idToken
      }
      const response = await axios.post(`${baseUrl}/api/v1/user/login`, {}, { headers: headers });
      logOut();


    } catch (error) {
      console.error(error.message);
      switch (error.code) {
        case "auth/invalid-email":
          handleShowNotification({ "title": "Invalid email" }, "error");
          break;
        case "auth/user-disabled":
          handleShowNotification({ "title": "User disabled" }, "error");
          break;
        case "auth/email-already-in-use":
          handleShowNotification({ "title": "Email already exists. Please sign in instead." }, "error");
          break;

        default:
          handleShowNotification({ "title": "Something went wrong" }, "error");
      }

    }
  };

  return (
    <>
      <div className="flex">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 lg:flex-none">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Sign Up
              </h2>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form
                  onSubmit={handleEmailSignUp}
                  className="space-y-6 text-gray-900"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="form-input block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="form-input block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm flex justify-between w-full">
                      <div
                        onClick={() => setIsSignIn(true)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                      >
                        Already have an account? Sign in
                      </div>

                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <div>
                      <button
                        onClick={signInWithGoogle}
                        className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Image
                          src={google_icon}
                          alt="Google Logo"
                          width="auto"
                          height="auto"
                          className="w-8 h-8"
                        />
                        <span className="ml-1">Sign up with Google</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
