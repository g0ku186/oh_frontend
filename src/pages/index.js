import { useEffect, useState } from "react"
import CreateImage from "../components/CreateImage"
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import { userAuth } from "../context/AuthContext";
import { useGlobalContext } from "@/context/GlobalContext";
import ListUserImages from "@/components/ListUserImages";



export default function Home() {
  //loading from contexts
  const { user } = userAuth();
  const idToken = user ? user.accessToken : null;

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <div className="w-full">
        <CreateImage />
        <ListUserImages />

      </div>
    </main>
  )
}
