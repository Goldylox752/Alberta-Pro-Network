import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export const metadata = {

  title:
    "Request a Contractor Quote | Alberta Pro Network",

  description:
    "Get connected with trusted Alberta contractors for roofing, plumbing, electrical, renovations and home services."

};





export default function RequestQuotePage() {



  async function submitLead(formData) {

    "use server";


    const supabase =
      await createClient();




    const lead = {


      name:
        formData.get("name"),


      phone:
        formData.get("phone"),


      email:
        formData.get("email"),


      city:
        formData.get("city"),


      service:
        formData.get("service"),


      budget:
        formData.get("budget"),


      timeline:
        formData.get("timeline"),


      description:
        formData.get("description"),


      status:
        "new",


      source:
        "website"

    };






    const { error } = await supabase

      .from("leads")

      .insert(lead);





    if(error){

      console.log(error);

      throw new Error(
        "Unable to submit request"
      );

    }




    redirect(
      "/request-quote/success"
    );

  }







  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">


        <h1 className="text-4xl font-bold">

          Get Free Contractor Quotes

        </h1>




        <p className="mt-4 text-gray-600">

          Tell us about your project and get connected with trusted Alberta professionals.

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

            required

            className="w-full rounded-xl border px-4 py-3"

          />





          <input

            name="email"

            type="email"

            placeholder="Email Address"

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
              Renovation
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







          <select

            name="budget"

            className="w-full rounded-xl border px-4 py-3"

          >

            <option value="">
              Estimated Budget
            </option>


            <option>
              Under $5,000
            </option>


            <option>
              $5,000 - $15,000
            </option>


            <option>
              $15,000 - $50,000
            </option>


            <option>
              $50,000+
            </option>


          </select>







          <select

            name="timeline"

            className="w-full rounded-xl border px-4 py-3"

          >

            <option value="">
              Project Timeline
            </option>


            <option>
              ASAP
            </option>


            <option>
              Within 30 days
            </option>


            <option>
              1-3 months
            </option>


            <option>
              Planning stage
            </option>


          </select>







          <textarea

            name="description"

            placeholder="Describe your project"

            rows="6"

            className="w-full rounded-xl border px-4 py-3"

          />








          <button

            type="submit"

            className="w-full rounded-xl bg-black py-4 font-bold text-white hover:opacity-90"

          >

            Get Free Quotes

          </button>




        </form>




      </section>


    </main>

  );

}