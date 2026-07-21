import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getLead(id) {

  const supabase = await createClient();


  const {
    data: lead
  } = await supabase

    .from("leads")

    .select("*")

    .eq("id", id)

    .single();



  return lead;

}



async function getContractors() {

  const supabase = await createClient();


  const {
    data: contractors
  } = await supabase

    .from("contractors")

    .select("*")

    .eq("featured", true);



  return contractors || [];

}





export const metadata = {

  title: "Manage Lead | Alberta Pro Network",

  description:
    "Assign homeowner leads to contractors."

};





export default async function LeadPage({ params }) {


  const supabase = await createClient();



  const {
    data: {
      user
    }

  } = await supabase.auth.getUser();




  if (!user) {

    redirect("/login");

  }




  const { id } = await params;



  const lead = await getLead(id);


  const contractors = await getContractors();




  if (!lead) {

    return (

      <main className="p-10">

        <h1 className="text-3xl font-bold">

          Lead Not Found

        </h1>

      </main>

    );

  }





  async function assignLead(formData) {

    "use server";


    const supabase = await createClient();


    const contractorId =
      formData.get("contractorId");



    await supabase

      .from("leads")

      .update({

        contractor_id: contractorId,

        status: "assigned"

      })

      .eq(

        "id",

        id

      );



    redirect("/admin/leads");

  }





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-4xl font-bold">

          {lead.service} Lead

        </h1>



        <div className="mt-6 space-y-2 text-gray-600">


          <p>

            Name: {lead.name}

          </p>


          <p>

            Phone: {lead.phone}

          </p>


          <p>

            Email: {lead.email}

          </p>


          <p>

            City: {lead.city}

          </p>


          <p>

            Details: {lead.description}

          </p>


        </div>





        <form

          action={assignLead}

          className="mt-10 space-y-5"

        >



          <label className="font-bold">

            Assign Contractor

          </label>



          <select

            name="contractorId"

            required

            className="w-full rounded-xl border px-4 py-3"

          >


            <option value="">

              Select contractor

            </option>



            {contractors.map((contractor) => (

              <option

                key={contractor.id}

                value={contractor.id}

              >

                {contractor.business_name} - {contractor.city}

              </option>

            ))}


          </select>




          <button

            className="rounded-xl bg-black px-6 py-4 font-bold text-white"

          >

            Assign Lead

          </button>



        </form>



      </section>


    </main>

  );

}