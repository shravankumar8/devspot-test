"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const roles = [
    {
      id: "builder",
      title: "Builder",
      description:
        "Participate in hackathons, create projects, contribute to bounties, and more",
      icon: Users,
    },
    {
      id: "technology-owner",
      title: "Technology Owner",
      description:
        "Host hackathons, advertise job openings, find top industry talent, and more",
      icon: Mail,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="">
          <h1 className="text-3xl font-medium text-white mb-9">I am a...</h1>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all !rounded-2xl font-roboto duration-200 border-2 bg-transparent hover:bg-secondary-bg ${
                  selectedRole === role.id
                    ? "gradient-border"
                    : "border-tertiary-bg"
                }`}
                onClick={() => {
                  setSelectedRole(role.id);
                }}
              >
                <CardContent className="px-9 py-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-8 h-8 text-main-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-normal text-white mb-2">
                        {role.title}
                      </h3>
                      <p className="text-secondary-text font-normal text-sm leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6 pt-9">
          <div className="flex justify-center gap-2 items-center font-roboto font-medium !text-base">
            <p className="text-secondary-text">Already have an account?</p>
            <Link href="/login" className="underline">
              <Button
                variant="tertiary"
                size="lg"
                className="!text-base text-white !pb-[2px]"
                type="button"
              >
                Log In
              </Button>
            </Link>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                selectedRole === "builder"
                  ? router.push("/sign-up/participants")
                  : router.push("/sign-up/TO");
              }}
              disabled={!selectedRole}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
