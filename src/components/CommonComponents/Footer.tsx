"use client";

import { IconBrandInstagramFilled } from "@tabler/icons-react";
import { ActionIcon, Grid, GridCol, Image, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllGemstones } from "@/apis/api";
import { useRouter } from "next/navigation";
import { quickNavigationData } from "@/utils/constants";
import Link from "next/link";

export const Footer = () => {
  const router = useRouter();
  const [allGemstones, setAllGemstoenes] = useState([]);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const fetchAllGemstones = async () => {
      const response = await getAllGemstones();
      const formattedGemstones = response?.map((item: any) => ({
        label: item?.title,
        link: item?.handle,
      }));
      setAllGemstoenes(formattedGemstones);
    };
    fetchAllGemstones();
  }, []);

  const customerSevices = quickNavigationData?.map((item) => {
    if (item?.children?.length > 1) {
      return item?.children?.map((value) => ({
        label: value?.label,
        link: value?.href,
      }));
    } else {
      return {
        label: item?.children[0]?.label,
        link: item?.children[0]?.href,
      };
    }
  });

  const flattenCustomerServices = customerSevices.flatMap((item) =>
    Array.isArray(item) ? item : [item]
  );

  const data = [
    {
      title: "Loose Gemstones",
      links: allGemstones,
    },
    {
      title: "Customer Services",
      links: flattenCustomerServices,
    },
  ];

  const groups = data.map((group) => {
    const links = group?.links?.map((link, index) => (
      <h3
        className="text-sm sm:text-base cursor-pointer hover:text-gray-500"
        key={index}
        onClick={() => {
          router.push(`${link?.link}`);
        }}
      >
        {link.label}
      </h3>
    ));

    return (
      <div key={group.title} className="mb-6 sm:mb-0">
        <h1 className="text-lg sm:text-xl mb-3 font-semibold">{group.title}</h1>
        <div className="flex flex-col gap-1">{links}</div>
      </div>
    );
  });

  return (
    <footer className="pt-12 px-4 pb-6 bg-[#F9F5F0] text-black">
      <Grid gutter="xl" className="max-w-screen-xl mx-auto">
        {/* Logo + Tagline */}
        <GridCol
          span={{ base: 12, md: 3 }}
          className="text-center sm:text-left"
        >
          <Image
            h={100}
            w={200}
            src="/assets/logo2.png"
            alt="Logo"
            className="mx-auto md:mx-0"
          />
          <p className="text-sm mt-4 italic">
            "Where Every Gem Tells a Story."
          </p>
        </GridCol>

        {/* Links */}
        <GridCol span={{ base: 12, md: 4 }}>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6">
            {groups}
          </div>
        </GridCol>

        {/* Visit Us */}
        <GridCol
          span={{ base: 12, md: 2 }}
          className="text-center sm:text-left"
        >
          <h1 className="text-lg sm:text-xl mb-3 font-semibold">Visit Us</h1>
          <a
            href="https://www.google.com/maps/search/?api=1&query=66+West+47th+Street,+NYC,+NY+10036"
            className="hover:underline cursor-pointer text-sm"
          >
            66 W 47th St, Booth #9 and #10
            <br />
            New York, NY 10036
          </a>
          <div className="mt-4">
            <h2 className="text-md font-medium">Customer Service Hours</h2>
            <div className="flex flex-col justify-start mt-1.5 gap-1 text-sm">
              <span>Mon: 9:00 AM - 7:00 PM</span>
              <span>Sat: By Appointment Only</span>
              <span>Sun: Closed</span>
            </div>
          </div>
        </GridCol>

        {/* Industry Affiliations */}
        <GridCol
          span={{ base: 12, md: 3 }}
          className="text-center sm:text-left"
        >
          <h1 className="text-lg sm:text-xl mb-3 font-semibold">
            Industry Affiliations
          </h1>
          <div className="flex justify-center sm:justify-start items-center gap-4 px-2">
            <Link target="_blank" href="https://www.jewelersboard.com/">
              <Image h={100} w={100} src={"/assets/jbt-logo.png"} />
            </Link>
            <Link target="_blank" href="https://agta.org/">
              <Image
                h={90}
                w={100}
                fit="contain"
                src={"/assets/agta-logo.png"}
              />
            </Link>
          </div>
        </GridCol>
      </Grid>


      <div className=" border-gray-300 mt-10 pt-6">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {year && (
            <Text size="sm" className="text-gray-500 text-center md:text-left">
              &copy; {year} bvgems.com. All rights reserved.
            </Text>
          )}
          <div className="flex items-center gap-2">
            <Text size="sm">Follow Us On:</Text>
            <a
              href="https://www.instagram.com/bvgemsinc/?igsh=aG93ank2anBkaG9p"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandInstagramFilled color="#E1306C" stroke={1.5} />
              </ActionIcon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
