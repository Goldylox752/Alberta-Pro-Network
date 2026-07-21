import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


async function getReviews() {

  const supabase = await createClient();


  const {

    data: reviews,

    error

  } = await supabase

    .from("reviews")

    .select(`

      id,

      name,

      rating,

      comment,

      approved,

      created_at,

      contractor:contractors(

        id,

        business_name,

        city,

        category

      )

    `)

    .order("created_at", {

      ascending: false

    });



  if (error) {

    console.log(error);

    return [];

  }



  return reviews || [];

}





export const metadata = {

  title:
    "Review Management | Alberta Pro Network",

  description:
    "Approve and manage contractor reviews."

};





export default async function AdminReviewsPage() {


  const supabase = await createClient();



  const {

    data:{
      user

    }

  } = await supabase.auth.getUser();





  if (!user) {

    redirect("/login");

  }





  async function updateReview(formData) {

    "use server";


    const supabase = await createClient();



    const id =
      formData.get("id");



    const approved =
      formData.get("approved") === "true";




    await supabase

      .from("reviews")

      .update({

        approved

      })

      .eq(

        "id",

        id

      );



    redirect("/admin/reviews");

  }





  const reviews =
    await getReviews();





  return (

    <main className="min-h-screen bg-gray-50 px-6 py-16">


      <section className="mx-auto max-w-6xl">


        <h1 className="text-4xl font-bold">

          Review Management

        </h1>



        <p className="mt-3 text-gray-600">

          Approve or hide contractor reviews.

        </p>






        <div className="mt-10 space-y-6">


          {reviews.length === 0 && (

            <div className="rounded-2xl border bg-white p-6">

              No reviews found.

            </div>

          )}







          {reviews.map((review) => (


            <div

              key={review.id}

              className="rounded-3xl border bg-white p-8 shadow-sm"

            >



              <h2 className="text-2xl font-bold">

                {review.contractor?.business_name}

              </h2>




              <p className="mt-2 text-gray-500">

                {review.contractor?.category}

                {" • "}

                {review.contractor?.city}

              </p>





              <div className="mt-5">


                <p className="font-semibold">

                  {review.name}

                </p>



                <p className="mt-2">

                  {"⭐".repeat(review.rating)}

                </p>



                <p className="mt-3 text-gray-600">

                  {review.comment}

                </p>


              </div>






              <div className="mt-6 flex gap-4">


                <form action={updateReview}>


                  <input

                    type="hidden"

                    name="id"

                    value={review.id}

                  />



                  <button

                    name="approved"

                    value="true"

                    className="rounded-xl bg-black px-6 py-3 text-white"

                  >

                    Approve

                  </button>


                </form>





                <form action={updateReview}>


                  <input

                    type="hidden"

                    name="id"

                    value={review.id}

                  />



                  <button

                    name="approved"

                    value="false"

                    className="rounded-xl border px-6 py-3"

                  >

                    Hide

                  </button>


                </form>



              </div>




            </div>


          ))}



        </div>



      </section>


    </main>

  );

}