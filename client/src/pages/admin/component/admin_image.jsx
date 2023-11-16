// AdminImage.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";

const AdminImage = observer(({ adminStore, openAddImageModal, languageContext }) => {
  return (
    <div className="admin-panel-content-item">
      <h1>{languageContext.image}</h1>
      <ul>
        {adminStore.adminPlaylistContent.map((song) => (
          <li key={song.id}>
            <img src={song.img.url} alt={song.name} />
          </li>
        ))}
        <li>
          <button className="add-new-song" onClick={() => {adminStore.setModale("addImageModale")}}>
            <FontAwesomeIcon icon={faPlus} /> {languageContext.modify_image}
          </button>
        </li>
      </ul>
    </div>
  );
});

export default AdminImage;
