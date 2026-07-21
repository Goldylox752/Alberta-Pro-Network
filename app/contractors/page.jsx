import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";


async function getContractors(searchParams) {


  const supabase = await createClient();



  let query = supabase

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

    .order("featured", {
      ascending: false
    })

    .order("business_name");




  if (searchParams?.search) {

    query = query.ilike(

      "business_name",

      `%${searchParams.search}%`

    );

  }



  if (searchParams?.city) {

    query = query.eq(

      "city",

      searchParams.city

    );

  }




  if (searchParams?.category) {

    query = query.eq(

      "category",

      searchParams.category

    );

  }




  const {

    data: contractors,

    error

  } = await query;




  if (error) {

    console.log(error);

    return [];

  }



  return contractors || [];

}





export const metadata = {

  title:
    "Alberta Contractors Directory | Alberta Pro Network",

  description:
    "Find trusted Alberta contractors for roofing, plumbing, electrical, construction and home services."

};





export default async function ContractorsPage({
  searchParams
}) {


  const params = await searchParams;


  const contractors =
    await getContractors(params);





  return (

    <main className="min-h-screen bg-white px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">

          Alberta Contractors

        </h1>



        <p className="mt-4 text-gray-600">

          Find trusted professionals across Alberta.

        </p>





        <form

          className="mt-8 grid gap-4 rounded-2xl border p-6 md:grid-cols-3"

        >


          <input

            name="search"

            placeholder="Search business"

            className="rounded-xl border px-4 py-3"

          />



          <input

            name="city"

            placeholder="City"

            className="rounded-xl border px-4 py-3"

          />



          <select

            name="category"

            className="rounded-xl border px-4 py-3"

          >

            <option value="">
              All Categories
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

          </select>



          <button

            className="rounded-xl bg-black px-5 py-3 font-bold text-white md:col-span-3"

          >

            Search

          </button>


        </form>







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

              className="rounded-2xl border p-6 transition hover:shadow-lg"

            >



              {contractor.logo && (

                <Image

                  src={contractor.logo}

                  width={64}

                  height={64}

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




              <p className="mt-4 line-clamp-3 text-gray-600">

                {contractor.description}

              </p>





              {contractor.featured && (

                <span className="mt-4 inline-block rounded-full bg-black px-3 py-1 text-xs text-white">

                  Featured Contractor

                </span>

              )}



            </Link>


          ))}



        </div>


      </section>


    </main>

  );

}