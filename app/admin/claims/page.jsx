import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getClaims() {

  const supabase = await createClient();


  const {
    data: claims,
    error
  } = await supabase

    .from("claims")

    .select(`
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at,
      contractor:contractors(
        id,
        business_name,
        city,
        category
      )
    `)

    .order("created_at", {
      ascending: false
    });



  if (error) {

    console.log(error);

    return [];

  }


  return claims || [];

}





export const metadata = {

  title: "Manage Claims | Alberta Pro Network",

  description:
    "Review contractor ownership requests."

};





export default async function ClaimsAdminPage() {


  const supabase = await createClient();



  const {
    data:{
      user
    }

  } = await supabase.auth.getUser();




  if (!user) {

    redirect("/login");

  }





  async function updateClaim(formData) {

    "use server";


    const supabase = await createClient();



    const claimId =
      formData.get("claimId");


    const status =
      formData.get("status");



    const {
      data: claim
    } = await supabase

      .from("claims")

      .select("contractor_id")

      .eq("id", claimId)

      .single();




    await supabase

      .from("claims")

      .update({

        status

      })

      .eq(

        "id",

        claimId

      );





    if (
      status === "approved" &&
      claim?.contractor_id
    ) {


      await supabase

        .from("contractors")

        .update({

          claimed: true

        })

        .eq(

          "id",

          claim.contractor_id

        );


    }



    redirect("/admin/claims");

  }





  const claims =
    await getClaims();





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">

          Business Claims

        </h1>



        <p className="mt-3 text-gray-600">

          Review contractor ownership requests.

        </p>





        <div className="mt-10 space-y-6">


          {claims.length === 0 && (

            <div className="rounded-2xl bg-white p-6 border">

              No claims submitted.

            </div>

          )}






          {claims.map((claim) => (


            <div

              key={claim.id}

              className="rounded-3xl bg-white p-8 border shadow-sm"

            >


              <h2 className="text-2xl font-bold">

                {claim.contractor?.business_name}

              </h2>



              <p className="mt-2 text-gray-600">

                {claim.contractor?.category}

                {" • "}

                {claim.contractor?.city}

              </p>





              <div className="mt-5 space-y-2">


                <p>

                  Applicant: {claim.name}

                </p>


                <p>

                  Email: {claim.email}

                </p>


                <p>

                  Phone: {claim.phone}

                </p>


                <p>

                  Message: {claim.message}

                </p>


              </div>






              <form

                action={updateClaim}

                className="mt-6 flex gap-4"

              >


                <input

                  type="hidden"

                  name="claimId"

                  value={claim.id}

                />




                <button

                  name="status"

                  value="approved"

                  className="rounded-xl bg-black px-6 py-3 text-white"

                >

                  Approve

                </button>





                <button

                  name="status"

                  value="rejected"

                  className="rounded-xl border px-6 py-3"

                >

                  Reject

                </button>



              </form>




            </div>


          ))}



        </div>



      </section>


    </main>

  );

}