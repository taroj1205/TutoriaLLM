import { useAtomValue } from "jotai";
import { LanguageToStart } from "../state";
import LoginPopup from "../components/loginPopup";
import { useEffect, useState } from "react";
import Navbar from "../components/Admin/Navbar";
import SideBar from "../components/Admin/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/Admin/tabs/Dashboard";
import Users from "../components/Admin/tabs/Users";
import Settings from "../components/Admin/tabs/Settings";
import Tutorials from "../components/Admin/tabs/Tutorials";
import i18next from "i18next";

export default function AdminPage() {
  const languageToStart = useAtomValue(LanguageToStart);
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || languageToStart;
    i18next.changeLanguage(storedLanguage);
    console.log("languageToStart", storedLanguage);
  }, [languageToStart]);

  useEffect(() => {
    async function fetchAuthInfo() {
      const response = await fetch("/auth/session");
      if (response.status === 200) {
        const authInfo = await response.json();
        console.log("authInfo", authInfo.session);
        setIsAuthenticated(true);
        setShowPopup(false);
      } else {
        console.log("auth failed");
        setIsAuthenticated(false);
        setShowPopup(true);
      }
    }
    fetchAuthInfo();
  }, []);

  useEffect(() => {
    localStorage.setItem("language", languageToStart);
    i18next.changeLanguage(languageToStart);
  }, [languageToStart]);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-200 text-gray-800">
      {isAuthenticated ? (
        <div>
          <Navbar />
          <div className="h-full flex">
            <SideBar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <LoginPopup
          langToStart={languageToStart}
          isPopupOpen={showPopup}
          message="You need to login to access this page"
        />
      )}
    </div>
  );
}