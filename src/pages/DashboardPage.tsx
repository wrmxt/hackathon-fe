import ItemsList from "@/components/ItemsList.tsx";
import BuildingOverview from "@/components/BuildingOverview.tsx";


export default function DashboardPage() {


  return (
    <section className="mt-2">

      <div className="mt-10 ">
        <BuildingOverview />
        <ItemsList />
      </div>

      {/*<pre>{JSON.stringify(items)}</pre>*/}
    </section>
  );
}

