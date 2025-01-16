import Button from "../components/ui/Button";
import { createSignal, onCleanup, onMount } from "solid-js";
import { LoadingState } from "../components/ui/loadingState";
import { solidFetch } from "../libs/solidFetch";
import { Header } from "../components/ui/Header";

export default function Home() {
  const [inputFilled, setInputFilled] = createSignal(false);
  const [itemNum, setNum] = createSignal(1);
  const [giveOption, setOption] = createSignal(false);
  const [newMeet, setNewMeet] = createSignal<{
    result?: string;
    message?: string;
    error?: string;
  }>();

  const [isLoading, setLoading] = createSignal(false);
  const [openModel, setOpenModel] = createSignal(false);
  let option!: HTMLDivElement;
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (giveOption() && option && !option.contains(e.target as Node)) {
        setOption(false);
      }
    };

    window.document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener
    onCleanup(() => {
      window.document.removeEventListener("click", handleClickOutside);
    });
  });

  const handleCreateNewMeeting = async () => {
    setOpenModel(true);
    const res = await solidFetch("/create-new-meeting", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("making a request");
    try {
      const data = await res.json();
      if (!res.ok) {
        setNewMeet(data);
      }
      setNewMeet(data);
    } catch {
      console.log("something went wrong in server");
      setLoading(false);
    }
  };

  // const setCookies = async () => {
  //   const res = await fetch("http://localhost:8787/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   });
  //   const json = await res.json();
  //   console.log(json);
  // };

  const renderCarasoulItem = () => {
    {
      switch (itemNum()) {
        case 1:
          return (
            <div id="item" class={`animate-right  `}>
              <img
                class="mx-auto"
                src={
                  "https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg"
                }
              ></img>
              <p class="text-center my-2 text-2xl">
                Get a Link you can share 1
              </p>
              <p class="text-center">
                Click <span class="font-extrabold">New Metting</span> to get a
                link you can send to people you want to meet with
              </p>
            </div>
          );
          break;
        case 2:
          return (
            <div id="item" class={`animate-right  `}>
              <img
                class="mx-auto"
                src={
                  "https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg"
                }
              ></img>
              <p class="text-center my-2 text-2xl">Plan ahead 2</p>
              <p class="text-center">
                Click <span class="font-extrabold">New Metting</span> to
                schedule meetings and send invites link to participants
              </p>
            </div>
          );
          break;
        case 3:
          return (
            <div id="item" class={`animate-right`}>
              <img
                class="mx-auto"
                src={
                  "https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg"
                }
              ></img>
              <p class="text-center my-2 text-2xl">Your meeting is safe 3</p>
              <p class="text-center">
                No one can join a meeting unless invited or admitted by the host
              </p>
            </div>
          );
          break;
      }
    }
  };

  return (
    <div class="h-[100vh] overflow-none">
      <Header></Header>
      <main class="w-[90vw] md:justify-around  mx-auto  h-[calc(100%-64px)] box-border md:flex-row md:items-center md:gap-x-16   flex flex-col  ">
        <div class="my-2 md:max-w-[35rem]">
          <h1 class="text-[2.5rem] my-2 text-center md:text-left">
            Video Calls and meetings for everyone.
          </h1>
          <p class="text-[1.5rem]   text-center md:text-left font-roboto">
            Connect, collaborate, and celebrate from anywhere with{" "}
            <span>Mate</span>
          </p>
          <div>
            <Button
              class="my-4"
              onClick={(e) => {
                e.stopImmediatePropagation();
                setOption(true);
              }}
            >
              <svg
                class="mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  fill-rule="evenodd"
                  d="M7.345 4.017a42.3 42.3 0 0 1 9.31 0c1.713.192 3.095 1.541 3.296 3.26a40.7 40.7 0 0 1 0 9.446c-.201 1.719-1.583 3.068-3.296 3.26a42.3 42.3 0 0 1-9.31 0c-1.713-.192-3.095-1.541-3.296-3.26a40.7 40.7 0 0 1 0-9.445a3.734 3.734 0 0 1 3.295-3.26M12 7.007a.75.75 0 0 1 .75.75v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1 0-1.5h3.493V7.757a.75.75 0 0 1 .75-.75"
                  clip-rule="evenodd"
                />
              </svg>
              New Metting
            </Button>
            {giveOption() && (
              <div ref={option} class="absolute bg-gray-500">
                <Button
                  onClick={() => {
                    handleCreateNewMeeting();
                  }}
                  size="lg"
                  class="w-[100%]  h-[60px] rounded-none "
                >
                  {isLoading() ? <LoadingState /> : "Create a new meeting "}
                </Button>
                <Button
                  // onClick={() => {
                  //  setCookies();
                  // }}
                  size="lg"
                  class="w-[100%] h-[60px] "
                >
                  Start an instant meeting
                </Button>
              </div>
            )}
            <form action="" class="flex ">
              <div class="flex items-center rounded-[.25rem] border-solid border-gray-900 focus-within:border-blue-600  border-2 w-fit bg-white py-1 ">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  class="ml-4 mr-2"
                >
                  <path
                    fill="black"
                    d="M3 20q-.825 0-1.412-.587T1 18V6q0-.825.588-1.412T3 4h18q.825 0 1.413.588T23 6v12q0 .825-.587 1.413T21 20zm0-2h18V6H3zm6-1h6q.425 0 .713-.288T16 16t-.288-.712T15 15H9q-.425 0-.712.288T8 16t.288.713T9 17m-6 1V6zm3-8q.425 0 .713-.288T7 9t-.288-.712T6 8t-.712.288T5 9t.288.713T6 10m4 0q.425 0 .713-.288T11 9t-.288-.712T10 8t-.712.288T9 9t.288.713T10 10m4 0q.425 0 .713-.288T15 9t-.288-.712T14 8t-.712.288T13 9t.288.713T14 10m4 0q.425 0 .713-.288T19 9t-.288-.712T18 8t-.712.288T17 9t.288.713T18 10M6 13.5q.425 0 .713-.288T7 12.5t-.288-.712T6 11.5t-.712.288T5 12.5t.288.713T6 13.5m4 0q.425 0 .713-.288T11 12.5t-.288-.712T10 11.5t-.712.288T9 12.5t.288.713t.712.287m4 0q.425 0 .713-.288T15 12.5t-.288-.712T14 11.5t-.712.288T13 12.5t.288.713t.712.287m4 0q.425 0 .713-.288T19 12.5t-.288-.712T18 11.5t-.712.288T17 12.5t.288.713t.712.287"
                  />
                </svg>
                <input
                  type="text"
                  onInput={(e) => {
                    console.log(e.target.value);
                    if (e.target.value.length > 0) {
                      return setInputFilled(true);
                    }
                    return setInputFilled(false);
                  }}
                  class="outline-none border-none bg-transparent  placeholder:text-black/80 text-black box-border  h-[48px] border-[#353540]"
                  placeholder="Enter a code or link"
                ></input>
              </div>
              <button
                class={`px-4 mx-4 rounded ${inputFilled() ? "text-blue-500 " : "text-white/80 "} focus:bg-white/20 transition duration-200 ease-out`}
                disabled={!inputFilled()}
              >
                Join
              </button>
            </form>
          </div>
          <hr class="my-6" />
        </div>

        <div class="flex h-fit justify-center items-center">
          <button
            id="previous"
            onClick={() => {
              if (itemNum() === 1) {
                return setNum(3);
              }
              setNum((prev) => prev - 1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#888888"
                d="M13.939 4.939L6.879 12l7.06 7.061l2.122-2.122L11.121 12l4.94-4.939z"
              />
            </svg>{" "}
          </button>

          <div class="w-[400px]">{renderCarasoulItem()}</div>
          <button
            id="next"
            onClick={() => {
              if (itemNum() === 3) {
                return setNum(1);
              }
              setNum((prev) => prev + 1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#888888"
                d="M10.061 19.061L17.121 12l-7.06-7.061l-2.122 2.122L12.879 12l-4.94 4.939z"
              />
            </svg>
          </button>
        </div>
      </main>
      {openModel() && (
        <div class="absolute top-0 bg-white/10 backdrop-blur-md h-[100vh] w-[100vw] flex justify-center items-center">
          <div class="bg-black/50 text-center flex-col rounded border-solid border-[0.8px] border-[#353540] backdrop-blue-[16px] box-border w-[300px] flex py-14 items-center h-[300px]">
            <h1 class="text-xl">Here's your joining info</h1>
            {newMeet() ? (
              <div class="text-lg w-[100%]">
                {newMeet()?.error ? (
                  <p class="text-red-600">{newMeet()?.error}</p>
                ) : (
                  <p class="text-blue-500">{newMeet()?.message}</p>
                )}
                <div class="my-5  mx-auto">
                  <p id="meeting_id">{`http://localhost:5173/room/${newMeet()?.result}`}</p>
                  <Button
                    class="mx-auto my-1"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `http://localhost:5173/room/${newMeet()?.result}` || "",
                      );

                      setOpenModel(false);
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ) : (
              <LoadingState />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
