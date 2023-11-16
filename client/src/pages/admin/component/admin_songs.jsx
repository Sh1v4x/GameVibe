import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";

const AdminSongs = observer(({ adminStore, languageContext }) => {
  return (
    <div className="admin-panel-content-item">
      <h1>{languageContext.songs}</h1>
      <ul>
        {adminStore.adminPlaylistContent.map((song) =>
          song.playlist.map((song) => (
            <li key={song.msc.id}>
              <p>{song.name}</p>
              <div className="icon-container">
                <button
                  onClick={() => {
                    adminStore.setModale("editModale");
                    adminStore.setItemToEdit(song.msc.id);
                    adminStore.setComponentToSend("song");
                  }}
                >
                  <i>
                    <FontAwesomeIcon icon={faPen} />
                  </i>
                </button>
                <button
                  onClick={() => {
                    adminStore.setModale("deleteModale");
                    adminStore.setItemToDelete(song.msc.id);
                    adminStore.setComponentToSend("song");
                  }}
                >
                  <i>
                    <FontAwesomeIcon icon={faTrash} />
                  </i>
                </button>
              </div>
            </li>
          ))
        )}
        <li>
          <button
            className="add-new-song"
            onClick={() => {
              adminStore.setModale("addSongModale");
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> {languageContext.add_song}
          </button>
        </li>
      </ul>
    </div>
  );
});

export default AdminSongs;
