import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";



export async function POST(request) {


  try {


    const body = await request.json();


    const {
      leadId
    } = body;



    if(!leadId){

      return NextResponse.json(

        {
          error:"Missing leadId"
        },

        {
          status:400
        }

      );

    }






    const supabase =
      await createClient();






    const {
      data: lead,
      error: leadError

    } = await supabase

      .from("leads")

      .select("*")

      .eq(
        "id",
        leadId
      )

      .single();





    if(leadError || !lead){


      return NextResponse.json(

        {
          error:"Lead not found"
        },

        {
          status:404
        }

      );

    }








    const {
      data: contractors

    } = await supabase

      .from("contractors")

      .select(`

        id,

        business_name,

        category,

        city,

        featured,

        verified

      `)

      .eq(

        "category",

        lead.service

      )

      .eq(

        "city",

        lead.city

      )

      .order(

        "featured",

        {
          ascending:false
        }

      )

      .order(

        "verified",

        {
          ascending:false
        }

      );








    if(!contractors || contractors.length === 0){


      return NextResponse.json({

        message:
        "No matching contractors found"

      });


    }







    const bestMatch =
      contractors[0];







    const {
      error:updateError

    } = await supabase

      .from("leads")

      .update({

        assigned_contractor:
          bestMatch.id,

        status:
          "assigned"

      })

      .eq(

        "id",

        leadId

      );







    if(updateError){

      throw updateError;

    }







    return NextResponse.json({

      success:true,

      assigned:

      {

        contractor:
        bestMatch.business_name,

        id:
        bestMatch.id

      }

    });






  } catch(error){


    console.log(error);



    return NextResponse.json(

      {
        error:
        "Lead matching failed"
      },

      {
        status:500
      }

    );


  }


}