import { onMount, createEffect } from "solid-js";
import { Header } from "../ui/Header";
import { micOffIcon, micOnIcon, vidOffIcon, vidOnIcon } from "../icons/svgIcon";
import Button from "../ui/Button";
import { setStore, store } from "../../store";
import { Setter } from "solid-js";
import { solid } from "../icons/svgIcon";
export function Preview({
  username,
  role,
  setJoin,
}: {
  username: string;
  role: "Admin" | "User";
  setJoin: Setter<boolean>;
}) {
  let myVideo!: HTMLVideoElement;

  onMount(() => {
    // Initialize media stream
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("Media stream started successfully", stream);
        setStore("localStream", stream);
        // localStream = stream;

        // Apply stream to the video element if video is on
        if (store.isVidOn && myVideo) {
          myVideo.srcObject = stream;
          myVideo.play();
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });
  });

  createEffect(() => {
    // Reapply the stream to the video element when isVidOn changes
    if (store.isVidOn) {
      if (myVideo && store.localStream) {
        myVideo.srcObject = store.localStream;
        myVideo.play();
      }
    }
  });

  function toggleMic() {
    const audioTracks = store.localStream!.getAudioTracks();
    if (audioTracks.length > 0) {
      const currentState = store.isMicOn;
      audioTracks[0].enabled = !currentState;
      setStore("isMicOn", !currentState);
    }
  }

  function toggleVid() {
    const videoTracks = store.localStream!.getVideoTracks();
    if (videoTracks.length > 0) {
      const currentState = store.isVidOn;
      setStore("isVidOn", !currentState);
      videoTracks[0].enabled = !currentState;
    }
  }

  return (
    <div class="w-[100vw] h-[100vh]">
      <Header></Header>
      <div class="flex justify-center md:gap-x-[10%] h-[calc(100%-64px)] flex-wrap md:items-center">
        <div class="md:w-fit w-[96%] h-fit relative my-12 md:m-0">
          {store.isVidOn ? (
            <video
              muted={true}
              ref={myVideo}
              class="max-w-[600px] aspect-auto h-[400px] w-[100%] rounded-3xl object-cover md:h-auto"
            ></video>
          ) : (
            <div class="max-w-[600px] aspect-video h-[400px] w-[100%] rounded-3xl bg-white/10 flex justify-center items-center ">
              {solid}
            </div>
          )}
          <p class="absolute bg-black/10 backdrop-blur font-bold rounded p-1 top-3 left-3">
            {username}
          </p>
          <div class="absolute bg-black/10 rounded backdrop-blur-md top-3 right-3 p-1">
            {store.isMicOn ? "mic on" : "mic off"}
          </div>
          <div class="absolute flex gap-x-3 w-full max-w-[600px] justify-center items-center bottom-4">
            <div>
              {store.isMicOn ? (
                <button
                  onClick={toggleMic}
                  class="rounded-full p-3 md:p-4 border-white border-[0.8px] border-solid justify-center items-center flex"
                >
                  {micOnIcon}
                </button>
              ) : (
                <button
                  onClick={toggleMic}
                  class="rounded-full p-3 md:p-4 bg-red-500 hover:bg-red-600/90 border-white border-[0.8px] border-solid justify-center items-center flex"
                >
                  {micOffIcon}
                </button>
              )}
            </div>
            <div>
              {store.isVidOn ? (
                <button
                  onClick={toggleVid}
                  class="rounded-full p-3 md:p-4 border-white border-[0.8px] border-solid justify-center items-center flex"
                >
                  {vidOnIcon}
                </button>
              ) : (
                <button
                  onClick={toggleVid}
                  class="rounded-full p-3 md:p-4 bg-red-500 hover:bg-red-600/90 border-white border-[0.8px] border-solid justify-center items-center flex"
                >
                  {vidOffIcon}
                </button>
              )}
            </div>
          </div>
        </div>
        <div class="h-fit flex flex-col justify-center items-center gap-y-4">
          <p class="text-3xl md:text-4xl">Ready to join?</p>
          <Button
            class="rounded-[24px]"
            onClick={() => {
              setJoin(true);
            }}
            size="lg"
          >
            {role === "Admin" ? "Join now" : " Request to join "}
          </Button>
        </div>
      </div>
    </div>
  );
}
