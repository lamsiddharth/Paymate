"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <div
      className={`flex ${selected ? "text-[#6a51a6]" : "text-slate-500"} cursor-pointer  p-2 pl-8 mb-4`}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="pr-2 text-3xl">{icon}</div>
      <div
        className={`font-bold ${selected ? "text-[#6a51a6]" : "text-slate-500"} text-3xl text-bold`}
      >
        {title}
      </div>
    </div>
  );
};
