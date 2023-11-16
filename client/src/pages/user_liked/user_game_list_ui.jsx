import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UserGameList = observer(
  ({ playlistStore, userStore, languageContext }) => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const isPlayerOpen =
      playlistStore.selectedGame.length !== 0 ? "playerOpen" : "playerClose";

    useEffect(() => {
      const initUserPlayslist = async () => {
        try {
          axios
            .get("http://localhost:8000/userPlaylist", {
              withCredentials: true,
            })
            .then((response) => {
              setGames(response.data);
              setIsLoading(false);
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                console.log("L'utilisateur n'est pas connecté.");
              }
            });
        } catch (error) {}
      };
      initUserPlayslist();
    }, []);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const navigate = useNavigate();

    if (isLoading) {
      return <div className="loading">{languageContext.loading}</div>;
    }

    if (games.length === 0) {
      return (
        <div className="no-content">
          <h1>{languageContext.empty_user_liked_playlist}</h1>
          <Link to="/" className="return-home">
            <p>{languageContext.back_to_home}</p>
          </Link>
        </div>
      );
    }

    return (
      <div className={`homepage `}>
        <h1 className="user-playlist">
          {userStore.username + "'s liked playlist"}
        </h1>

        <div className={`homepage-game-list user-game-list ${isPlayerOpen}`}>
          <div className={`game-list-container `}>
            {games.map((game, index) => (
              <Link
                to={`/playlist/${game.name}`}
                className="game-thumbnail"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                key={game.id}
                onClick={(event) => {
                  event.stopPropagation();
                  playlistStore.setGameTitle(game.name);
                }}
              >
                <img src={game.img.url} alt={game.name} />
                <h3>{game.name}</h3>
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
                            const updatedGames = games.filter(
                              (g) => g.id !== game.id
                            );
                            setGames(updatedGames);
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
  }
);

export default UserGameList;
