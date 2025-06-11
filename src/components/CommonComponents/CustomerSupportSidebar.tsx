"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, AccordionPanel, List, ListItem, rem } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

const accordionData = [
  {
    value: "education",
    label: "Education",
    children: [
      {
        label: "Gemstone Education",
        href: "/customer-support/gemstone-education",
      },
    ],
  },
  {
    value: "get-to-know-us",
    label: "Get to Know Us",
    children: [
      {
        label: "About Us",
        href: "/customer-support/about-us",
      },
    ],
  },
  {
    value: "customer-center",
    label: "Customer Center",
    children: [
      {
        label: "Contact Us",
        href: "/customer-support/contact-us",
      },
      {
        label: "Frequently Asked Questions",
        href: "/customer-support/faqs",
      },
    ],
  },
  {
    value: "our-policies",
    label: "Our Policies",
    children: [
      {
        label: "Store Policy",
        href: "/customer-support/store-policy",
      },
      {
        label: "Return Policy",
        href: "/customer-support/return-policy",
      },
      {
        label: "Shipping Policy",
        href: "/customer-support/shipping-policy",
      },
    ],
  },
  {
    value: "site-map",
    label: "Site Map",
    children: [
      {
        label: "About Us",
        href: "/customer-support/sitemap",
      },
    ],
  },
];

export const CustomerSupportSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl ml-9 mt-12 shadow-md border border-gray-200">
      <div className="bg-violet-800 text-white text-lg font-semibold px-4 py-3 rounded-t-xl">
        QUICK NAVIGATIONS
      </div>
      <Accordion
        chevron={<IconChevronDown size={rem(16)} />}
        chevronPosition="right"
        defaultValue={accordionData.map((item) => item.value)}
        transitionDuration={400}
        multiple
        styles={{
          item: {
            borderBottom: "1px solid #e5e7eb",
          },
          control: {
            fontSize: rem(15),
            color: "#333",
            "&:hover": {
              backgroundColor: "#f9fafb",
            },
          },
        }}
      >
        {accordionData.map((item: any) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Control
              className={`${
                (item.href && pathname === item.href) ||
                (item.children &&
                  item.children.some((child: any) => pathname === child.href))
                  ? "text-purple-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <span className="flex flex-row items-center gap-2">
                <IconChevronRight size={"16"} />
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  item.label
                )}
              </span>
            </Accordion.Control>
            {item.children && (
              <AccordionPanel className="pl-4">
                <List spacing={0} size="sm">
                  {item.children.map((child: any) => (
                    <ListItem
                      key={child.href}
                      className={`rounded-md px-2 py-1 ${
                        pathname === child.href
                          ? "text-purple-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-semibold flex flex-row gap-2 items-center">
                        <IconChevronRight size={"20"} />
                        <Link href={child.href} className="block w-full">
                          {child.label}
                        </Link>
                      </span>
                    </ListItem>
                  ))}
                </List>
              </AccordionPanel>
            )}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};
