import HomePage from "@/components/HomePage";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

function Home() {
  const { userId } = auth();
  if (userId) {
    redirect("/tasks");
  }
  return (
    <>
      <HomePage />
    </>
  );
}

export default Home;
