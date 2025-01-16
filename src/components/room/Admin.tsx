import { onMount } from "solid-js";
import { Header } from "../ui/Header";
import { createSignal } from "solid-js";
import Button from "../ui/Button";
import { setStore, store } from "../../store";
import { micOffIcon, micOnIcon, vidOffIcon, vidOnIcon } from "../icons/svgIcon";
import { createEffect } from "solid-js";
export const Admin = ({ userName }: { userName: string }) => {
  let myVideo!: HTMLVideoElement;
  let draggableElement!: HTMLDivElement;
  const addVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  };

  const joinRoom = async () => {
    console.log("join room is called");
    const socket = new WebSocket("ws://localhost:8787/ws");
    socket.onmessage = (event) => {
      console.log(event.data);
    };

    // Handle connection open
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Handle connection close
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };
  onMount(() => {
    // if (navigator.mediaDevices) {
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: true })
    //   .then((stream) => {
    //     localStream = stream;
    addVideoStream(myVideo, store.localStream!);
    const audioTrackes = store.localStream!.getAudioTracks();
    const videoTrackes = store.localStream!.getVideoTracks();
    if (!store.isMicOn && audioTrackes.length > 0) {
      audioTrackes[0].enabled = store.isMicOn;
    }
    if (!store.isVidOn && videoTrackes.length > 0) {
      audioTrackes[0].enabled = store.isVidOn;
    }
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

  //Re-apply the stream to video element
  createEffect(() => {
    if (store.isVidOn) {
      if (myVideo && store.localStream) {
        myVideo.srcObject = store.localStream;
        myVideo.play();
      }
    }
  });

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
              onMouseDown={dragElement}
              class="flex justify-end absolute cursor-move"
            >
              <div class="h-fit local  w-fit ">
                {store.isVidOn ? (
                  <video
                    muted={true}
                    ref={myVideo}
                    // src={store.localStream}
                    class="  object-cover  max-w-[120px] h-[180px]  md:max-w-[300px] md:max-h-[300px] "
                  ></video>
                ) : (
                  <div class="  object-cover  max-w-[120px] h-[180px]  md:max-w-[300px] md:max-h-[300px] border-primary_b border-2 border-solid "></div>
                )}
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
