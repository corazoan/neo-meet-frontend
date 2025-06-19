import { createStore } from "solid-js/store";
export const [store, setStore] = createStore({
  isMicOn: true,
  isVidOn: true,
  roomId: "",
  localStream: null as MediaStream | null,
});
