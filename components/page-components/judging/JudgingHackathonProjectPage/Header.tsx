import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="flex items-end gap-7 bg-[#263513] p-5 rounded-[20px] h-auto md:h-[196px]">
      <Image
        height={156}
        width={156}
        src="/microsoft-placeholder.jpg"
        className="rounded-xl object-cover"
        alt=""
      />

      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-secondary-text text-base">
          A collaboration tool built with Solidity
        </h4>
        <h2 className="font-bold text-white text-2xl">BookBot</h2>
      </div>
    </header>
  );
};

export default Header;
