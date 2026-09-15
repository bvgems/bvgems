"use client";

import { AuthForm } from "@/components/Auth/AuthForm";
import { Breadcrumbs, Anchor } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Login", href: "/login" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} className="text-gray-600 hover:text-black">
      {item.title}
    </Anchor>
  ));

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs separator="›" className="mb-8">
        {breadcrumbs}
      </Breadcrumbs>
      
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <AuthForm onClose={() => { window.location.href = redirectPath; }} />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
