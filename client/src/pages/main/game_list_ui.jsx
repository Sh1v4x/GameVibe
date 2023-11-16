import React, { useState } from "react";
import { observer } from "mobx-react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faHeart } from "@fortawesome/free-solid-svg-icons";

const GameList = observer(({ playlistStore, userStore }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const isPlayerOpen =
    playlistStore.selectedGame.length !== 0 ? "playerOpen" : "playerClose";

  const searchGame = playlistStore.allPlaylist.filter((game) => {
    if (playlistStore.searchGame && game.name) {
      return game.name
        .toLowerCase()
        .includes(playlistStore.searchGame.toLowerCase());
    }
    return false;
  });

  const games =
    playlistStore.searchGame !== null ? searchGame : playlistStore.allPlaylist;

  return (
    <div className={`homepage`}>
      <div className="homepage-game-list">
        <div className={`game-list-container ${isPlayerOpen}`}>
          {games.map((game, index) => (
            <Link
              to={`/playlist/${game.name}`}
              className="game-thumbnail"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              key={game.id}
              onClick={(event) => {
                event.stopPropagation();
              }}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <img src={game.img.url} alt={game.name} />
              <h3 className="desktop-title">{game.name}</h3>
              <h3
                className="phone-title"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  playlistStore.setSongIndex(0);
                  playlistStore.setSelectedGame(game.playlist);
                }}
              >
                {game.name}
              </h3>
              {hoveredIndex === index ? (
                <div className="icon-container">
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (userStore.username) {
                        const isLiked = userStore.isPlaylistLiked(game.id);
                        if (isLiked) {
                          userStore.onDislikePlaylist(game.id);
                        } else {
                          userStore.onLikePlaylist(game.id);
                        }
                      } else {
                        navigate("/login");
                      }
                    }}
                    className={`like-button ${
                      userStore.likedPlaylist.includes(game.id)
                        ? "liked"
                        : "not-liked"
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} className="like-icon" />
                  </button>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      playlistStore.setSongIndex(0);
                      playlistStore.setSelectedGame(game.playlist);
                    }}
                    className="play-button"
                  >
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      className="play-icon"
                    />
                  </button>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

export default GameList;
