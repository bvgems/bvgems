"use client";
import { Button, Image } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const GemstonesEducationBanner = () => {
  const router = useRouter();
  return (
    <div className="relative h-[500px] w-full">
      <Image
        src="/assets/generated-image.png"
        alt="Gemstone Education"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-20 flex flex-col gap-6 justify-start mt-36 ml-20">
        <h1 className="text-4xl text-violet-800 font-bold max-w-[500px]">
          Gemstone Information
        </h1>
        <div className="max-w-[650px]">
          <p>
            If you're considering diving into the world of colored gemstones,
            the best first step is to educate yourself. There's much to
            explore—from understanding color and quality to evaluating
            durability and benefits. Begin your journey with our gemstone guide
            and uncover a vibrant selection to suit every customer's unique
            preferences.
          </p>
          <Button
            className="mt-3"
            color="violet"
            rightSection={<IconArrowRight />}
            onClick={() => {
              router?.push("/education");
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};
