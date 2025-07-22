import BackButton from "@/components/page-components/judging/Backbutton";
import JudgingPage from "@/components/page-components/judging/JudgingPage";

export default async function JudgingHackathonPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  return (
    <div className="md:px-3 min-h-screen">
      <header className="flex gap-3 items-center">
        <BackButton url="/profile" />
        <h4 className="font-bold text-xl font-roboto">My profile</h4>
      </header>
      <JudgingPage judgingId={params.id} />
      <div id="footer-sentinel" className=" h-[1px]"></div>
    </div>
  );
}
