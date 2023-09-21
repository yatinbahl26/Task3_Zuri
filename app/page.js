"use client";
import { useState } from "react";
import { auth } from "@/service/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const { email, password } = Object.fromEntries(form.entries());
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        router.push("/gallery");
      }
    } catch (error) {
      console.log(error.message);
      setError(
        "Invalid login parameters. Please use the default login parameters"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDetails = () => {
    setEmail("user@example.com");
    setPassword("1Password");
  };
  return (
    <main className="flex min-h-screen items-center justify-center sm:p-24 flex-wrap gap-4 bg-gradient-to-r from-green-300 to-blue-500 p-4">
      <div className="flex-[1] w-full  text-gray-600 text-center flex flex-col justify-center items-center">
        <h1 className="w-[270px] text-[26px] sm:text-3xl font-bold mb-4">
          Image Gallery
        </h1>
        <p className="w-[350px] sm:text-lg mb-4">
          A webapp with a platform where you can see drag-and-drop interactions.
        </p>
        <p className="w-[350px]">
          Please{" "}
          <span
            className="cursor-pointer text-green-600 sm:text-lg font-extrabold"
            onClick={handleFillDetails}
          >
            login
          </span>{" "}
          to continue.
        </p>
      </div>

      <div className="flex-[1] w-full max-w-[500px] h-full flex flex-col gap-6 justify-center items-center py-10 px-3 border border-solid border-black shadow-lg rounded-2xl">
        <h1 className="text-2xl text-black">Login</h1>
        <form
          className="flex flex-col gap-3 w-full max-w-[500px] justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full px-3 py-2 rounded-md text-black"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full px-3 py-2 rounded-md text-black"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex gap-4 mt-3">
            <button
              className="w-[100px] h-10 flex justify-center items-center rounded-md bg-slate-50 text-black"
              type="submit"
            >
              <p>{!loading ? "Login" : "Loggin in..."}</p>
            </button>
          </div>
        </form>
        {error && (
          <p className="max-w-[300px] text-red-700 text-center">{error}</p>
        )}
        <div className="w-full flex flex-col gap-2 p-2 text-black">
          <p>Default login parameters are:</p>
          <p>
            Email:
            <span
              className="cursor-pointer text-green-700 ml-1"
              onClick={() => setEmail("user@example.com")}
            >
              user@example.com
            </span>
          </p>
          <p>
            Password:
            <span
              className="cursor-pointer text-green-700 ml-1"
              onClick={() => setPassword("1Password")}
            >
              1Password
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
