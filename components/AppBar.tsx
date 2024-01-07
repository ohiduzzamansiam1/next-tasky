import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";

function AppBar() {
  const { userId } = auth();
  return (
    <div className="fixed top-0 left-0 right-0 border-b border-white/20 bg-black/20 backdrop-blur-md z-10">
      <nav className="container py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Tasky
        </Link>
        <div>
          {!userId ? (
            <Link
              href="/auth"
              className="btn bg-primary btn-rounded px-4 py-2 font-medium select-none cursor-pointer"
            >
              Sign in
            </Link>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </nav>
    </div>
  );
}

export default AppBar;
