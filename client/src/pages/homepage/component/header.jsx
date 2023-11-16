import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";
import useWindowSize from "../../../shared/function/use_window_size";
import { Link, useNavigate } from "react-router-dom";

const Header = observer(
  ({ sidebarStore, userStore, languageContext, playlistStore }) => {
    const { width } = useWindowSize();
    const [searchView, setSearchView] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (searchView && width < 1023) {
        inputRef.current.focus();
      } else {
        window.onpopstate = null;
      }

      if (width > 1023) {
        setSearchView(false);
        playlistStore.setSearchGame(null);
      }
    }, [playlistStore, searchView, userStore, width]);

    const handleSearch = (event) => {
      event.preventDefault();
      navigate("/");
      const search = event.target.value;
      if (search === "") {
        playlistStore.setSearchGame(null);
      } else {
        playlistStore.setSearchGame(search);
      }
    };

    return (
      <header>
        {!searchView ? (
          <nav className="header-nav">
            <div className="header-left">
              <button
                onClick={() => sidebarStore.toggleSidebar()}
                className="header-icon"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <Link to="/" className="logo">
                {languageContext.title}
              </Link>
            </div>
            <div className="header-middle">
              <div className="searchbar">
                <label htmlFor="search">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="header-icon"
                  />
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder={languageContext.search}
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                />
              </div>
              <Link to="/" className="mobile-logo">
                {languageContext.title}
              </Link>
            </div>
            <div className="header-right">
              {!userStore.username ? (
                <ul className="nav-links">
                  <li>
                    <a href="/login">{languageContext.login}</a>
                    <span className="separator">/</span>
                    <a href="/register">{languageContext.create_account}</a>
                  </li>
                </ul>
              ) : (
                <ul className="nav-links_connected">
                  <li>
                    <Link to={"/account/" + userStore.username}>
                      {userStore.username}
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            <div className="header-right-mobile">
              <button
                className="header-icon"
                onClick={() => setSearchView(true)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </nav>
        ) : (
          <>
            <div className="mobile-searchbar">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  name="search"
                  placeholder={languageContext.search}
                  autoComplete="off"
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                />
              </div>
            </div>
            <button
              className="header-close-icon"
              onClick={() => {
                setSearchView(false);
                playlistStore.setSearchGame(null);
              }}
            >
              <FontAwesomeIcon icon={faXmark} className="close-icon" />
            </button>
          </>
        )}
      </header>
    );
  }
);

export default Header;
