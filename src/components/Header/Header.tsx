"use client";

import {
  IconChevronDown,
  IconShoppingBag,
  IconPhone,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";
import {
  Burger,
  Button,
  Center,
  Grid,
  GridCol,
  Group,
  Image,
  Modal,
  UnstyledButton,
  Text,
  ThemeIcon,
  HoverCard,
  SimpleGrid,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

import { AuthForm } from "../Auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "../UserProfile/UserProfile";
import { getCartStore } from "@/store/useCartStore";
import { usestoneStore } from "@/store/useStoneStore";
import { gemstoneOptions } from "@/utils/constants";

const links = [
  { link: "/", label: "Home" },
  {
    link: "/loose-gemstones",
    label: "Loose Gemstones",
    links: gemstoneOptions,
  },
  {
    label: "Jewelery",
    links: [
      { link: "/jewerly/rings", label: "Rings" },
      { link: "/jewerly/earrings", label: "Ear Rings" },
      { link: "/jewerly/necklaces", label: "Necklaces" },
      { link: "/jewerly/bracelets", label: "Bracelets" },
    ],
  },
  { link: "/colorstone-layouts", label: "Colorstone Layouts" },
  {
    label: "More",
    links: [
      {
        link: "/customer-support/education?activeStone=morganite",
        label: "Gemstones Education",
      },
      { link: "/customer-support/about-us", label: "About B. V. Gems." },
      { link: "/customer-support/store-policy", label: "Store Policy" },
      { link: "/customer-support/faqs", label: "FAQ" },
      { link: "/customer-support/contact-us", label: "Contact Us" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const gemstones = usestoneStore((state) => state.gemstones) || [];
  const [opened, { toggle }] = useDisclosure(false);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const cart = cartStore((state: any) => state.cart);
  const cartCount = cart.reduce(
    (sum: any, item: any) => sum + item.quantity,
    0
  );
  const router = useRouter();

  const items: any = links.map((link) => {
    const menuItems = link.links?.map((item: any) => (
      <UnstyledButton
        key={item.link}
        className="w-full px-4 py-2 rounded-md hover:bg-gray-100"
        onClick={() => router.push(item.link)}
      >
        <Group wrap="nowrap" align="flex-start">
          {item.image && (
            <ThemeIcon size={34} variant="default" radius="md">
              <Image src={item.image} alt={item.label} w={20} h={20} />
            </ThemeIcon>
          )}
          <div>
            <Text
              size="md"
              className={`text-[17px] ${
                pathname === item.link ? "text-gray-400" : "text-black"
              }`}
              pl={"lg"}
            >
              {item.label}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    ));

    if (link.label === "Loose Gemstones") {
      return (
        <HoverCard
          key={link.label}
          width={850}
          position="bottom"
          radius="md"
          shadow="md"
          withinPortal
        >
          <HoverCard.Target>
            <div className="px-3 py-2 rounded-sm hover:text-gray-500 text-[15px]">
              <Center>
                <span
                  className={`mr-1 text-[15px] ${
                    link.links?.some((item) => pathname === item.link)
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  {link.label}
                </span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </div>
          </HoverCard.Target>

          <HoverCard.Dropdown className="relative px-12 py-10 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[900px] h-[400px] flex">
            <Grid gutter="xl" className="w-full">
              <GridCol className="flex items-center" span={4}>
                <Image
                  src="/assets/header-img.png"
                  alt="Gemstone"
                  radius="md"
                  fit="cover"
                  h={300}
                  className="mt-8"
                />
              </GridCol>

              <GridCol span={8} className="relative">
                <SimpleGrid
                  cols={2}
                  spacing="md"
                  verticalSpacing="xs"
                  pt={"xl"}
                >
                  {menuItems}
                </SimpleGrid>

                <div className="flex justify-end pr-4">
                  <Button
                    variant="transparent"
                    color="#0b182d"
                    onClick={() => router.push("/loose-gemstones")}
                    className="text-blue-600 underline flex items-center gap-1 hover:text-blue-800"
                  >
                    <span className="underline">View All</span>
                    <IconChevronDown
                      style={{ transform: "rotate(-90deg)" }}
                      size={16}
                      stroke={2}
                    />
                  </Button>
                </div>
              </GridCol>
            </Grid>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    }

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <div className="px-3 py-2 rounded-sm hover:text-gray-500 text-[15px] font-medium">
              <Center>
                <span
                  className={`mr-1 text-[15px] ${
                    link.links?.some((item) => pathname === item.link)
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  {link.label}
                </span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </div>
          </Menu.Target>
          <Menu.Dropdown
            style={{ width: "200px" }}
            className="flex flex-col gap-5 text-xl"
          >
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    if (!link.link) return null;

    return (
      <Link
        key={link.label}
        href={link.link}
        className={`px-3 py-2 rounded-sm text-[15px] font-medium hover:text-gray-500 ${
          pathname === link.link ? "text-gray-400" : "text-black"
        }`}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      <div
        style={{ fontFamily: "system-ui, sans-serif" }}
        className="flex justify-evenly py-1 text-white bg-[#0b182d] text-sm"
      >
        <a
          href="https://www.google.com/maps/search/?api=1&query=66+West+47th+Street,+NYC,+NY+10036"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          🇺🇸 66 W 47th St, Booth #9 and #10, New York, NY 10036
        </a>

        <div className="flex justify-around gap-6">
          <a href="tel:+12129444382" className="flex gap-2 hover:underline">
            <IconPhone /> +1 (212) 944-4382
          </a>
          <a
            href="mailto:bvgemsinc@gmail.com"
            className="flex gap-2 hover:underline"
          >
            <IconMail /> bvgemsinc@gmail.com
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 h-[85px] border-b border-gray-300 bg-white">
        <nav className="mt-4">
          <Grid className="h-[75px] items-center justify-between">
            <GridCol span={{ base: 12, md: 2 }} className="flex justify-center">
              <Image
                className="ml-5 cursor-pointer"
                onClick={() => router.push("/")}
                src="/assets/logo2.png"
                alt="logo"
                h={50}
                w={100}
              />
            </GridCol>

            <GridCol span={{ base: 12, md: 7 }} className="flex justify-center">
              <Group className="uppercase" gap={5} visibleFrom="sm">
                {items}
              </Group>
            </GridCol>

            <GridCol
              span={{ base: 12, md: 3 }}
              className="flex items-center justify-start gap-3"
            >
              {user ? (
                <UserProfile user={user} />
              ) : (
                <Button
                  color="#6B7280"
                  variant="outline"
                  size="compact-md"
                  onClick={open}
                >
                  <span className="text-black">Sign In</span>
                </Button>
              )}
              <div className="w-px h-6 bg-gray-300" />
              <IconSearch className="hover:cursor-pointer" size="22" />
              <div className="relative ml-3.5">
                {user && (
                  <>
                    <IconShoppingBag
                      onClick={() => router.push("/cart")}
                      className="hover:cursor-pointer"
                      size="22"
                    />
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-[#0b182d] text-white rounded-full text-xs px-2 py-0.5">
                        {cartCount}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </GridCol>

            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
          </Grid>
        </nav>
      </header>
    </>
  );
}
