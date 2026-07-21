import PricingButton from "@/components/PricingButton";


export const metadata = {

  title: "Pricing | Alberta Pro Network",

  description:
    "Grow your contracting business with featured listings and lead generation from Alberta Pro Network."

};



const plans = [

  {
    name: "Free Listing",
    price: "$0",
    plan: null,
    features: [
      "Business profile",
      "Category listing",
      "City listing",
      "Basic visibility"
    ]
  },


  {
    name: "Featured Contractor",
    price: "$99/month",
    plan: "featured",
    features: [
      "Top placement in search",
      "Verified badge",
      "Featured profile",
      "More homeowner visibility"
    ]
  },


  {
    name: "Lead Partner",
    price: "$499/month",
    plan: "lead_partner",
    features: [
      "Priority placement",
      "Exclusive leads",
      "Marketing promotion",
      "Lead notifications"
    ]
  }

];



export default function PricingPage() {


  return (

    <main className="min-h-screen bg-white px-6 py-16">


      <section className="mx-auto max-w-6xl text-center">


        <h1 className="text-5xl font-bold">

          Grow Your Contracting Business

        </h1>


        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">

          Get discovered by Alberta homeowners searching for trusted local professionals.

        </p>




        <div className="mt-12 grid gap-8 md:grid-cols-3">


          {plans.map((plan) => (

            <div

              key={plan.name}

              className="rounded-3xl border p-8 text-left shadow-sm"

            >


              <h2 className="text-2xl font-bold">

                {plan.name}

              </h2>



              <p className="mt-4 text-4xl font-bold">

                {plan.price}

              </p>



              <ul className="mt-6 space-y-3 text-gray-600">

                {plan.features.map((feature) => (

                  <li key={feature}>

                    ✓ {feature}

                  </li>

                ))}

              </ul>



              <div className="mt-8">


                {plan.plan ? (

                  <PricingButton plan={plan.plan} />

                ) : (

                  <a

                    href="/submit"

                    className="block rounded-xl bg-black px-6 py-4 text-center font-semibold text-white"

                  >

                    Create Free Listing

                  </a>

                )}


              </div>



            </div>

          ))}


        </div>


      </section>


    </main>

  );

}