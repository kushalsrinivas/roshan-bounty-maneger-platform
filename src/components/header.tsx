"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export function Header() {
  return (
    <Card className="m-5 border-b border-zinc-800 bg-black/50 p-5 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-light text-main">
          Permissionless
        </Link>
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              href="/"
              className="hover:text-primary text-main transition-colors"
            >
              Home
            </Link>
          </li>
          <li></li>
          <Button
            onClick={() => {
              redirect("/api/auth/signout");
            }}
          >
            Log Out
          </Button>
        </ul>
      </nav>
    </Card>
  );
}
