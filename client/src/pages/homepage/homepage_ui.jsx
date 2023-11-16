import React from "react";
import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import Header from "./component/header";
import Sidebar from "./component/sidebar";
import Player from "./component/audioplayer";


const HomePage = observer(
  ({
    keyboardStore,
    userStore,
    sidebarStore,
    playlistStore,
    languageContext,
    navigationStore,
  }) => {
    return (
      <React.Fragment>
        <Header
          sidebarStore={sidebarStore}
          keyboardStore={keyboardStore}
          userStore={userStore}
          languageContext={languageContext}
          navigationStore={navigationStore}
          playlistStore={playlistStore}
        />
        <Sidebar
          sidebarStore={sidebarStore}
          userStore={userStore}
          languageContext={languageContext}
          navigationStore={navigationStore}
        />
        <Player playlistStore={playlistStore} userStore={userStore} />
        <Outlet />
      </React.Fragment>
    );
  }
);

export default HomePage;
