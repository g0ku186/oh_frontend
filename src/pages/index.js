import { useState } from "react";
import CreateImage from "../components/CreateImage"
import { userAuth } from "../context/AuthContext";
import { useGlobalContext } from "@/context/GlobalContext";
import ListUserImages from "@/components/ListUserImages";
import ListPublicImages from "@/components/ListPublicImages";
import { LoveFilledIcon, BulbIcon, UserIcon } from "@/components/Icons";
import Tabs from "@/components/Tabs";


export default function Home() {
  const { user } = userAuth();
  const idToken = user ? user.accessToken : null;
  const [selectedTab, setSelectedTab] = useState('Get Inspired');
  const { setBookmark } = useGlobalContext();

  const tabs = [
    { name: 'Get Inspired', icon: BulbIcon },
    { name: 'My Generations', icon: UserIcon },
    { name: 'Favourites', icon: LoveFilledIcon },
  ]

  const handleTabChange = (tab) => {
    if (tab === 'Favourites') {
      setBookmark(true);
    }
    else {
      setBookmark(false);
    }
    setSelectedTab(tab);
  }

  const renderPageBasedOnTab = () => {
    switch (selectedTab) {
      case 'Get Inspired':
        return <ListPublicImages />;
      case 'My Generations':
        return <ListUserImages />;
      case 'Favourites':
        return <ListUserImages />;
      default:
        return <ListPublicImages />;
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-full">
        <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[50.1875rem] bg-gradient-to-tr from-[#F3B454] to-[#ED68EF] opacity-50"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <CreateImage handleTabChange={handleTabChange} />
        <Tabs tabs={tabs} selectedTab={selectedTab} handleTabChange={handleTabChange} />
        {renderPageBasedOnTab()}
      </div>
    </main>
  )
}
