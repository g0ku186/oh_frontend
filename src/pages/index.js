import { useState } from "react";
import CreateImage from "../components/CreateImage"
import { userAuth } from "../context/AuthContext";
import ListUserImages from "@/components/ListUserImages";
import ListPublicImages from "@/components/ListPublicImages";
import { LoveFilledIcon, BulbIcon, UserIcon } from "@/components/Icons";
import Tabs from "@/components/Tabs";


export default function Home() {
  const { user } = userAuth();
  const idToken = user ? user.accessToken : null;
  const [selectedTab, setSelectedTab] = useState('Get Inspired');

  const tabs = [
    { name: 'Get Inspired', icon: BulbIcon },
    { name: 'My Generations', icon: UserIcon },
    { name: 'Favourites', icon: LoveFilledIcon },
  ]

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
        <CreateImage />
        <Tabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {renderPageBasedOnTab()}
      </div>
    </main>
  )
}
