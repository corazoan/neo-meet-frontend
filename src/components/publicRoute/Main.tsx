import { SignInButton } from "clerk-solidjs";

export default function Main() {
  return (
    <div class="mx-auto h-[100vh] flex justify-center items-center ">
      <div class="rounded-[20px] flex justify-center items-center flex-col border-[0.8px] border-[#353540] w-[96%] xl:w-[30%] md:w-[40%] h-[400px] py-16  px-10">
        <h1 class="text-[24px] font-[600]">Welcome to Mate</h1>
        <h1 class="text-[24px] text-white/60 font-[500]">
          The universe of meeting
        </h1>
        <p class=" font-[500] font-sans text-[18px] my-2">
          Verify to use our services
        </p>

        <SignInButton class="bg-white mt-4 hover:bg-white/80 text-black px-4 py-2 rounded-md text-lg flex justify-center items-center leading-5" />
      </div>
    </div>
  );
}
