import { useNavigate, useParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { solidFetch } from "../libs/solidFetch";
import { createSignal } from "solid-js";
import { LoadingState } from "../components/ui/loadingState";
import { Admin } from "../components/room/Admin";
import { isUuid } from "../libs/isUuid";
import { Preview } from "../components/room/Preview";
export default function Room() {
  const params = useParams();
  const [errMsg, setErrMsg] = createSignal("");
  const [socket, setSocket] = createSignal(null);
  const [userName, setUserName] = createSignal("");
  const [isLoading, setLoading] = createSignal(true);
  const [role, setRole] = createSignal<"Admin" | "User">("User");
  const [join, setJoin] = createSignal(false);
  const joinRoom = async () => {
    const socket = new WebSocket("ws://localhost:8787/");
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

  onMount(async () => {
    const navigate = useNavigate();
    const isValidUuid = isUuid(params.room_id);

    if (isValidUuid) {
      try {
        const res = await solidFetch("/room/is-meet-id-valid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ meetingId: params.room_id }),
        });

        if (!res.ok) {
          // Handle HTTP errors (e.g., 400/500 responses)
          console.log("res is not ok");
          const errorData = await res.json();
          console.log("error data", errorData.error);
          setErrMsg(errorData.error || "Failed to validate meeting ID");
          setLoading(false);
          return; // Exit early since the response failed
        }

        const data: {
          error?: string;
          loggedIn?: string;
          message?: string;
          success?: string;
          admin?: boolean;
          userName?: string;
        } = await res.json();

        if (data.error) {
          // Handle API-specific error in response body
          setErrMsg(data.error);
        } else {
          // Process a valid response
          if (data.admin) setRole("Admin");
          setUserName(data.userName!);
        }
      } catch (err) {
        console.error("An error occurred:", err);
        setErrMsg("An unexpected error occurred.");
      } finally {
        setLoading(false); // Ensure loading state is updated in all cases
      }
    } else {
      console.log("not valid url try to redirect");
      navigate("/");
    }
  });

  return (
    <div>
      {" "}
      {isLoading() ? (
        <LoadingState />
      ) : (
        <div>
          {errMsg() ? (
            <div>{errMsg()}</div>
          ) : join() ? (
            role() === "Admin" ? (
              <Admin userName={userName()} />
            ) : (
              "user"
            )
          ) : (
            <Preview setJoin={setJoin} username={userName()} role={role()} />
          )}
        </div>
      )}
    </div>
  );
}
