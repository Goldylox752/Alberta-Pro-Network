"use client";

import { useState } from "react";


export default function PricingButton({ 
  plan, 
  contractorId 
}) {


  const [loading, setLoading] = useState(false);



  async function checkout() {


    setLoading(true);



    try {


      const response = await fetch(

        "/api/stripe/checkout",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },


          body: JSON.stringify({

            plan,

            contractorId,

          }),


        }

      );



      const data = await response.json();



      if (data.url) {


        window.location.href = data.url;


      } else {


        alert(
          data.error || "Unable to start checkout"
        );


        setLoading(false);


      }



    } catch (error) {


      console.log(error);


      alert(
        "Payment error. Please try again."
      );


      setLoading(false);


    }


  }




  return (

    <button

      onClick={checkout}

      disabled={loading}

      className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white hover:opacity-80 disabled:opacity-50"

    >

      {loading 
        ? "Loading..." 
        : "Get Started"}

    </button>

  );

}