import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getContractor(userEmail) {

  const supabase = await createClient();


  const {
    data: contractor
  } = await supabase

    .from("contractors")

    .select("*")

    .eq("email", userEmail)

    .single();



  return contractor;

}



async function getLeads(city) {

  const supabase = await createClient();


  const {
    data: leads
  } = await supabase

    .from("leads")

    .select("*")

    .eq("city", city)

    .order("created_at", {
      ascending: false
    });



  return leads || [];

}





export const metadata = {

  title: "Contractor Dashboard | Alberta Pro Network",

  description:
    "Manage your Alberta Pro Network contractor profile and leads."

};





export default async function DashboardPage() {


  const supabase = await createClient();



  const {
    data: {
      user
    }

  } = await supabase.auth.getUser();




  if (!user) {

    redirect("/login");

  }




  const contractor =
    await getContractor(user.email);




  if (!contractor) {

    return (

      <main className="min-h-screen bg-gray-50 px-6 py-16">

        <section className="mx-auto max-w-xl rounded-3xl bg-white p-8">

          <h1 className="text-3xl font-bold">

            No Business Profile Found

          </h1>


          <p className="mt-4 text-gray-600">

            Create your contractor listing to access your dashboard.

          </p>



          <Link

            href="/submit"

            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-white"

          >

            Create Listing

          </Link>


        </section>

      </main>

    );

  }





  const leads =
    await getLeads(contractor.city);





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">

          Contractor Dashboard

        </h1>


        <p className="mt-3 text-gray-600">

          Welcome back, {contractor.business_name}

        </p>





        <div className="mt-10 grid gap-6 md:grid-cols-3">


          <div className="rounded-2xl bg-white p-6 shadow-sm border">


            <h2 className="font-bold">

              Subscription

            </h2>


            <p className="mt-3 text-gray-600">

              {contractor.subscription_status || "Free"}

            </p>


          </div>





          <div className="rounded-2xl bg-white p-6 shadow-sm border">


            <h2 className="font-bold">

              Listing Status

            </h2>


            <p className="mt-3">

              {contractor.featured
                ? "Featured"
                : "Standard"}

            </p>


          </div>





          <div className="rounded-2xl bg-white p-6 shadow-sm border">


            <h2 className="font-bold">

              Location

            </h2>


            <p className="mt-3 text-gray-600">

              {contractor.city}, {contractor.province}

            </p>


          </div>



        </div>





        <section className="mt-10 rounded-3xl bg-white p-8 border">


          <h2 className="text-2xl font-bold">

            Available Leads

          </h2>




          {leads.length === 0 && (

            <p className="mt-4 text-gray-600">

              No leads available yet.

            </p>

          )}






          <div className="mt-6 space-y-4">


            {leads.map((lead) => (


              <div

                key={lead.id}

                className="rounded-xl border p-5"

              >


                <h3 className="font-bold">

                  {lead.service}

                </h3>


                <p className="text-gray-600">

                  {lead.description}

                </p>


                <p className="mt-2 text-sm text-gray-500">

                  {lead.city}

                </p>


              </div>


            ))}


          </div>


        </section>





        {!contractor.featured && (

          <section className="mt-10 rounded-3xl bg-black p-8 text-white">


            <h2 className="text-2xl font-bold">

              Upgrade Your Listing

            </h2>


            <p className="mt-3 text-gray-300">

              Get priority placement and more customer opportunities.

            </p>



            <Link

              href={`/pricing?contractor=${contractor.id}`}

              className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-black"

            >

              Upgrade Now

            </Link>



          </section>

        )}



      </section>


    </main>

  );

}