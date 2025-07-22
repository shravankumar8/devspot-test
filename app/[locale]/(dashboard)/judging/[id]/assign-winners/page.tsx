import AssignWinners from "@/components/page-components/judging/assign-winners/AssignWinnersPage";
import BackButton from "@/components/page-components/judging/Backbutton";

export default async function AssignWinnersPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  return (
    <div className="md:px-3 min-h-screen">
      <header className="flex gap-3 items-center">
        <BackButton url={`/judging/${params.id}`} />
        <h4 className="font-bold text-xl font-roboto">Project scores</h4>
      </header>
      <AssignWinners id={params.id} />
      <div id="footer-sentinel" className=" h-[1px]"></div>
    </div>
  );
}
