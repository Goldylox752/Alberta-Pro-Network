import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


const categoryDescriptions = {

  roofing:
    "Find trusted Alberta roofing contractors for repairs, replacements, inspections and new roof installations.",

  plumbing:
    "Connect with Alberta plumbers for repairs, installations and emergency plumbing services.",

  electrical:
    "Find licensed Alberta electricians for residential and commercial electrical work.",

  "general-contractor":
    "Discover Alberta general contractors for renovations, construction projects and home improvements.",

  landscaping:
    "Find Alberta landscaping professionals for outdoor projects, maintenance and design.",

  "telecom-&-smart-home":
    "Find Alberta telecom specialists for internet, cameras and smart home installations."

};



async function getContractors(category) {

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
      city,
      province,
      description,
      verified,
      featured
    `)
    .eq("category", category)
    .order("featured", {
      ascending: false
    });



  if (error) {

    console.log(error);
    return [];

  }


  return contractors || [];

}



export async function generateMetadata({ params }) {


  const category = params.category.replaceAll("-", " ");


  return {

    title:
      `${category} Contractors Alberta | Alberta Pro Network`,

    description:
      categoryDescriptions[params.category] ||
      `Find trusted ${category} contractors across Alberta.`

  };

}




export default async function CategoryPage({ params }) {


  const categoryName = params.category
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );


  const contractors = await getContractors(categoryName);



  if (!categoryName) {

    notFound();

  }



  return (

    <main className="min-h-screen bg-white px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <Link
          href="/contractors"
          className="text-gray-500 hover:text-black"
        >
          ← All Contractors
        </Link>



        <h1 className="mt-8 text-5xl font-bold">

          {categoryName} Contractors Alberta

        </h1>



        <p className="mt-5 max-w-3xl text-lg text-gray-600">

          {categoryDescriptions[params.category] ||
            `Browse trusted ${categoryName} professionals across Alberta.`}

        </p>




        <div className="mt-12 grid gap-6 md:grid-cols-3">



          {contractors.length === 0 && (

            <div className="rounded-2xl border p-6">

              <h2 className="text-xl font-bold">

                No contractors listed yet

              </h2>


              <p className="mt-2 text-gray-600">

                Be the first business in this category.

              </p>


              <Link

                href="/submit"

                className="mt-5 inline-block rounded-xl bg-black px-6 py-3 text-white"

              >

                Add Your Business

              </Link>


            </div>

          )}




          {contractors.map((contractor) => (

            <Link

              key={contractor.id}

              href={`/contractors/${contractor.slug}`}

              className="rounded-2xl border p-6 hover:shadow-lg"

            >


              <h2 className="text-xl font-bold">

                {contractor.business_name}

              </h2>



              <p className="mt-2 text-gray-500">

                {contractor.city}, {contractor.province}

              </p>



              {contractor.verified && (

                <span className="mt-4 inline-block text-sm text-green-600">

                  ✓ Verified

                </span>

              )}



              <p className="mt-4 text-gray-600 line-clamp-3">

                {contractor.description}

              </p>



            </Link>

          ))}


        </div>


      </section>


    </main>

  );

}