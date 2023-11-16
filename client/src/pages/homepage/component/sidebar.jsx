import React, { useRef } from "react";
import { observer } from "mobx-react";
import { useLocation } from "react-router-dom";
import useWindowSize from "../../../shared/function/use_window_size";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMusic,
  faUser,
  faCompactDisc,
  faArrowRightFromBracket,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Sidebar = observer(({ sidebarStore, userStore, languageContext }) => {
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const sidebarClass = sidebarStore.isSidebarOpen ? "sidebar open" : "sidebar";
  const location = useLocation();

  const sidebarRef = useRef(null);

  const handleOutsideClick = (event) => {
    const hamburger = document.querySelector(".header-icon");
    const sidebar = document.querySelector(".sidebar");

    if (
      sidebarStore.isSidebarOpen &&
      sidebarRef.current &&
      !sidebar.contains(event.target) &&
      !hamburger.contains(event.target)
    ) {
      sidebarStore.closeSidebar();
    }
  };

  if (sidebarStore.isSidebarOpen) {
    document.addEventListener("mousedown", handleOutsideClick);
  } else {
    document.removeEventListener("mousedown", handleOutsideClick);
  }

  return (
    <aside
      ref={sidebarRef}
      className={`${sidebarClass} ${isMobile ? "mobile" : "desktop"}`}
    >
      <nav className="sidebar-menu">
        <h4>{languageContext.browse}</h4>
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link
              to="/"
              onClick={() => {
                sidebarStore.closeSidebar();
              }}
              className="sidebar-link"
            >
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
              {languageContext.home}
            </Link>
          </li>
          <li
            className={
              location.pathname === "/liked_playlist/" + userStore.username
                ? "active"
                : ""
            }
          >
            <Link
              to={"/liked_playlist/" + userStore.username}
              onClick={() => {
                sidebarStore.closeSidebar();
              }}
              className={`sidebar-link ${
                userStore.username != null ? "" : "not-connected"
              }`}
            >
              <FontAwesomeIcon icon={faCompactDisc} className="sidebar-icon" />
              {languageContext.liked_playlist}
            </Link>
          </li>
          <li
            className={
              location.pathname === "/liked_songs/" + userStore.username
                ? "active"
                : ""
            }
          >
            <Link
              to={"/liked_songs/" + userStore.username}
              onClick={() => {
                sidebarStore.closeSidebar();
              }}
              className={`sidebar-link ${
                userStore.username != null ? "" : "not-connected"
              }`}
            >
              <FontAwesomeIcon icon={faMusic} className="sidebar-icon" />
              {languageContext.liked_songs}
            </Link>
          </li>
          <li
            className={
              location.pathname === "/account/" + userStore.username
                ? "active"
                : ""
            }
          >
            <Link
              to={
                userStore.username ? "/account/" + userStore.username : "/login"
              }
              onClick={() => {
                sidebarStore.closeSidebar();
              }}
              className="sidebar-link"
            >
              <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
              {userStore.username
                ? languageContext.account
                : languageContext.login}
            </Link>
          </li>
          {userStore.isAdmin === true ? (
            <li
              className={location.pathname === "/admin_panel" ? "active" : ""}
            >
              <Link to="/admin_panel" className="sidebar-link">
                <FontAwesomeIcon
                  icon={faScrewdriverWrench}
                  className="sidebar-icon"
                />
                {languageContext.admin_panel}
              </Link>
            </li>
          ) : null}
          {userStore.username != null ? (
            <li>
              <button
                className="sidebar-link"
                onClick={() => {
                  userStore.onDisconnect();
                  window.location.reload();
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="sidebar-icon"
                />
                {languageContext.logout}
              </button>
            </li>
          ) : (
            <li></li>
          )}
        </ul>
      </nav>
    </aside>
  );
});

export default Sidebar;
