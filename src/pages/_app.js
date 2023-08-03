import "@/styles/globals.css";
import { Inter } from 'next/font/google'
import Header from "../components/Header"
import Footer from "@/components/Footer";
import { AuthProvider } from '../context/AuthContext'
import { GlobalProvider } from "@/context/GlobalContext";

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>

      <GlobalProvider>
        <div className="relative">
          <Header />
          <div className="mt-20 p-20 min-h-90vh">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </GlobalProvider>
    </AuthProvider>
  )
}
