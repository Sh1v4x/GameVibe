import AudioPlayer from "react-h5-audio-player";
import "../../../style/player.css";
import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const Player = observer(({ playlistStore }) => {
  const handleNext = () => {
    if (playlistStore.songIndex < playlistStore.selectedGame.length - 1) {
      playlistStore.setSongIndex(playlistStore.songIndex + 1);
    } else {
      playlistStore.setSongIndex(0);
    }
  };

  const handlePrevious = () => {
    if (playlistStore.songIndex > 0) {
      playlistStore.setSongIndex(playlistStore.songIndex - 1);
    } else {
      playlistStore.setSongIndex(playlistStore.selectedGame.length - 1);
    }
  };

  return (
    <React.Fragment>
      <div>
        <AudioPlayer
          className={`rhap_container ${
            playlistStore.selectedGame.length !== 0 ? "show" : "hide"
          }`}
          autoPlay={false}
          src={
            playlistStore.selectedGame.length !== 0
              ? playlistStore.selectedGame[playlistStore.songIndex].msc.url
              : ""
          }
          onPlay={(e) => {}}
          showSkipControls={true}
          showJumpControls={true}
          showDownloadProgress={true}
          showFilledProgress={true}
          showFilledVolume={true}
          onClickNext={handleNext}
          onClickPrevious={handlePrevious}
          header=<div>
            <button>
              <FontAwesomeIcon
                icon={faArrowDown}
                onClick={() => {
                  playlistStore.setSelectedGame([]);
                  playlistStore.setSongIndex(0);
                }}
              />
            </button>
            <h3>
              {playlistStore.selectedGame.length !== 0
                ? playlistStore.selectedGame[playlistStore.songIndex].name
                : ""}
            </h3>
          </div>
          autoPlayAfterSrcChange={true}
        />
      </div>
    </React.Fragment>
  );
});

export default Player;
