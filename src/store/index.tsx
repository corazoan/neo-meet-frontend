import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
  isMicOn: true,
  isVidOn: true,
  localStream: null as MediaStream | null,
});
