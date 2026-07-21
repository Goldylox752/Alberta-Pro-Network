import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getContractor(slug) {

  const supabase = await createClient();


  const {
    data: contractor,
    error
  } = await supabase

    .from("contractors")

    .select(`
      id,
      business_name,
      category,
      city,
      province,
      phone,
      email,
      website,
      description,
      logo,
      images,
      verified,
      featured
    `)

    .eq("slug", slug)

    .single();



  if (error || !contractor) {

    return null;

  }


  return contractor;

}





export async function generateMetadata({ params }) {


  const { slug } = await params;


  const contractor =
    await getContractor(slug);



  if (!contractor) {

    return {

      title: "Contractor Not Found"

    };

  }



  return {

    title:
      `${contractor.business_name} | ${contractor.category} Alberta`,

    description:
      contractor.description ||
      `${contractor.business_name} provides ${contractor.category} services in ${contractor.city}, Alberta.`

  };

}





export default async function ContractorPage({ params }) {


  const { slug } = await params;


  const contractor =
    await getContractor(slug);



  if (!contractor) {

    notFound();

  }




  return (

    <main className="min-h-screen bg-white px-6 py-16">


      <section className="mx-auto max-w-5xl">


        <Link

          href="/contractors"

          className="text-sm text-gray-500 hover:text-black"

        >

          ← Back to Contractors

        </Link>





        <div className="mt-8 rounded-3xl border p-8 shadow-sm">


          <div className="flex flex-col gap-6 md:flex-row">


            {contractor.logo && (

              <Image

                src={contractor.logo}

                width={128}

                height={128}

                alt={contractor.business_name}

                className="h-32 w-32 rounded-2xl object-cover"

              />

            )}





            <div>


              <div className="flex flex-wrap items-center gap-3">


                <h1 className="text-4xl font-bold">

                  {contractor.business_name}

                </h1>



                {contractor.verified && (

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

                    ✓ Verified

                  </span>

                )}



                {contractor.featured && (

                  <span className="rounded-full bg-black px-3 py-1 text-sm text-white">

                    Featured

                  </span>

                )}



              </div>




              <p className="mt-3 text-lg text-gray-600">

                {contractor.category}

              </p>




              <p className="text-gray-500">

                {contractor.city}, {contractor.province}

              </p>



            </div>


          </div>






          <div className="mt-10">


            <h2 className="text-2xl font-bold">

              About This Business

            </h2>



            <p className="mt-4 leading-7 text-gray-600">

              {contractor.description}

            </p>


          </div>







          <div className="mt-10 grid gap-4 md:grid-cols-3">


            {contractor.phone && (

              <a

                href={`tel:${contractor.phone}`}

                className="rounded-xl bg-black px-6 py-4 text-center font-semibold text-white"

              >

                Call Business

              </a>

            )}




            {contractor.website && (

              <a

                href={contractor.website}

                target="_blank"

                rel="noopener noreferrer"

                className="rounded-xl border px-6 py-4 text-center font-semibold"

              >

                Visit Website

              </a>

            )}






            <Link

              href={`/request-quote?service=${contractor.category}&city=${contractor.city}`}

              className="rounded-xl border px-6 py-4 text-center font-semibold"

            >

              Request Quote

            </Link>



          </div>




        </div>





        {contractor.featured && (

          <section className="mt-10 rounded-3xl bg-black p-8 text-white">


            <h2 className="text-2xl font-bold">

              Featured Contractor

            </h2>


            <p className="mt-3 text-gray-300">

              This company is a premium Alberta Pro Network partner.

            </p>


          </section>

        )}



      </section>


    </main>

  );

}