"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";


const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

);



export default function LoginPage() {


  const router = useRouter();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);




  async function login(e) {

    e.preventDefault();


    setLoading(true);

    setError("");



    const {

      error

    } = await supabase.auth.signInWithPassword({

      email,

      password,

    });



    if (error) {

      setError(error.message);

      setLoading(false);

      return;

    }



    router.push("/admin");

    router.refresh();


  }




  return (

    <main className="min-h-screen bg-gray-50 px-6 py-20">


      <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-3xl font-bold">

          Admin Login

        </h1>


        <p className="mt-3 text-gray-600">

          Sign in to manage Alberta Pro Network.

        </p>



        <form

          onSubmit={login}

          className="mt-8 space-y-5"

        >



          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            required

            className="w-full rounded-xl border px-4 py-3"

          />




          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            required

            className="w-full rounded-xl border px-4 py-3"

          />





          {error && (

            <p className="text-sm text-red-600">

              {error}

            </p>

          )}






          <button

            disabled={loading}

            className="w-full rounded-xl bg-black py-4 font-bold text-white"

          >

            {loading ? "Signing in..." : "Login"}

          </button>



        </form>


      </section>


    </main>

  );

}