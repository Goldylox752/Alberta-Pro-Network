"use client";

import { useState } from "react";


export default function PricingButton({ plan }) {


  const [loading, setLoading] = useState(false);



  async function checkout() {


    setLoading(true);



    const response = await fetch(
      "/api/stripe/checkout",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          plan,
        }),

      }
    );



    const data = await response.json();



    if (data.url) {

      window.location.href = data.url;

    } else {

      alert("Unable to start checkout");

      setLoading(false);

    }


  }




  return (

    <button

      onClick={checkout}

      disabled={loading}

      className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white hover:opacity-80"

    >

      {loading ? "Loading..." : "Get Started"}

    </button>

  );

}