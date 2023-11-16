import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";

const AdminPlaylist = observer(({ languageContext, adminStore }) => {
  return (
    <div className="admin-panel-content-item">
      <h1>{languageContext.playlist}</h1>
      <ul>
        {adminStore.adminPlaylist.map((playlist) => (
          <li key={playlist._id} className="list-item">
            <button
              href="#"
              onClick={() => {
                adminStore.setAdminPlaylistContent(playlist.id);
              }}
            >
              <p>{playlist.name}</p>
            </button>
            <div className="icon-container">
              <button
                onClick={() => {
                  adminStore.setModale("editModale");
                  adminStore.setItemToEdit(playlist._id);
                  adminStore.setComponentToSend("playlist");
                }}
              >
                <i>
                  <FontAwesomeIcon icon={faPen} />
                </i>
              </button>
              <button
                onClick={() => {
                  adminStore.setModale("deleteModale");
                  adminStore.setItemToDelete(playlist._id);
                  adminStore.setComponentToSend("playlist");
                }}
              >
                <i>
                  <FontAwesomeIcon icon={faTrash} />
                </i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default AdminPlaylist;
