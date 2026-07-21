import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";


const resend = new Resend(
  process.env.RESEND_API_KEY
);



export async function POST(request) {


  try {


    const {
      leadId

    } = await request.json();





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

      error

    } = await supabase

      .from("leads")

      .select(`

        id,

        name,

        phone,

        email,

        city,

        service,

        description,

        contractor:contractors(

          business_name,

          email

        )

      `)

      .eq(

        "id",

        leadId

      )

      .single();






    if(error || !lead){


      return NextResponse.json(

        {
          error:"Lead not found"
        },

        {
          status:404
        }

      );

    }







    if(!lead.contractor?.email){


      return NextResponse.json({

        message:
        "Contractor email missing"

      });


    }








    await resend.emails.send({

      from:
      "Alberta Pro Network <notifications@yourdomain.com>",


      to:
      lead.contractor.email,


      subject:
      `New ${lead.service} Lead Available`,



      html:

      `

      <h2>New Contractor Opportunity</h2>


      <p>You have received a new homeowner request.</p>


      <h3>Project Details</h3>


      <p>
      Service: ${lead.service}
      </p>


      <p>
      Location: ${lead.city}
      </p>


      <p>
      Customer: ${lead.name}
      </p>


      <p>
      Phone: ${lead.phone}
      </p>


      <p>
      Email: ${lead.email}
      </p>


      <p>
      Details: ${lead.description}
      </p>


      <br/>


      <a href="https://albertapronetwork.com/contractor/dashboard/leads">

      View Lead Dashboard

      </a>


      `


    });








    return NextResponse.json({

      success:true,

      message:
      "Contractor notified"

    });







  } catch(error){


    console.log(error);



    return NextResponse.json(

      {
        error:
        "Notification failed"
      },

      {
        status:500
      }

    );


  }


}