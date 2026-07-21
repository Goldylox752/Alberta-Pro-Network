import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getContractors() {

  const supabase = await createClient();

  const {
    data: contractors,
    error
  } = await supabase
    .from("contractors")
    .select(`
      id,
      business_name,
      slug,
      category,
      city,
      province,
      description,
      logo,
      verified,
      featured
    `)
    .order("featured", { ascending: false });


  if (error) {
    console.log(error);
    return [];
  }


  return contractors || [];

}



export const metadata = {

  title: "Alberta Contractors | Alberta Pro Network",

  description:
    "Browse trusted Alberta contractors for roofing, plumbing, electrical, construction and home services."

};



export default async function ContractorsPage() {


  const contractors = await getContractors();



  return (

    <main className="min-h-screen bg-white px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">
          Alberta Contractors
        </h1>


        <p className="mt-4 text-gray-600">
          Find trusted professionals across Alberta.
        </p>



        <div className="mt-10 grid gap-6 md:grid-cols-3">



          {contractors.length === 0 && (

            <div className="rounded-xl border p-6">

              <h2 className="text-xl font-bold">
                No contractors listed yet
              </h2>


              <p className="mt-2 text-gray-600">
                Be the first business to join Alberta Pro Network.
              </p>


              <Link
                href="/submit"
                className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
              >
                Add Your Business
              </Link>

            </div>

          )}



          {contractors.map((contractor) => (


            <Link

              key={contractor.id}

              href={`/contractors/${contractor.slug}`}

              className="rounded-2xl border p-6 hover:shadow-lg transition"

            >


              {contractor.logo && (

                <img

                  src={contractor.logo}

                  alt={contractor.business_name}

                  className="h-16 w-16 rounded-full object-cover"

                />

              )}



              <div className="mt-4 flex items-center gap-2">


                <h2 className="text-xl font-bold">

                  {contractor.business_name}

                </h2>



                {contractor.verified && (

                  <span className="text-green-600">
                    ✓
                  </span>

                )}


              </div>



              <p className="mt-2 text-sm text-gray-500">

                {contractor.category}

              </p>



              <p className="text-sm text-gray-500">

                {contractor.city}, {contractor.province}

              </p>



              <p className="mt-4 text-gray-600 line-clamp-3">

                {contractor.description}

              </p>



              {contractor.featured && (

                <div className="mt-4 inline-block rounded-full bg-black px-3 py-1 text-xs text-white">

                  Featured Contractor

                </div>

              )}



            </Link>


          ))}



        </div>


      </section>


    </main>

  );

}