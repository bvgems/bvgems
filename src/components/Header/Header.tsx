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
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { link: "/", label: "Home" },
  {
    link: "/education",
    label: "Gemstones Education",
    // links: [
    //   { link: "/docs", label: "Documentation" },
    //   { link: "/resources", label: "Resources" },
    //   { link: "/community", label: "Community" },
    //   { link: "/blog", label: "Blog" },
    // ],
  },
  { link: "/about", label: "About" },
  { link: "/pricing", label: "Pricing" },
  {
    link: "#2",
    label: "Support",
    links: [
      { link: "/faq", label: "FAQ" },
      { link: "/demo", label: "Book a demo" },
      { link: "/forums", label: "Forums" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();

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
          className={isSubActive ? "text-[#5d0ec0]" : ""}
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
                      ? "text-[#5d0ec0]"
                      : ""
                  }`}
                >
                  {link.label}
                </span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </div>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        <span
          className={`${classes.linkLabel} ${
            pathname === link.link ? "text-[#5d0ec0]" : ""
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

      <div className="mx-16 flex justify-evenly mb-3 mt-2 text-violet-800">
        <div>🇺🇸 66 W 47th St, Booth #9 and #10 , New York, NY 10036</div>
        <div className="flex justify-around gap-6">
          <span className="flex gap-2">
            <IconPhone />
            (212) 944-4382
          </span>
          <span className="flex gap-2">
            <IconMail />
            bvgemsinc@gmail.com
          </span>
        </div>
      </div>
      <header className={classes.header}>
        <nav className="mt-4">
          <Grid className={classes.inner}>
            <GridCol span={{ base: 12, md: 2 }}>
              <Image
                className="ml-5"
                src={"/assets/logo.png"}
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
                <Button color="violet" onClick={open}>
                  Sign In
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
