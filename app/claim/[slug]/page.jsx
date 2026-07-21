import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getContractor(slug) {

  const supabase = await createClient();


  const {
    data: contractor
  } = await supabase

    .from("contractors")

    .select(`
      id,
      business_name,
      slug,
      city,
      category,
      claimed
    `)

    .eq("slug", slug)

    .single();



  return contractor;

}





export const metadata = {

  title: "Claim Business | Alberta Pro Network",

  description:
    "Claim your Alberta Pro Network business listing."

};





export default async function ClaimPage({ params }) {


  const { slug } = await params;


  const contractor =
    await getContractor(slug);



  if (!contractor) {

    notFound();

  }





  async function submitClaim(formData) {

    "use server";


    const supabase = await createClient();



    const name =
      formData.get("name");


    const email =
      formData.get("email");


    const phone =
      formData.get("phone");


    const message =
      formData.get("message");




    const {
      data: {
        user
      }

    } = await supabase.auth.getUser();




    await supabase

      .from("claims")

      .insert({

        contractor_id: contractor.id,

        user_id: user?.id || null,

        name,

        email,

        phone,

        message,

        status: "pending"

      });



    redirect("/claim/success");

  }





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-4xl font-bold">

          Claim {contractor.business_name}

        </h1>



        <p className="mt-4 text-gray-600">

          Are you the owner of this business?

          Submit your information and we will verify your claim.

        </p>





        <div className="mt-8 rounded-xl bg-gray-100 p-5">


          <p className="font-semibold">

            Business

          </p>


          <p>

            {contractor.business_name}

          </p>



          <p>

            {contractor.category}

          </p>



          <p>

            {contractor.city}

          </p>


        </div>






        <form

          action={submitClaim}

          className="mt-8 space-y-5"

        >



          <input

            name="name"

            placeholder="Your Name"

            required

            className="w-full rounded-xl border px-4 py-3"

          />





          <input

            name="email"

            type="email"

            placeholder="Business Email"

            required

            className="w-full rounded-xl border px-4 py-3"

          />





          <input

            name="phone"

            placeholder="Phone Number"

            className="w-full rounded-xl border px-4 py-3"

          />






          <textarea

            name="message"

            placeholder="Tell us why you own this business"

            rows="5"

            className="w-full rounded-xl border px-4 py-3"

          />






          <button

            className="w-full rounded-xl bg-black py-4 font-bold text-white"

          >

            Submit Claim

          </button>



        </form>



      </section>


    </main>

  );

}