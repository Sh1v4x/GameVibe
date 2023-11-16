import React from "react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";

const Playlist = observer(({ playlistStore, userStore, languageContext }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { gameName } = useParams();
  const isPlayerOpen =
    playlistStore.selectedGame.length !== 0 ? "playerOpen" : "playerClose";

  useEffect(() => {
    playlistStore
      .initSelectedPlaylist()
      .then(() => {
        playlistStore.allPlaylist.forEach((game) => {
          if (game.name === gameName) {
            playlistStore.setSelectedPlaylist(game);
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gameName, playlistStore]);

  const gameSongs = playlistStore.selectedPlaylist;
  const gameDataArray = [];

  if (isLoading) {
    return <div>{languageContext.loading}</div>;
  }

  const isLiked = gameSongs
    ? userStore.likedPlaylist.includes(gameSongs.id)
    : null;

  const toggleLike = () => {
    if (userStore.username) {
      if (isLiked) {
        userStore.onDislikePlaylist(gameSongs.id);
      } else {
        userStore.onLikePlaylist(gameSongs.id);
      }
    } else {
      navigate("/login");
    }
  };

  const isSongLiked = (songId) => {
    return userStore.isSongLiked(songId);
  };

  const toggleSongLike = (songId) => {
    if (userStore.username) {
      if (isSongLiked(songId)) {
        userStore.onDislikeSong(songId);
      } else {
        userStore.onLikeSong(songId);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={`playlist-container ${isPlayerOpen}`}>
      <img
        className="img-header"
        src={gameSongs ? gameSongs.img.url : null}
        alt=""
      />
      <div className="playlist-header-top">
        {gameSongs ? (
          <React.Fragment>
            <img src={gameSongs.img.url} alt={gameSongs.name} />
            <button
              onClick={(event) => {
                event.stopPropagation();
                toggleLike();
              }}
              className="like-button"
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={`like-icon ${isLiked ? "liked" : "not-liked"}`}
              />
            </button>
          </React.Fragment>
        ) : null}
        <span></span>
        <h1 className="playlist-title">
          {gameSongs ? gameSongs.name : `${userStore.username}'s liked songs`}
        </h1>
      </div>
      <div className="playlist-content">
        <table className="song-table">
          <tbody>
            {gameSongs.playlist.map((song, index) => (
              <tr key={index} className="song-item">
                <td className={`index`}>
                  <p># {index}</p>
                </td>
                {!gameSongs ? (
                  <td>
                    <img
                      src={gameDataArray[index].img.url}
                      alt={gameDataArray[index].name}
                    />
                  </td>
                ) : null}
                <td className="song-name flex-item">
                  <p>{song.name}</p>
                </td>
                <td>
                  <button
                    onClick={() => {
                      toggleSongLike(song.msc.id);
                    }}
                    className={`like-button ${
                      userStore.likedSong.includes(song.msc.id)
                        ? "liked"
                        : "not-liked"
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
                      playlistStore.setSelectedGame(gameSongs.playlist);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      className="play-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default Playlist;
