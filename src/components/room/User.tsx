import { onMount } from "solid-js";
import Peer from "peerjs";
import { addVideoStream } from "./Admin";
import { store } from "../../store";

export function User() {
  let myVideo!: HTMLVideoElement;
  let socket: WebSocket;
  onMount(() => {
    const peer = new Peer();
    addVideoStream(myVideo, store.localStream!);
    const audioTrackes = store.localStream!.getAudioTracks();
    const videoTrackes = store.localStream!.getVideoTracks();
    if (!store.isMicOn && audioTrackes.length > 0) {
      audioTrackes[0].enabled = store.isMicOn;
    }
    if (!store.isVidOn && videoTrackes.length > 0) {
      audioTrackes[0].enabled = store.isVidOn;
    }
    socket = new WebSocket("ws://localhost:8787/ws/");
    socket.onopen = () => {
      console.log("Web socket connection is being established");
    };

    peer.on("open", (userId) => {
      console.log("peerjs is  open");
      console.log("user id", userId);
      const data = {
        type: "join-room",
        payload: { roomId: store.roomId || "not found", userId: userId },
      };
      socket.send(JSON.stringify(data));
    });

    socket.onmessage = (event) => {
      const data = JSON.parse(event.type);
      console.log("Message from server:", data);

      // Handle specific events if needed
      switch (data.event) {
        case "connected":
          break;
        case "user-conneted":
          console.log("user-connected");
          break;
        case "mic-status":
          break;
      }
      if (data.event === "connected") {
        console.log(data.message);
      }
    };
  });
  return (
    <div>
      <video ref={myVideo}></video>
    </div>
  );
}
