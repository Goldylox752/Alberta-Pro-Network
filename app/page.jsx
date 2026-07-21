import Link from "next/link";

export const metadata = {
  title: "Alberta Pro Network | Trusted Alberta Contractors",
  description:
    "Find trusted Alberta contractors for roofing, plumbing, electrical, construction, landscaping and more.",
};

const categories = [
  {
    name: "Roofing",
    icon: "🏠",
    description: "Roof repairs, replacements and inspections",
  },
  {
    name: "Plumbing",
    icon: "🔧",
    description: "Licensed plumbers across Alberta",
  },
  {
    name: "Electrical",
    icon: "⚡",
    description: "Electrical contractors and services",
  },
  {
    name: "General Contractors",
    icon: "🏗️",
    description: "Renovations, builds and construction",
  },
  {
    name: "Landscaping",
    icon: "🌲",
    description: "Outdoor projects and maintenance",
  },
  {
    name: "Telecom & Smart Home",
    icon: "📡",
    description: "Internet, cameras and smart systems",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      <section className="bg-gray-50 px-6 py-24 text-center">

        <h1 className="text-5xl font-bold">
          Alberta's Trusted Contractor Network
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
          Find reliable roofing, construction, electrical, plumbing and home
          service professionals across Alberta.
        </p>


        <div className="mt-10 flex justify-center gap-4">

          <Link
            href="/contractors"
            className="rounded-xl bg-black px-8 py-4 font-semibold text-white"
          >
            Find Contractors
          </Link>


          <Link
            href="/submit"
            className="rounded-xl border px-8 py-4 font-semibold"
          >
            List Your Business
          </Link>

        </div>

      </section>


      <section className="px-6 py-12">

        <div className="mx-auto max-w-4xl rounded-2xl border p-6 shadow-sm">

          <h2 className="mb-5 text-2xl font-bold">
            Search Contractors
          </h2>


          <div className="grid gap-4 md:grid-cols-3">

            <input
              placeholder="Service"
              className="rounded-lg border px-4 py-3"
            />


            <input
              placeholder="City"
              className="rounded-lg border px-4 py-3"
            />


            <button className="rounded-lg bg-black text-white">
              Search
            </button>

          </div>

        </div>

      </section>



      <section className="px-6 py-16">

        <h2 className="mb-10 text-center text-3xl font-bold">
          Popular Services
        </h2>


        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={`/categories/${category.name
                .toLowerCase()
                .replaceAll(" ", "-")}`}
              className="rounded-2xl border p-6 transition hover:shadow-lg"
            >

              <div className="text-4xl">
                {category.icon}
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {category.name}
              </h3>

              <p className="mt-2 text-gray-600">
                {category.description}
              </p>

            </Link>

          ))}

        </div>

      </section>



      <section className="bg-black px-6 py-20 text-center text-white">

        <h2 className="text-4xl font-bold">
          Get More Customers For Your Business
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Join Alberta Pro Network and get discovered by homeowners looking
          for trusted contractors.
        </p>


        <Link
          href="/pricing"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-black"
        >
          Become Featured
        </Link>

      </section>



      <footer className="border-t py-8 text-center text-gray-500">
        © {new Date().getFullYear()} Alberta Pro Network by NorthSky
      </footer>


    </main>
  );
}