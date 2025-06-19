import { onMount } from "solid-js";
import { Header } from "../ui/Header";
import { setStore, store } from "../../store";
import { micOffIcon, micOnIcon, vidOffIcon, vidOnIcon } from "../icons/svgIcon";
import Peer from "peerjs";

export const addVideoStream = (
  video: HTMLVideoElement,
  stream: MediaStream
) => {
  console.log(video);
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
};
export const Admin = ({ userName }: { userName: string }) => {
  let myVideo!: HTMLVideoElement;
  let draggableElement!: HTMLDivElement;
  let socket: WebSocket;

  onMount(() => {
    console.log("mount again");
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
      console.log("peerjs is not open");
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
          console.log("new user connected");
          console.log("data", data);
          break;
        case "mic-status":
          break;
      }
      if (data.event === "connected") {
        console.log(data.message);
      }
    };
  });

  function dragElement(e: MouseEvent) {
    //TODO: WE HAVE MAKE THIS DIV DRAGABLE INSIDE THE FIX DIV
    let startDivX = 0,
      startDivY = 0,
      startMouseX = 0,
      startMouseY = 0;
    startDivX = draggableElement.offsetLeft;
    startDivY = draggableElement.offsetTop;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    document.addEventListener("mousemove", moveElement);
    document.addEventListener("mouseup", closeDragElement);

    function moveElement(e: MouseEvent) {
      draggableElement!.style.left =
        startDivX + (e.clientX - startMouseX) + "px";
      draggableElement!.style.top =
        startDivY + (e.clientY - startMouseY) + "px";
    }

    function closeDragElement() {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", moveElement);
    }
  }

  function toggleVid() {
    const videoTracks = store.localStream!.getVideoTracks();
    if (videoTracks.length > 0) {
      const currentstate = store.isVidOn;
      videoTracks[0].enabled = !currentstate;
      setStore("isVidOn", !currentstate);
    }
  }

  function toggleMic() {
    const audioTracks = store.localStream!.getAudioTracks();
    if (audioTracks.length > 0) {
      const currentState = store.isMicOn;
      audioTracks[0].enabled = !currentState;
      setStore("isMicOn", !currentState);
    }
  }

  return (
    <div class="">
      <div class="px-4">
        <Header></Header>
        <div class="flex  flex-col md:flex-row md:justify-around items-center ">
          <div class="w-[100%]  my-12 h-[70vh] md:h-auto  md:w-[60%] max-w-[1260px] max-height-675px  aspect-video ">
            <div
              ref={draggableElement}
              onMouseDown={() => dragElement}
              class="flex justify-end absolute cursor-move"
            >
              <div class="h-fit local  w-fit ">
                <video
                  muted={true}
                  ref={myVideo}
                  class="  object-cover  max-w-[120px] h-[180px]  md:max-w-[300px] md:max-h-[300px] "
                ></video>
                <div class="absolute top-3 left-3 bg-black/20 backdrop-blur-md rounded p-2">
                  {userName}
                </div>
              </div>
            </div>
          </div>
          <div class=" min-h-[160px] hidden md:block w-[96%] md:w-[18%] border-primary_b border-2 border-solid "></div>
        </div>
        <div class="flex justify-center  items-center ">
          <div>
            {store.isMicOn ? (
              <button
                onClick={toggleMic}
                class="rounded-full mx-2 p-3 md:p-4 border-white border-[0.8px] border-solid justify-center items-center flex"
              >
                {micOnIcon}
              </button>
            ) : (
              <button
                onClick={toggleMic}
                class="rounded-full p-3 mx-2 md:p-4 bg-red-500 hover:bg-red-600/90 border-white border-[0.8px] border-solid justify-center items-center flex"
              >
                {micOffIcon}
              </button>
            )}
          </div>
          <div>
            {store.isVidOn ? (
              <button
                onClick={toggleVid}
                class="rounded-full p-3 md:p-4 mx-2 border-white border-[0.8px] border-solid justify-center items-center flex"
              >
                {vidOnIcon}
              </button>
            ) : (
              <button
                onClick={toggleVid}
                class="rounded-full p-3 md:p-4 mx-2 bg-red-500 hover:bg-red-600/90 border-white border-[0.8px] border-solid justify-center items-center flex"
              >
                {vidOffIcon}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
