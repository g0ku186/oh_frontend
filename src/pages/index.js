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
    <main className="flex flex-col items-center justify-center h-full">
      <div className="w-full">
        <CreateImage handleTabChange={handleTabChange} />
        <Tabs tabs={tabs} selectedTab={selectedTab} handleTabChange={handleTabChange} />
        {renderPageBasedOnTab()}
      </div>
    </main>
  )
}
