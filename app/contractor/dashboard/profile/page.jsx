import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getContractor(email) {

  const supabase = await createClient();


  const {
    data: contractor
  } = await supabase

    .from("contractors")

    .select("*")

    .eq("email", email)

    .single();



  return contractor;

}





export const metadata = {

  title: "Edit Business Profile | Alberta Pro Network",

  description:
    "Manage your contractor business profile."

};





export default async function ContractorProfilePage() {


  const supabase = await createClient();



  const {
    data:{
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

            No Business Found

          </h1>



          <p className="mt-4 text-gray-600">

            Your account is not connected to a contractor profile.

          </p>


        </section>


      </main>

    );

  }






  async function updateProfile(formData) {

    "use server";


    const supabase = await createClient();



    await supabase

      .from("contractors")

      .update({

        business_name:
          formData.get("business_name"),


        category:
          formData.get("category"),


        city:
          formData.get("city"),


        phone:
          formData.get("phone"),


        website:
          formData.get("website"),


        description:
          formData.get("description"),


        logo:
          formData.get("logo")


      })

      .eq(

        "id",

        contractor.id

      );



    redirect("/dashboard");

  }






  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-4xl font-bold">

          Edit Business Profile

        </h1>



        <p className="mt-3 text-gray-600">

          Keep your listing updated so homeowners can find you.

        </p>





        <form

          action={updateProfile}

          className="mt-8 space-y-5"

        >




          <input

            name="business_name"

            defaultValue={contractor.business_name}

            placeholder="Business Name"

            className="w-full rounded-xl border px-4 py-3"

          />





          <select

            name="category"

            defaultValue={contractor.category}

            className="w-full rounded-xl border px-4 py-3"

          >

            <option>
              Roofing
            </option>

            <option>
              Plumbing
            </option>

            <option>
              Electrical
            </option>

            <option>
              General Contractor
            </option>

            <option>
              Landscaping
            </option>

            <option>
              Telecom & Smart Home
            </option>


          </select>






          <input

            name="city"

            defaultValue={contractor.city}

            placeholder="City"

            className="w-full rounded-xl border px-4 py-3"

          />





          <input

            name="phone"

            defaultValue={contractor.phone}

            placeholder="Phone"

            className="w-full rounded-xl border px-4 py-3"

          />





          <input

            name="website"

            defaultValue={contractor.website}

            placeholder="Website"

            className="w-full rounded-xl border px-4 py-3"

          />





          <input

            name="logo"

            defaultValue={contractor.logo}

            placeholder="Logo URL"

            className="w-full rounded-xl border px-4 py-3"

          />






          <textarea

            name="description"

            defaultValue={contractor.description}

            rows="6"

            placeholder="Business description"

            className="w-full rounded-xl border px-4 py-3"

          />






          <button

            className="w-full rounded-xl bg-black py-4 font-bold text-white"

          >

            Save Changes

          </button>



        </form>




      </section>


    </main>

  );

}