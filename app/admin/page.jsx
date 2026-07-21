import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


async function getContractors() {

  const supabase = await createClient();


  const {
    data: contractors,
    error
  } = await supabase
    .from("contractors")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.log(error);

    return [];

  }


  return contractors || [];

}



export default async function AdminPage() {


  const supabase = await createClient();


  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();



  if (!user) {

    redirect("/login");

  }



  async function updateContractor(formData) {

    "use server";


    const supabase = await createClient();


    const id = formData.get("id");

    const verified =
      formData.get("verified") === "true";

    const featured =
      formData.get("featured") === "true";



    await supabase
      .from("contractors")
      .update({

        verified,
        featured

      })
      .eq("id", id);



    redirect("/admin");

  }



  const contractors = await getContractors();



  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">

          Contractor Admin Dashboard

        </h1>


        <p className="mt-3 text-gray-600">

          Manage listings, verification and featured businesses.

        </p>



        <div className="mt-10 space-y-6">


          {contractors.map((contractor) => (


            <div

              key={contractor.id}

              className="rounded-2xl bg-white p-6 shadow-sm border"

            >


              <div className="flex flex-col gap-4 md:flex-row md:justify-between">


                <div>


                  <h2 className="text-2xl font-bold">

                    {contractor.business_name}

                  </h2>


                  <p className="text-gray-600">

                    {contractor.category} — {contractor.city}

                  </p>


                  <p className="text-sm text-gray-500">

                    {contractor.email}

                  </p>


                </div>



                <form
                  action={updateContractor}
                  className="flex flex-col gap-3"
                >


                  <input
                    type="hidden"
                    name="id"
                    value={contractor.id}
                  />


                  <label className="flex gap-2">

                    <input

                      type="checkbox"

                      name="verified"

                      value="true"

                      defaultChecked={contractor.verified}

                    />

                    Verified

                  </label>



                  <label className="flex gap-2">

                    <input

                      type="checkbox"

                      name="featured"

                      value="true"

                      defaultChecked={contractor.featured}

                    />

                    Featured

                  </label>



                  <button

                    className="rounded-lg bg-black px-5 py-2 text-white"

                  >

                    Save

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