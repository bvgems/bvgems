"use client";

import {
  IconArrowRight,
  IconBrandInstagramFilled,
  IconCheck,
  IconMail,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Grid,
  GridCol,
  Image,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllGemstones, subscribeEmail } from "@/apis/api";
import { useRouter } from "next/navigation";
import { quickNavigationData } from "@/utils/constants";
import Link from "next/link";
import { notifications } from "@mantine/notifications";

export const Footer = () => {
  const router = useRouter();
  const [allGemstones, setAllGemstoenes] = useState([]);
  const [year, setYear] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  const handleSubmit = async () => {
    try {
      const res = await subscribeEmail(email);
      console.log('resss',res)
      localStorage.setItem("hideSubscribePopup", "true");

      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: res?.message,
        position: "top-right",
      });

      // if (res?.flag) {
      //   localStorage.setItem("hideSubscribePopup", "true");
      //   notifications.show({
      //     icon: <IconCheck />,
      //     color: "teal",
      //     message: res?.message,
      //     position: "top-right",
      //   });
      // } else {
      //   notifications.show({
      //     icon: <IconX />,
      //     color: "red",
      //     message: res.error || "An error occurred",
      //     position: "top-right",
      //   });
      // }
      close();
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  };
  useEffect(() => {
    const fetchAllGemstones = async () => {
      const response = await getAllGemstones();
      const formattedGemstones = response
        ?.map((item: any) => ({
          label: item?.title,
          link: item?.handle,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));
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
      <Grid gutter="xl" className="mx-5">
        <GridCol
          span={{ base: 12, md: 3 }}
          className="text-center sm:text-left"
        >
          <div className="flex flex-col gap-10">
            <div className=" flex flex-col justify-center items-center">
              <Image
                h={100}
                w={200}
                onClick={() => router.push("/")}
                src="/assets/logo2.png"
                alt="Logo"
                className="mx-auto md:mx-0 cursor-pointer"
              />
              <p className="text-sm mt-4 italic">
                "Where Every Gem Tells a Story."
              </p>
            </div>
            <div className="flex justify-center items-center gap-4">
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
          </div>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6">
            {groups}
          </div>
        </GridCol>

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

        <GridCol
          span={{ base: 12, md: 3 }}
          className="text-center sm:text-left"
        >
          <div className="flex flex-col gap-5">
            <Text size="md">
              Subscribe to our newsletter and get the latest trending products
              and offers updates.
            </Text>
            <div className="flex items-center">
              <TextInput
                leftSection={<IconMail size={16} />}
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                w="100%"
                radius={0}
                size="sm"
                rightSection={
                  <IconArrowRight
                    className="cursor-pointer"
                    onClick={handleSubmit}
                  />
                }
              />
            </div>
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
