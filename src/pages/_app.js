import "@/styles/globals.css";
import Header from "../components/Header"
import Footer from "@/components/Footer";
import { AuthProvider } from '../context/AuthContext'
import { GlobalProvider } from "@/context/GlobalContext";
import Notification from "@/components/Notification";
import CustomErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }) {
  return (
    <CustomErrorBoundary>
      <AuthProvider>
        <GlobalProvider>
          <div className="relative">
            <Header />
            <div className="mt-20 sm:p-20 min-h-90vh w-full">
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
          <Notification />
        </GlobalProvider>
      </AuthProvider>
    </CustomErrorBoundary>
  )
}
