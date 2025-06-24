"use client";
import { IconChevronDown, IconShoppingBag } from "@tabler/icons-react";
import {
  Burger,
  Button,
  Center,
  Modal,
  Grid,
  GridCol,
  Group,
  Image,
  Menu,
  Badge,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMenu.module.css";
import { IconPhone, IconMail, IconSearch } from "@tabler/icons-react";
import { AuthForm } from "../Auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "../UserProfile/UserProfile";
import { useRouter } from "next/navigation";
import { getCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { usestoneStore } from "@/store/useStoneStore";

const links = [
  { link: "/", label: "Home" },
  {
    link: "/education",
    label: "Gemstones Education",
  },
  { link: "/colorstone-layouts", label: "Colorstone Layouts" },
  { link: "/pricing", label: "Pricing" },
  {
    link: "#2",
    label: "More",
    links: [
      { link: "/customer-support/education", label: "Gemstones Education" },
      { link: "/customer-support/about-us", label: "About B. V. Gems." },
      { link: "/customer-support/store-policy", label: "Store Policy" },
      { link: "/customer-support/faqs", label: "FAQ" },
      { link: "/customer-support/contact-us", label: "Contact Us" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();

  const gemstones: any = usestoneStore((state) => state.gemstones) || [];

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

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => {
      const isSubActive = pathname === item.link;
      return (
        <Menu.Item
          key={item.link}
          onClick={() => router.push(item.link)}
          className={isSubActive ? "text-[#6B7280]" : ""}
        >
          {item.label}
        </Menu.Item>
      );
    });

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <div className={classes.link}>
              <Center>
                <span
                  className={`${classes.linkLabel} ${
                    link.links?.some((item) => pathname === item.link)
                      ? "text-[#6B7280]"
                      : ""
                  }`}
                >
                  {link.label}
                </span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </div>
          </Menu.Target>
          <Menu.Dropdown className="flex flex-col gap-2 px-8">
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        <span
          className={`${classes.linkLabel} ${
            pathname === link.link ? "text-gray-400" : ""
          }`}
        >
          {link.label}
        </span>
      </Link>
    );
  });

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{
          style: {
            backdropFilter: "blur(4px)",
          },
        }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      <div className="flex justify-evenly py-1.5 mb-3 text-black">
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
            <IconPhone />
            (212) 944-4382
          </a>

          <a
            href="mailto:bvgemsinc@gmail.com"
            className="flex gap-2 hover:underline"
          >
            <IconMail />
            bvgemsinc@gmail.com
          </a>
        </div>
      </div>

      <header className={classes.header}>
        <nav className="mt-4">
          <Grid className={classes.inner}>
            <GridCol span={{ base: 12, md: 2 }}>
              <Image
                className="ml-5"
                src={"/assets/logo2.png"}
                alt="logo"
                h={60}
                w={150}
              />
            </GridCol>

            <GridCol className="flex justify-center" span={{ base: 12, md: 7 }}>
              <Group gap={5} visibleFrom="sm">
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
                {user ? (
                  <>
                    <IconShoppingBag
                      onClick={() => router?.push("/cart")}
                      className="hover:cursor-pointer"
                      size="22"
                    />
                    <Badge
                      className="absolute -top-2 -right-2"
                      size="xs"
                      color="violet"
                      variant="filled"
                      radius="xl"
                    >
                      {cartCount}
                    </Badge>
                  </>
                ) : null}
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
