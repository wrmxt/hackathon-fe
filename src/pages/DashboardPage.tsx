import ItemsList from "@/components/ItemsList.tsx";


export default function DashboardPage() {


  return (
    <section className="mt-2">

      <h1 className="text-3xl font-semibold mt-10 text-center ">Available items</h1>
      <ItemsList/>
      {/*<pre>{JSON.stringify(items)}</pre>*/}
    </section>
  );
}

