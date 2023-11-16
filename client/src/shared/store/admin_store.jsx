import { observable, action, makeObservable } from "mobx";
import axios from "axios";

class AdminStore {
  adminPlaylist = [];
  adminPlaylistContent = [];
  isAuthorized = false;
  itemToEdit = "";
  itemToDelete = "";
  itemName = "";
  componentToSend = null;
  modale = null;
  playlistName = "";
  imageFile = "";
  musicFile = "";

  constructor() {
    makeObservable(this, {
      adminPlaylist: observable,
      isAuthorized: observable,
      adminPlaylistContent: observable,
      itemToEdit: observable,
      itemToDelete: observable,
      itemName: observable,
      componentToSend: observable,
      modale: observable,
      playlistName: observable,
      imageFile: observable,
      musicFile: observable,
      setAdminPlaylist: action,
      setAuthorized: action,
      setAdminPlaylistContent: action,
      setConfirmationModale: action,
      setItemToEdit: action,
      setItemToDelete: action,
      setItemName: action,
      setComponentToSend: action,
      setModale: action,
      setPlaylistName: action,
      setImageFile: action,
      setMusicFile: action,
    });
  }

  setMusicFile(file) {
    this.musicFile = file;
  }

  setImageFile(file) {
    this.imageFile = file;
  }

  setPlaylistName(name) {
    this.playlistName = name;
  }

  setModale(modale) {
    this.modale = modale;
  }

  setComponentToSend(component) {
    this.componentToSend = component;
  }

  setItemName(name) {
    this.itemName = name;
  }

  setItemToDelete(item) {
    this.itemToDelete = item;
  }

  setItemToEdit(item) {
    this.itemToEdit = item;
  }

  setConfirmationModale(modale) {
    this.confirmationModale = modale;
  }

  setAdminPlaylistContent(id) {
    this.adminPlaylistContent = this.adminPlaylist.filter(
      (game) => game.id === id
    );
  }

  setAuthorized(authorized) {
    this.isAuthorized = authorized;
  }

  setAdminPlaylist(playlist) {
    this.adminPlaylist = playlist;
  }

  async initAdminViewPlaylist() {
    try {
      const response = await axios.get("http://localhost:8000/getAdminData", {
        withCredentials: true,
      });
      if (response.data.authorized) {
        this.setAuthorized(true);
        this.setAdminPlaylist(response.data.playlist);
      } else {
        window.location.href = response.data.redirectTo;
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/";
      }
    }
  }

  async handleDeleteItem(itemID) {
    if (this.componentToSend === "playlist") {
      try {
        const response = await axios.delete(
          `http://localhost:8000/deletePlaylist/${itemID}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          window.location.reload();
        } else if (response.status === 404) {
          console.log("Chanson non trouvée.");
        } else {
          console.error("Erreur lors de la suppression de la chanson.");
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la suppression de la chanson :",
          error
        );
      }
    } else if (this.componentToSend === "song") {
      try {
        const response = await axios.delete(
          `http://localhost:8000/deleteSong/${itemID}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("Chanson supprimée avec succès.");
          window.location.reload();
        } else if (response.status === 404) {
          console.log("Chanson non trouvée.");
        } else {
          console.error("Erreur lors de la suppression de la chanson.");
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la suppression de la chanson :",
          error
        );
      }
    }
  }

  handleEditItem = async (itemID) => {
    if (this.componentToSend === "playlist") {
      try {
        const response = await axios.put(
          `http://localhost:8000/updatePlaylist/${itemID}`,
          {
            name: this.itemName,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          window.location.reload();
        } else if (response.status === 404) {
          console.log("Chanson non trouvée.");
        } else {
          console.error("Erreur lors de la modification de la chanson.");
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la modification de la chanson :",
          error
        );
      }
    } else if (this.componentToSend === "song") {
      try {
        const response = await axios.put(
          `http://localhost:8000/updateSong/${itemID}`,
          {
            name: this.itemName,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("Chanson renommée avec succès.");
          window.location.reload();
        } else if (response.status === 404) {
          console.log("Chanson non trouvée.");
        } else {
          console.error("Erreur lors de la modification de la chanson.");
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la modification de la chanson :",
          error
        );
      }
    }
  };

  handleEditImage = async (itemToChange, playlistId) => {
    const formData = new FormData();
    formData.append("image", itemToChange);

    try {
      await axios.put(
        `http://localhost:8000/updatePlaylistImage/${playlistId}`,
        formData,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      this.setImageFile(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  handleAddNewSong = async (itemToAdd, playlistId) => {
    const formData = new FormData();
    formData.append("music", itemToAdd);

    try {
      await axios.post(
        `http://localhost:8000/addMusicToPlaylist/${playlistId}`,
        formData,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      this.setMusicFile(null);
      window.location.reload();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la chanson :",
        error
      );
      alert("Erreur lors de l'ajout de la chanson.", error);
    }
  };

  handleSubmit = async () => {
    const formData = new FormData();
    formData.append("playlistName", this.playlistName);
    formData.append("image", this.imageFile);

    this.musicFile.forEach((file) => {
      formData.append("music", file);
    });

    try {
      await axios.post(
        "http://localhost:8000/addPlaylist",
        formData,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      this.setPlaylistName("");
      this.setImageFile(null);
      this.setMusicFile(null);
      window.location.reload();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la playlist :",
        error
      );
      alert("Erreur lors de l'ajout de la playlist.", error);
    }
  };
}

export default AdminStore;
