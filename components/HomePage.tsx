import Link from "next/link";

function HomePage() {
  return (
    <main className="h-[100dvh] grid place-content-center">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-extrabold heading leading-[2rem] sm:leading-[3.9rem] sm:text-5xl heading">
          Start your day by doing simple &quot;Tasks&quot;
        </h1>
        <p className="my-5 mb-8 text-sm sm:text-base w-10/12 sm:w-2/3 mx-auto">
          Tasky is a simple to-do list app that allows you to keep track of your
        </p>
        <Link
          href="/auth"
          className="btn bg-primary px-7 py-3 font-medium select-none btn-rounded"
        >
          Start now!
        </Link>
      </div>
    </main>
  );
}

export default HomePage;
