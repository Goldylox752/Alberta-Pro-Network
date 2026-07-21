import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);


const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL,

  process.env.SUPABASE_SERVICE_ROLE_KEY

);



export async function POST(request) {


  const body = await request.text();


  const signature = request.headers.get(
    "stripe-signature"
  );



  let event;



  try {


    event = stripe.webhooks.constructEvent(

      body,

      signature,

      process.env.STRIPE_WEBHOOK_SECRET

    );


  } catch (error) {


    console.log(
      "Webhook Error:",
      error.message
    );


    return new NextResponse(

      "Webhook Error",

      {
        status: 400
      }

    );

  }




  if (

    event.type ===
    "checkout.session.completed"

  ) {


    const session = event.data.object;



    const contractorId =
      session.metadata?.contractorId;



    const plan =
      session.metadata?.plan;



    if (contractorId) {


      await supabase

        .from("contractors")

        .update({

          featured:
            plan === "featured" ||
            plan === "lead_partner",


          verified: true,


          stripe_customer_id:
            session.customer,


          subscription_status:
            "active"

        })


        .eq(
          "id",
          contractorId
        );


    }


  }





  return NextResponse.json({

    received: true

  });


}