import React from "react";
import { observer } from "mobx-react";

const AdminAddNewContent = observer(({ adminStore, languageContext }) => {
  return (
    <div className="admin-panel-add_new_content">
      <h2>{languageContext.add_playlist}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          adminStore.handleSubmit();
        }}
      >
        <div>
          <label>{languageContext.playlist_name}:</label>
          <input
            type="text"
            value={adminStore.playlistName}
            onChange={(e) => adminStore.setPlaylistName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{languageContext.playlist_image}:</label>
          <input
            type="file"
            accept="image/jpeg"
            onChange={(e) => {
              adminStore.setImageFile(e.target.files[0]);
            }}
            required
          />
        </div>
        <div>
          <label>{languageContext.playlist_music}:</label>
          <input
            type="file"
            accept="audio/mpeg"
            multiple
            onChange={(e) => {
              adminStore.setMusicFile(Array.from(e.target.files));
            }}
            required
          />
        </div>
        <button type="submit">{languageContext.add_playlist_button}</button>
      </form>
    </div>
  );
});

export default AdminAddNewContent;
