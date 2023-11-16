import { observable, action, makeObservable } from "mobx";
import axios from "axios";

class UserStore {
  username = null;
  email = null;
  likedPlaylist = [];
  likedSong = [];
  gameSongs = [];
  isAdmin = false;
  language = null;

  constructor() {
    makeObservable(this, {
      username: observable,
      email: observable,
      likedPlaylist: observable,
      likedSong: observable,
      gameSongs: observable,
      isAdmin: observable,
      language: observable,
      setLanguage: action,
      setUsername: action,
      setEmail: action,
      setLikedPlaylist: action,
      setLikedSong: action,
      initUser: action,
      isPlaylistLiked: action,
      onLikePlaylist: action,
      onDislikePlaylist: action,
      isSongLiked: action,
      onLikeSong: action,
      onDislikeSong: action,
      setAdmin: action,
      onDisconnect: action,
      setGameSongs: action,
      updateLanguage: action,
      updateToken: action,
      updateUsername: action,
    });
  }

  setLanguage(language) {
    this.language = language;
  }

  setUsername(username) {
    this.username = username;
  }

  setEmail(email) {
    this.email = email;
  }

  setLikedPlaylist(likedPlaylist) {
    this.likedPlaylist = likedPlaylist;
  }

  setLikedSong(likedSong) {
    this.likedSong = likedSong;
  }

  setAdmin(isAdmin) {
    this.isAdmin = isAdmin;
  }

  async setGameSongs(songs) {
    this.gameSongs = songs;
  }

  async updateUser() {
    this.initUser();
  }

  async updateToken() {
    try {
      await axios.get("http://localhost:8000/updateToken", {
        withCredentials: true,
      });
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  }

  async initUser() {
    try {
      const response = await axios.get("http://localhost:8000/getUserData", {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { userData } = response.data;
        this.setUsername(userData.username);
        this.setEmail(userData.email);
        this.setLikedPlaylist(userData.likedPlaylist);
        this.setLikedSong(userData.likedSong);
        this.setAdmin(userData.isAdmin);
        this.setLanguage(userData.language);
      }

      this.updateToken();
    } catch (error) {
      if (error.response.status === 401) {
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  }

  async updateLanguage(language) {
    try {
      const response = await axios.put(
        "http://localhost:8000/updateLanguage",
        { language },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        this.setLanguage(language);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  }

  onLikePlaylist = async (playlistId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/likedPlaylist",
        { playlistId },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedLikedPlaylist = [...this.likedPlaylist, playlistId];
        this.setLikedPlaylist(updatedLikedPlaylist);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  onDislikePlaylist = async (playlistId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/dislikedPlaylist",
        { playlistId },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedLikedPlaylist = this.likedPlaylist.filter(
          (id) => id !== playlistId
        );
        this.setLikedPlaylist(updatedLikedPlaylist);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  isPlaylistLiked = (playlistId) => {
    if (this.likedPlaylist.includes(playlistId)) {
      return true;
    } else {
      return false;
    }
  };

  onLikeSong = async (songId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/onLikeSong",
        { songId },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedLikedSong = [...this.likedSong, songId];
        this.setLikedSong(updatedLikedSong);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  onDislikeSong = async (songId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/onDislikeSong",
        { songId },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedLikedSong = this.likedSong.filter((id) => id !== songId);
        this.setLikedSong(updatedLikedSong);
        this.setGameSongs(
          this.gameSongs.filter((song) => song.msc.id !== songId)
        );
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  isSongLiked = (songId) => {
    return this.likedSong.includes(songId) ? true : false;
  };

  onDisconnect = async () => {
    try {
      await axios.get("http://localhost:8000/logout", {
        withCredentials: true,
      });
      this.updateUser();
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  deleteAccount = async () => {
    try {
      await axios.delete("http://localhost:8000/deleteAccount", {
        withCredentials: true,
      });
      this.updateUser();
      window.location.href = "/";
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  initUserSongs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/userSongs", {
        withCredentials: true,
      });
      const data = response.data;
      const filteredSongs = data.flatMap((playlist) =>
        playlist.playlist
          .filter((song) => {
            if (this.likedSong.includes(song.msc.id)) {
              data.find((p) =>
                p.playlist.some((s) => s.msc.id === song.msc.id)
              );
              return true;
            }
            return false;
          })
          .map((song) => ({
            ...song,
            img: playlist.img,
          }))
      );
      this.setGameSongs(filteredSongs);
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }
      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };

  updateUsername = async (username) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/updateUsername",
        { username },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        this.setUsername(username);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("L'utilisateur n'est pas connecté.");
      }

      if (error.response.status === 500) {
        console.log("Erreur serveur :", error.response.data.message);
      }
    }
  };
}

export default UserStore;
