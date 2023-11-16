import * as React from "react";
import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/login/login_ui";
import SidebarStore from "../store/sidebar_store";
import PlaylistStore from "../store/playlist_store";
import ErrorPage from "./error_page";
import GameList from "../../pages/main/game_list_ui";
import UserGameList from "../../pages/user_liked/user_game_list_ui";
import UserPlaylist from "../../pages/user_liked/user_playlist_ui";
import Account from "../../pages/account/account_ui";
import Playlist from "../../pages/main/playlist_ui";
import Register from "../../pages/login/registration_ui";
import UserStore from "../store/user_store";
import HomePage from "../../pages/homepage/homepage_ui";
import AdminPanel from "../../pages/admin/admin_panel_ui";
import { useLanguage } from "../language/language_context";
import fr from "../language/fr";
import en from "../language/en";
import AdminStore from "../store/admin_store";

function Router() {
  const sidebarStore = new SidebarStore();
  const playlistStore = new PlaylistStore();
  const adminStore = new AdminStore();
  const userStore = new UserStore();
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const languageContext = language === "fr" ? fr : en;
  const setLanguageContext = (language) => {
    setLanguage(language);
  };

  playlistStore.initSelectedPlaylist();
  userStore
    .initUser()
    .then(() => {
      setLanguage(userStore.language);
    })
    .finally(() => {
      setIsLoading(false);
    });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                playlistStore={playlistStore}
                userStore={userStore}
                sidebarStore={sidebarStore}
                languageContext={languageContext}
                language={language}
                setLanguageContext={setLanguageContext}
              />
            }
          >
            <Route
              path="/"
              element={
                <GameList playlistStore={playlistStore} userStore={userStore} />
              }
            />
            <Route
              path="/liked_playlist/:username"
              element={
                <UserGameList
                  playlistStore={playlistStore}
                  userStore={userStore}
                  languageContext={languageContext}
                />
              }
            />
            <Route
              path="/liked_songs/:username"
              element={
                <UserPlaylist
                  playlistStore={playlistStore}
                  userStore={userStore}
                  languageContext={languageContext}
                />
              }
            />
            <Route
              path="/account/:username"
              element={
                <Account
                  userStore={userStore}
                  languageContext={languageContext}
                  setLanguageContext={setLanguageContext}
                  language={language}
                />
              }
            />
            <Route
              path="/playlist/:gameName"
              element={
                <Playlist
                  playlistStore={playlistStore}
                  userStore={userStore}
                  languageContext={languageContext}
                />
              }
            />
          </Route>
          <Route
            path="/admin_panel"
            element={
              <AdminPanel
                adminStore={adminStore}
                languageContext={languageContext}
                userStore={userStore}
              />
            }
          />
          <Route path="/login" element={<LoginPage userStore={userStore} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default Router;
