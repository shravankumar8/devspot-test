import Image from "next/image";

type OrganizerCardProps = {
  name?: string;
  logo?: string;
};

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  name = "Microsoft",
  logo = "/microsoft-placeholder.jpg",
}) => {
  return (
    <div className="cursor-pointer flex items-center gap-6 w-full rounded-lg pl-4 py-2 shadow-xl bg-gradient-to-r from-transparent via-slate-200 to-slate-100">
      <div className="w-14 p-1 flex justify-between">
        <Image src={logo} alt="Placeholder logo" width={70} height={50} />
      </div>
      <div>
        <span className="text-sm text-white text-opacity-40">Organizer</span>
        <h3 className="font-semibold">{name}</h3>
      </div>
    </div>
  );
};
