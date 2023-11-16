import { observable, action, makeObservable } from "mobx";
import axios from "axios";

class PlaylistStore {
  selectedPlaylist = [];
  selectedGame = [];
  allPlaylist = [];
  songIndex = 0;
  gameTitle = "";
  searchGame = null;

  constructor() {
    makeObservable(this, {
      selectedPlaylist: observable,
      selectedGame: observable,
      gameTitle: observable,
      searchGame: observable,
      songIndex: observable,
      allPlaylist: observable,
      setSelectedPlaylist: action,
      setSelectedGame: action,
      setAllPlaylist: action,
      setGameTitle: action,
      initSelectedPlaylist: action,
      updateSelectedPlaylist: action,
      setSearchGame: action,
      setSongIndex: action,
    });
  }

  setSongIndex(index) {
    this.songIndex = index;
  }

  setSearchGame(game) {
    this.searchGame = game;
  }

  setGameTitle(title) {
    this.gameTitle = title;
  }

  setSelectedPlaylist(playlist) {
    this.selectedPlaylist = playlist;
  }

  setAllPlaylist(playlist) {
    this.allPlaylist = playlist;
  }

  setSelectedGame(game) {
    this.selectedGame = game;
    this.selectedSong = [];
  }

  async initSelectedPlaylist() {
    try {
      const response = await axios.get("http://localhost:8000/getData");
      this.setAllPlaylist(response.data);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données:",
        error
      );
      return [];
    }
  }

  async updateSelectedPlaylist() {
    this.initSelectedPlaylist();
  }
}

export default PlaylistStore;
