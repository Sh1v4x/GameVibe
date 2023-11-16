import { observable, action, makeObservable } from "mobx";

class SidebarStore {
  isSidebarOpen = false;

  constructor() {
    makeObservable(this, {
      isSidebarOpen: observable,
      toggleSidebar: action,
      openSidebar: action,
      closeSidebar: action,
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}

export default SidebarStore;
