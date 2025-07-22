import Image from "next/image";

export const PriceCard = () => {
  return (
    <div className="cursor-pointer flex items-center gap-6 w-full rounded-lg pl-4 py-2 shadow-xl bg-gradient-to-r from-transparent via-slate-200 to-slate-100">
      <div className="w-14 p-1 flex justify-between">
        <Image src="/first.png" alt="Free" width={70} height={50} />
      </div>
      <div>
        <h3 className="font-semibold">$10,000</h3>
        <p className="text-sm text-white text-opacity-50">+ 2,000 Dev Spo...</p>
      </div>
    </div>
  );
};
