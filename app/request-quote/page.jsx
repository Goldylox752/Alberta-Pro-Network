import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export const metadata = {

  title: "Request a Contractor Quote | Alberta Pro Network",

  description:
    "Get connected with trusted Alberta contractors for roofing, plumbing, electrical and home services."

};



export default function RequestQuotePage() {


  async function submitLead(formData) {

    "use server";


    const supabase = await createClient();



    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const city = formData.get("city");
    const service = formData.get("service");
    const description = formData.get("description");



    const { error } = await supabase
      .from("leads")
      .insert({

        name,
        phone,
        email,
        city,
        service,
        description

      });



    if (error) {

      console.log(error);

      throw new Error(
        "Unable to submit request"
      );

    }



    redirect("/request-quote/success");

  }





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-4xl font-bold">

          Get Free Contractor Quotes

        </h1>



        <p className="mt-4 text-gray-600">

          Tell us what you need and we will connect you with trusted Alberta professionals.

        </p>




        <form
          action={submitLead}
          className="mt-8 space-y-5"
        >


          <input

            name="name"

            placeholder="Your Name"

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

            name="city"

            placeholder="City"

            required

            className="w-full rounded-xl border px-4 py-3"

          />



          <select

            name="service"

            required

            className="w-full rounded-xl border px-4 py-3"

          >

            <option value="">
              Select Service
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




          <textarea

            name="description"

            placeholder="Describe your project"

            rows="5"

            className="w-full rounded-xl border px-4 py-3"

          />




          <button

            type="submit"

            className="w-full rounded-xl bg-black py-4 font-bold text-white"

          >

            Get Quotes

          </button>



        </form>


      </section>


    </main>

  );

}