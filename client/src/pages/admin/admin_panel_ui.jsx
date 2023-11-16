import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import AdminImage from "./component/admin_image";
import AdminSongs from "./component/admin_songs";
import AdminPlaylist from "./component/admin_playlist";
import AdminAddNewContent from "./component/admin_add_new_content";

const AdminPanel = observer(({ adminStore, languageContext, userStore }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAdminData = async () => {
      await userStore.updateUser();
      await adminStore.initAdminViewPlaylist();
      setIsLoading(false);
    };

    fetchAdminData();
  }, [adminStore, userStore]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <React.Fragment>
      {adminStore.isAuthorized ? (
        <div className="admin-panel-container">
          <div className="admin-panel-title">
            <a href="/">{languageContext.title}</a>
          </div>

          <div
            className={`admin-panel ${adminStore.modale ? "modal-open" : ""}`}
          >
            <div className="admin-panel-content">
              <AdminPlaylist
                languageContext={languageContext}
                adminStore={adminStore}
              />

              {adminStore.adminPlaylistContent.length > 0 && (
                <React.Fragment>
                  <AdminSongs
                    adminStore={adminStore}
                    languageContext={languageContext}
                  />
                  <AdminImage
                    adminStore={adminStore}
                    languageContext={languageContext}
                  />
                </React.Fragment>
              )}
            </div>
            <AdminAddNewContent
              adminStore={adminStore}
              languageContext={languageContext}
            />
            {adminStore.modale === "addSongModale" && (
              <div>
                <div className="modal add-song-modal">
                  <p>{languageContext.select_audio_file}</p>
                  <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) => {
                      adminStore.setMusicFile(e.target.files[0]);
                    }}
                  />
                  <div className="modal-buttons">
                    <button
                      onClick={() =>
                        adminStore.handleAddNewSong(
                          adminStore.musicFile,
                          adminStore.adminPlaylistContent[0].id
                        )
                      }
                    >
                      {languageContext.add_song}
                    </button>
                    <button onClick={() => adminStore.setModale(null)}>
                      {languageContext.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {adminStore.modale === "addImageModale" && (
              <div>
                <div className="modal add-image-modal">
                  <p>{languageContext.select_image_file}</p>
                  <input
                    type="file"
                    accept="image/jpeg"
                    onChange={(e) => {
                      adminStore.setImageFile(e.target.files[0]);
                    }}
                  />
                  <div className="modal-buttons">
                    <button
                      onClick={() =>
                        adminStore.handleEditImage(
                          adminStore.imageFile,
                          adminStore.adminPlaylistContent[0].id
                        )
                      }
                    >
                      {languageContext.modify_image}
                    </button>
                    <button onClick={() => adminStore.setModale(null)}>
                      {languageContext.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {adminStore.modale === "deleteModale" && (
              <div>
                <div className="modal delete-confirmation-modal">
                  <p>{languageContext.handle_delete_song}</p>
                  <div className="modal-buttons">
                    <button
                      onClick={() =>
                        adminStore.handleDeleteItem(adminStore.itemToDelete)
                      }
                    >
                      {languageContext.approve}
                    </button>
                    <button onClick={() => adminStore.setModale(null)}>
                      {languageContext.decline}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {adminStore.modale === "editModale" && (
              <div>
                <div className="modal delete-confirmation-modal">
                  <p>{languageContext.enter_new_name}</p>
                  <input
                    type="text"
                    value={adminStore.itemName}
                    onChange={(e) => adminStore.setItemName(e.target.value)}
                  />
                  <div className="modal-buttons">
                    <button
                      onClick={() =>
                        adminStore.handleEditItem(adminStore.itemToEdit)
                      }
                    >
                      {languageContext.approve}
                    </button>
                    <button onClick={() => adminStore.setModale(null)}>
                      {languageContext.decline}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>{languageContext.not_authorized}</div>
      )}
    </React.Fragment>
  );
});

export default AdminPanel;
