"use client";

import {
  IconBrandFacebook,
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandInstagramFilled,
  IconBrandTwitter,
  IconBrandTwitterFilled,
  IconBrandYoutube,
  IconBrandYoutubeFilled,
  IconMapPin,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllGemstones } from "@/apis/api";
import { useRouter } from "next/navigation";
import { quickNavigationData } from "@/utils/constants";

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

      const formattedGemstones = response?.map((item: any) => {
        return {
          label: item?.title,
          link: item?.handle,
        };
      });

      setAllGemstoenes(formattedGemstones);
    };
    fetchAllGemstones();
  }, []);

  const customerSevices = quickNavigationData?.map((item) => {
    if (item?.children?.length > 1) {
      return item?.children?.map((value) => {
        return { label: value?.label, link: value?.href };
      });
    } else {
      return {
        label: item?.children[0]?.label,
        link: item?.children[0]?.href,
      };
    }
  });

  const flattenCustomerServices = customerSevices.flatMap((item) => {
    return Array.isArray(item) ? item : [item];
  });

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
    const links = group.links.map((link, index) => (
      <h3
        className="text-md cursor-pointer hover:text-gray-500"
        key={index}
        onClick={() => {
          router.push(`${link?.link}`);
        }}
      >
        {link.label}
      </h3>
    ));

    return (
      <div key={group.title}>
        <h1 className="text-xl text-gray-500 mb-4">{group.title}</h1>
        <div className="flex flex-col gap-2">{links}</div>
      </div>
    );
  });

  return (
    <footer className="pt-12 pr-4 bg-white">
      <Grid gutter={"xl"} className="px-2">
        <GridCol
          className="flex flex-col items-center"
          span={{ base: 12, md: 3 }}
        >
          <Image h={100} w={200} src="/assets/logo2.png" alt="Logo" />
          <p className="text-sm text-gray-500 mt-4 italic">
            "Where Every Gem Tells a Story."
          </p>
        </GridCol>
        <GridCol span={{ base: 12, md: 4 }}>
          <div className="flex flex-wrap gap-12 mt-6 md:mt-0">{groups}</div>
        </GridCol>
        <GridCol span={{ base: 12, md: 2 }}>
          <div className="flex flex-col">
            <h1 className="text-xl text-gray-500 mb-4">Visit Us</h1>

            <a
              href="https://www.google.com/maps/search/?api=1&query=66+West+47th+Street,+NYC,+NY+10036"
              className="hover:underline cursor-pointer"
            >
              66 W 47th St, Booth #9 and #10
              <br />
              New York, NY 10036
            </a>
            <div className="mt-12">
              <h2 className="text-md">Custmer Service Hours</h2>
              <div className="flex flex-col justify-start mt-1.5 gap-1">
                <span>Mon: 9:00 AM - 7:00 AM</span>
                <span>Sat: By Appointment Only</span>
                <span>Sun: Closed</span>
              </div>
            </div>
          </div>
        </GridCol>
        <GridCol span={{ base: 12, md: 3 }}>
          <div className="flex flex-col gap-6 text-center">
            <h1 className="text-xl text-gray-500">Industry Affiliations</h1>
            <div className="flex items-center gap-4 px-8">
              <Image h={120} w={120} src={"/assets/jbt-logo.png"} />
              <Image fit="fill" h={100} w={120} src={"/assets/agta-logo.png"} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-7">
            <h1 className="mb-2">Follow Us On:</h1>
            <div className="flex flex-wrap gap-4">
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandTwitterFilled
                  color="#1DA1F2"
                  size={26}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandYoutubeFilled
                  color="#FF0000"
                  size={26}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandInstagramFilled
                  color="#E1306C"
                  size={26}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandFacebookFilled color="#1877F2" size={26} stroke={1.5} />
              </ActionIcon>
            </div>
          </div>
        </GridCol>
      </Grid>

      <div className="flex justify-between items-center border-gray-200 dark:border-gray-600 mt-6 py-6 px-9">
        {year && (
          <Text size="sm" className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {year} bvgems.com All rights reserved.
          </Text>
        )}
      </div>
    </footer>
  );
};
