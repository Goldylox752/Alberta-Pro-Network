import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


async function getLeads() {

  const supabase = await createClient();


  const {
    data: leads,
    error
  } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", {
      ascending: false
    });



  if (error) {

    console.log(error);

    return [];

  }


  return leads || [];

}





export const metadata = {

  title: "Lead Dashboard | Alberta Pro Network",

  description:
    "Manage homeowner contractor requests."

};





export default async function LeadsAdminPage() {


  const supabase = await createClient();



  const {
    data: {
      user
    }

  } = await supabase.auth.getUser();



  if (!user) {

    redirect("/login");

  }




  async function updateLead(formData) {

    "use server";


    const supabase = await createClient();



    const id = formData.get("id");

    const status = formData.get("status");



    await supabase

      .from("leads")

      .update({

        status

      })

      .eq(

        "id",

        id

      );



    redirect("/admin/leads");

  }





  const leads = await getLeads();





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">

          Lead Dashboard

        </h1>


        <p className="mt-3 text-gray-600">

          Manage homeowner requests and contractor opportunities.

        </p>




        <div className="mt-10 space-y-6">



          {leads.length === 0 && (

            <div className="rounded-2xl border bg-white p-6">

              No leads yet.

            </div>

          )}






          {leads.map((lead) => (


            <div

              key={lead.id}

              className="rounded-2xl border bg-white p-6 shadow-sm"

            >


              <div className="flex flex-col gap-5 md:flex-row md:justify-between">


                <div>


                  <h2 className="text-2xl font-bold">

                    {lead.service}

                  </h2>



                  <p className="mt-2 text-gray-600">

                    {lead.name}

                  </p>



                  <p className="text-gray-500">

                    {lead.city}

                  </p>



                  <p className="mt-3 text-gray-600">

                    {lead.description}

                  </p>




                  <div className="mt-4 text-sm text-gray-500">

                    {lead.phone}

                    <br />

                    {lead.email}

                  </div>



                </div>






                <form

                  action={updateLead}

                  className="flex flex-col gap-3"

                >


                  <input

                    type="hidden"

                    name="id"

                    value={lead.id}

                  />



                  <select

                    name="status"

                    defaultValue={lead.status}

                    className="rounded-lg border px-4 py-3"

                  >

                    <option value="new">
                      New
                    </option>


                    <option value="contacted">
                      Contacted
                    </option>


                    <option value="assigned">
                      Assigned
                    </option>


                    <option value="completed">
                      Completed
                    </option>


                  </select>




                  <button

                    className="rounded-lg bg-black px-5 py-3 text-white"

                  >

                    Update

                  </button>



                </form>



              </div>



            </div>



          ))}



        </div>



      </section>


    </main>

  );

}