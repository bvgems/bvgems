"use client";

import {
  IconChevronDown,
  IconShoppingBag,
  IconPhone,
  IconMail,
  IconSearch,
  IconArrowLeft,
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
  Autocomplete,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AuthForm } from "../Auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "../UserProfile/UserProfile";
import { getCartStore } from "@/store/useCartStore";
import { links } from "@/utils/constants";
import { fetchAllItems } from "@/apis/api";
import { useGemStore } from "@/store/useGlobalProductsStore";
import { useRef, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const [opened, { toggle }] = useDisclosure(false);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const { user } = useAuth();
  const router = useRouter();

  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const cart = cartStore((state: any) => state.cart);
  const cartCount = cart.reduce(
    (sum: any, item: any) => sum + item.quantity,
    0
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearchItems, setGlobalSearchItems] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchRedirect = (option: any) => {
    if (option?.image_url) {
      router?.push(
        `/product-details?id=${option?.id}&name=${option?.collection_slug}`
      );
    } else {
      router.push(
        `/jewerly/${option?.productType?.toLowerCase()}/${option?.handle}`
      );
    }
  };

  const getFlattenJewleryData = (jewelryProducts: any) => {
    return jewelryProducts.map((item: any) => ({
      ...item.node,
      label: item.node.title,
      value: item.node.title,
    }));
  };

  const handleSearchClick = async () => {
    setSearchOpen(true);
    const store = useGemStore.getState();
    const { gemstones, products, setGemstones, setProducts } = store;

    let updatedGemstones = gemstones;
    let updatedProducts = products;

    if (gemstones.length === 0 || products.length === 0) {
      const allItems = await fetchAllItems();

      if (allItems.allLooseGemstones && gemstones.length === 0) {
        setGemstones(allItems.allLooseGemstones);
        updatedGemstones = allItems.allLooseGemstones;
      }

      if (allItems.mergedJewleryData && products.length === 0) {
        setProducts(allItems.mergedJewleryData);
        updatedProducts = allItems.mergedJewleryData;
      }
    }

    const allJeweleryProducts = getFlattenJewleryData(updatedProducts);
    const mergedSearchItems = [...updatedGemstones, ...allJeweleryProducts];

    setGlobalSearchItems(
      mergedSearchItems.map((item: any) => ({
        ...item,
        label: item.title || item.label || item.value,
        value: item.title || item.label || item.value,
      }))
    );
  };

  const renderGlobalItems = ({ option, ...props }: any) => {
    return (
      <div
        onClick={() => handleSearchRedirect(option)}
        key={option.value}
        {...props}
        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
      >
        <Image
          h={70}
          w={70}
          fit="fill"
          src={option.images?.edges[0]?.node?.url ?? option?.image_url}
          className="w-10 h-10 rounded object-cover"
        />
        <div>
          <p className="text-sm font-medium">{option.label}</p>
        </div>
      </div>
    );
  };

  const items = links.map((link) => {
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
              {!searchOpen ? (
                <Group className="uppercase" gap={5} visibleFrom="sm">
                  {items}
                </Group>
              ) : (
                <div className="w-full flex items-center justify-center gap-1">
                  <Autocomplete
                    size="md"
                    ref={searchInputRef}
                    clearable
                    leftSection={<IconSearch />}
                    data={globalSearchItems}
                    renderOption={renderGlobalItems}
                    onOptionSubmit={(val) => {
                      const selectedItem = globalSearchItems.find(
                        (item) => item.label.toLowerCase() === val.toLowerCase()
                      );
                      if (selectedItem) {
                        handleSearchRedirect(selectedItem);
                      }
                    }}
                    placeholder="Search for gemstones, jewelry, etc..."
                    className="w-full px-4 py-2 rounded-md text-black"
                  />
                  <Button
                    w={100}
                    variant="light"
                    leftSection={<IconArrowLeft size={20} />}
                    size="compact-md"
                    color="#0b182d"
                    onClick={() => {
                      setSearchOpen(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              )}
            </GridCol>

            <GridCol
              span={{ base: 12, md: 3 }}
              className="flex items-center justify-start gap-3"
            >
              {!searchOpen && (
                <>
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
                  <IconSearch
                    className="hover:cursor-pointer"
                    size="22"
                    onClick={handleSearchClick}
                  />
                  <div className="relative ml-3.5">
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
                  </div>
                </>
              )}
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
