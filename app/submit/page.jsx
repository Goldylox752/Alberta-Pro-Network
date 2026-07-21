import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export const metadata = {

  title: "List Your Business | Alberta Pro Network",

  description:
    "Add your contracting business to Alberta Pro Network and get discovered by Alberta homeowners."

};



export default function SubmitPage() {



  async function submitContractor(formData) {

    "use server";


    const supabase = await createClient();



    const business_name = formData.get("business_name");
    const category = formData.get("category");
    const city = formData.get("city");
    const province = "Alberta";
    const phone = formData.get("phone");
    const email = formData.get("email");
    const website = formData.get("website");
    const description = formData.get("description");



    const slug = business_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");



    const { error } = await supabase
      .from("contractors")
      .insert({

        business_name,
        slug,
        category,
        city,
        province,
        phone,
        email,
        website,
        description,
        verified: false,
        featured: false

      });



    if (error) {

      console.log(error);

      throw new Error("Could not submit business");

    }



    redirect("/contractors");

  }



  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-4xl font-bold">

          Add Your Business

        </h1>


        <p className="mt-3 text-gray-600">

          Get your contracting company listed in Alberta's trusted contractor network.

        </p>



        <form
          action={submitContractor}
          className="mt-8 space-y-5"
        >


          <input

            name="business_name"

            placeholder="Business Name"

            required

            className="w-full rounded-xl border px-4 py-3"

          />



          <select

            name="category"

            required

            className="w-full rounded-xl border px-4 py-3"

          >

            <option value="">
              Select Category
            </option>

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

            placeholder="City"

            required

            className="w-full rounded-xl border px-4 py-3"

          />




          <input

            name="phone"

            placeholder="Phone Number"

            className="w-full rounded-xl border px-4 py-3"

          />




          <input

            name="email"

            type="email"

            placeholder="Email"

            className="w-full rounded-xl border px-4 py-3"

          />




          <input

            name="website"

            placeholder="Website URL"

            className="w-full rounded-xl border px-4 py-3"

          />




          <textarea

            name="description"

            placeholder="Tell homeowners about your business"

            rows="5"

            className="w-full rounded-xl border px-4 py-3"

          />




          <button

            type="submit"

            className="w-full rounded-xl bg-black py-4 font-bold text-white hover:opacity-80"

          >

            Submit Business

          </button>



        </form>


      </section>


    </main>

  );

}