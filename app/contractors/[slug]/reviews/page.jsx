import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getContractor(slug) {

  const supabase = await createClient();


  const {
    data: contractor
  } = await supabase

    .from("contractors")

    .select(`
      id,
      business_name,
      category,
      city
    `)

    .eq("slug", slug)

    .single();



  return contractor;

}





async function getReviews(contractorId) {

  const supabase = await createClient();


  const {
    data: reviews
  } = await supabase

    .from("reviews")

    .select("*")

    .eq("contractor_id", contractorId)

    .eq("approved", true)

    .order("created_at", {
      ascending: false
    });



  return reviews || [];

}





export async function generateMetadata({ params }) {


  const { slug } = await params;


  const contractor =
    await getContractor(slug);



  return {

    title:
      `${contractor?.business_name || "Contractor"} Reviews | Alberta Pro Network`,

    description:
      `Read customer reviews for ${contractor?.business_name}.`

  };

}





export default async function ReviewsPage({ params }) {


  const { slug } = await params;


  const contractor =
    await getContractor(slug);



  if (!contractor) {

    notFound();

  }



  const reviews =
    await getReviews(contractor.id);






  async function submitReview(formData) {

    "use server";


    const supabase = await createClient();



    await supabase

      .from("reviews")

      .insert({

        contractor_id: contractor.id,

        name:
          formData.get("name"),

        rating:
          Number(formData.get("rating")),

        comment:
          formData.get("comment")

      });



    redirect(
      `/contractors/${slug}/reviews`
    );

  }





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-5xl">


        <h1 className="text-4xl font-bold">

          {contractor.business_name} Reviews

        </h1>



        <p className="mt-3 text-gray-600">

          {contractor.category} • {contractor.city}

        </p>






        <div className="mt-10 rounded-3xl bg-white p-8 border">


          <h2 className="text-2xl font-bold">

            Customer Reviews

          </h2>




          {reviews.length === 0 && (

            <p className="mt-4 text-gray-600">

              No reviews yet. Be the first to review this business.

            </p>

          )}






          <div className="mt-6 space-y-5">


            {reviews.map((review) => (


              <div

                key={review.id}

                className="rounded-xl border p-5"

              >


                <div className="font-bold">

                  {review.name}

                </div>



                <div className="mt-2">

                  {"⭐".repeat(review.rating)}

                </div>



                <p className="mt-3 text-gray-600">

                  {review.comment}

                </p>



              </div>


            ))}



          </div>


        </div>








        <div className="mt-10 rounded-3xl bg-white p-8 border">


          <h2 className="text-2xl font-bold">

            Leave a Review

          </h2>





          <form

            action={submitReview}

            className="mt-6 space-y-5"

          >



            <input

              name="name"

              required

              placeholder="Your Name"

              className="w-full rounded-xl border px-4 py-3"

            />





            <select

              name="rating"

              required

              className="w-full rounded-xl border px-4 py-3"

            >

              <option value="5">
                ⭐⭐⭐⭐⭐
              </option>

              <option value="4">
                ⭐⭐⭐⭐
              </option>

              <option value="3">
                ⭐⭐⭐
              </option>

              <option value="2">
                ⭐⭐
              </option>

              <option value="1">
                ⭐
              </option>


            </select>





            <textarea

              name="comment"

              rows="5"

              placeholder="Your experience"

              className="w-full rounded-xl border px-4 py-3"

            />






            <button

              className="rounded-xl bg-black px-6 py-4 font-bold text-white"

            >

              Submit Review

            </button>



          </form>



        </div>



      </section>


    </main>

  );

}