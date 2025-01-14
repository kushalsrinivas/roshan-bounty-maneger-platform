"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export function Header() {
  return (
    <Card className="rounded-none border-b p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-primary text-2xl font-bold">
          Permissionless
        </Link>
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </li>
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
