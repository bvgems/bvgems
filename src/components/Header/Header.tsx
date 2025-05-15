"use client";
import { IconChevronDown } from "@tabler/icons-react";
import {
  Burger,
  Button,
  Center,
  Container,
  Grid,
  GridCol,
  Group,
  Image,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMenu.module.css";
import { IconPhone, IconMail, IconSearch } from "@tabler/icons-react";

const links = [
  { link: "/", label: "Home" },
  {
    link: "#1",
    label: "Learn",
    links: [
      { link: "/docs", label: "Documentation" },
      { link: "/resources", label: "Resources" },
      { link: "/community", label: "Community" },
      { link: "/blog", label: "Blog" },
    ],
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
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <>
      <div className="mx-16 flex justify-evenly mb-3 mt-2">
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
              <Button
                variant="transparent"
                styles={{
                  root: {
                    color: "black",
                  },
                }}
              >
                Sign In
              </Button>
              <div className="w-px h-6 bg-gray-300" />
              <IconSearch size="18" />
            </GridCol>

            {/* Burger Menu */}
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
