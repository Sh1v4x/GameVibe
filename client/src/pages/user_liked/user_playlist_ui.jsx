import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { observer } from "mobx-react";

const Playlist = observer(({ userStore, playlistStore, languageContext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const isPlayerOpen =
    playlistStore.selectedGame.length !== 0 ? "playerOpen" : "playerClose";

  useEffect(() => {
    userStore.initUserSongs().then(() => {
      setIsLoading(false);
    });
  }, [userStore]);

  if (isLoading) {
    return <div className="loading">{languageContext.loading}</div>;
  }

  if (userStore.gameSongs.length === 0) {
    return (
      <div className="no-content">
        <h1>{languageContext.empty_user_liked_songs}</h1>
        <Link to="/" className="return-home">
          <p>{languageContext.back_to_home}</p>
        </Link>
      </div>
    );
  }

  return (
    <div className={`playlist-container ${isPlayerOpen}`}>
      <div className="playlist-header">
        <div className="playlist-filter-img"></div>
        <div className="liked-songs-header-top">
          <span></span>
          <h1 className="playlist-title">
            {`${userStore.username}'s liked songs`}
          </h1>
        </div>
      </div>
      <div className="playlist-content">
        <table className="song-table">
          <tbody>
            {userStore.gameSongs.map((game, index) => {
              const songId = game.msc.id;
              const isSongLiked = userStore.isSongLiked(songId);

              return (
                <tr key={index} className="song-item">
                  <td className={`index`}>
                    <p># {index}</p>
                  </td>
                  <td>
                    <img src={game.img.url} alt={game.name} />
                  </td>
                  <td className="song-name flex-item">
                    <p>{game.name}</p>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        if (userStore.username) {
                          if (isSongLiked) {
                            userStore.onDislikeSong(songId);
                          } else {
                            userStore.onLikeSong(songId);
                          }
                        } else {
                          navigate("/login");
                        }
                      }}
                      className={`like-button ${
                        isSongLiked ? "liked" : "not-liked"
                      }`}
                    >
                      <FontAwesomeIcon icon={faHeart} className="like-icon" />
                    </button>
                  </td>
                  <td className="play-icon-element">
                    <button
                      className="play-button"
                      onClick={() => {
                        playlistStore.setSongIndex(index);
                        playlistStore.setSelectedGame(userStore.gameSongs);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCirclePlay}
                        className="play-icon"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default Playlist;
