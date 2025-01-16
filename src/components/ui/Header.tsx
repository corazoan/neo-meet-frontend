import { UserButton } from "clerk-solidjs";

export const Header = () => {
  return (
    <div class="flex h-16 justify-end p-6">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
          },
        }}
      />
    </div>
  );
};
