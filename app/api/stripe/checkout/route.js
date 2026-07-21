import Stripe from "stripe";
import { NextResponse } from "next/server";


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);



export async function POST(request) {


  try {


    const {
      plan,
      contractorId
    } = await request.json();



    const plans = {


      featured: {

        name: "Featured Contractor",

        price: 9900

      },


      lead_partner: {

        name: "Lead Partner",

        price: 49900

      }


    };



    const selectedPlan = plans[plan];



    if (!selectedPlan) {

      return NextResponse.json(

        {
          error: "Invalid plan"
        },

        {
          status: 400
        }

      );

    }



    if (!contractorId) {

      return NextResponse.json(

        {
          error: "Missing contractor ID"
        },

        {
          status: 400
        }

      );

    }




    const session = await stripe.checkout.sessions.create({


      mode: "subscription",



      line_items: [

        {

          price_data: {

            currency: "cad",


            product_data: {

              name: selectedPlan.name

            },


            unit_amount: selectedPlan.price,


            recurring: {

              interval: "month"

            }

          },


          quantity: 1

        }

      ],




      metadata: {

        contractorId,

        plan

      },




      success_url:

        `${process.env.NEXT_PUBLIC_SITE_URL}/success`,



      cancel_url:

        `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`



    });





    return NextResponse.json({

      url: session.url

    });



  } catch (error) {


    console.log(error);



    return NextResponse.json(

      {
        error: "Checkout failed"
      },

      {
        status: 500
      }

    );


  }


}