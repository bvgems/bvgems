"use client";
import {
  IconChevronDown,
  IconShoppingBag,
  IconSearch,
  IconArrowLeft,
  IconUser,
  IconX,
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
  Menu,
  Autocomplete,
  em,
  Loader,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { AuthForm } from "../Auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "../UserProfile/UserProfile";
import { getCartStore } from "@/store/useCartStore";
import { links } from "@/utils/constants";
import { DrawerComponent } from "./Drawer";
import { HeaderHoverCardForGemstones } from "./HeaderHoverCardForGemstones";
import { AddressBar } from "./AddressBar";
import { getSearchResult } from "@/apis/api";

export function Header() {
  const isMobile = useMediaQuery(`(max-width: ${em(991)})`);
  const isSmaller = useMediaQuery(`(max-width: ${em(576)})`);
  const smallerTextFlag = useMediaQuery(
    `(min-width: ${em(992)}) and (max-width: ${em(1433)})`
  );

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "calibrated" | "freeSize" | "jewelry"
  >("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data: any = await getSearchResult(searchQuery, activeFilter);
      setSearchResults(
        data?.map((item: any) => {
          const display = `${
            item.collection_slug ?? item.gemstone_type ?? ""
          } ${item.shape ?? ""}  ${item.size ?? item.dimension ?? ""} - ${
            item.id
          }`.trim();

          return {
            ...item,
            value: display,
            label: display,
          };
        })
      );
      setLoading(false);
    };

    const debounceTimer = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeFilter]);

  const handleSearchRedirect = (option: any) => {
    setSearchOpen(false);
    setSearchQuery("");

    if (option?.gemstone_type) {
      router?.push(`/free-size-gemstone-details/${option?.id}`);
    } else if (option?.collection_slug) {
      router.push(
        `/product-details?id=${option?.id}&name=${option?.collection_slug}`
      );
    } else {
      router.push(
        `/jewelry-details/${option?.productType?.toLowerCase()}/${
          option?.handle
        }`
      );
    }
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const renderSearchOption = ({ option, ...props }: any) => (
    <div
      onClick={() => handleSearchRedirect(option)}
      key={option.value}
      {...props}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="flex-shrink-0">
        <Image
          h={50}
          w={50}
          fit="cover"
          src={option.images?.edges?.[0]?.node?.url ?? option?.image_url}
          className="object-cover"
          alt={option.label}
        />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {String(option?.id ?? "").startsWith("gid")
            ? `${option?.title}`
            : option?.collection_slug === "Sapphire"
            ? `${option?.color} ${
                option.collection_slug || option.gemstone_type
              } ${option.shape} ${option.size || option.dimension}${
                option.category === "Calibrated" && option.quality
                  ? ` - ${option.quality} Quality`
                  : ""
              }`
            : `${option.collection_slug || option.gemstone_type} ${
                option.shape
              } ${option.size || option.dimension}${
                option.category === "Calibrated" && option.quality
                  ? ` - ${option.quality} Quality`
                  : ""
              }`}
        </p>
        <span className="text-xs text-gray-500 capitalize mt-1 block">
          {option.category}
        </span>
      </div>
    </div>
  );

  const FilterButtons = ({ className = "" }: { className?: string }) => (
    <div className={`flex gap-2 ${className}`}>
      {[
        { key: "all", label: "All" },
        { key: "calibrated", label: "Calibrated" },
        { key: "freeSize", label: "Free Size" },
        { key: "jewelry", label: "Jewelry" },
      ].map((filter) => (
        <button
          key={filter.key}
          onClick={() =>
            setActiveFilter(
              filter.key as "all" | "calibrated" | "freeSize" | "jewelry"
            )
          }
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.key
              ? "bg-[#0b182d] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );

  const getPlaceholder = () => {
    if (activeFilter === "freeSize") {
      return "Search by gemstone name, lot number, size, weight etc.";
    }
    return "Search for gemstones, jewelry, and more...";
  };

  // Navbar items
  const items = links.map((link, index) => {
    const menuItems = link.links?.map((item: any) => (
      <UnstyledButton
        key={item.link}
        className="w-full px-4 py-2 rounded-md hover:bg-gray-100"
        onClick={() => router.push(item.link)}
      >
        <Group wrap="nowrap" align="flex-start">
          {item.image && (
            <ThemeIcon size={34} variant="transparent">
              <Image src={item.image} alt={item.label} w={20} h={20} />
            </ThemeIcon>
          )}
          <div className="hover:text-gray-500">
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

    if (link.label === "Gemstones") {
      return (
        <HeaderHoverCardForGemstones
          key={index}
          link={link}
          smallerTextFlag={smallerTextFlag}
          pathname={pathname}
          menuItems={menuItems}
        />
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
            <div className="px-3 py-2 rounded-sm hover:text-gray-500 text-[15px] ">
              <Center>
                <span
                  className={`mr-1 ${
                    smallerTextFlag ? "text-[12px]" : "text-[15px]"
                  } ${
                    link.links?.some((item) => pathname === item.link)
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  {link?.label}
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
        className={`px-3 py-2 rounded-sm ${
          smallerTextFlag ? "text-[12px]" : "text-[15px]"
        }  hover:text-gray-500 ${
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

      {!isMobile && <AddressBar />}

      <header className="sticky top-0 z-50 bg-white border-b border-gray-300">
        {/* Search Overlay for Desktop */}
        {searchOpen && !isMobile && (
          <div className="absolute top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center gap-4 mb-4">
                <FilterButtons />
                <div className="ml-auto">
                  <Button
                    variant="subtle"
                    size="sm"
                    leftSection={<IconX size={16} />}
                    onClick={handleCloseSearch}
                    color="gray"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Autocomplete
                  size="lg"
                  ref={searchInputRef}
                  clearable
                  leftSection={<IconSearch size={20} />}
                  data={searchResults}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  renderOption={renderSearchOption}
                  onOptionSubmit={(val) => {
                    const selectedItem = searchResults.find(
                      (item) => item.label.toLowerCase() === val.toLowerCase()
                    );
                    if (selectedItem) handleSearchRedirect(selectedItem);
                  }}
                  placeholder={getPlaceholder()}
                  className="w-full"
                  dropdownOpened={searchResults.length > 0 || loading}
                  styles={{
                    input: {
                      fontSize: "16px",
                      padding: "12px 16px 12px 48px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                    },
                    dropdown: {
                      maxHeight: "400px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      marginTop: "4px",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <nav className="h-[85px] flex items-center">
          {isMobile ? (
            searchOpen ? (
              <div className="w-full px-4 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <IconArrowLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={handleCloseSearch}
                  />
                  <FilterButtons className="flex-grow" />
                </div>
                <Autocomplete
                  size="md"
                  ref={searchInputRef}
                  clearable
                  leftSection={<IconSearch size={18} />}
                  data={searchResults}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  renderOption={renderSearchOption}
                  // loading={loading}
                  // nothingFound={loading ? <Loader size="sm" /> : "No results"}
                  onOptionSubmit={(val) => {
                    const selectedItem = searchResults.find(
                      (item) => item.value.toLowerCase() === val.toLowerCase()
                    );
                    if (selectedItem) handleSearchRedirect(selectedItem);
                  }}
                  placeholder={getPlaceholder()}
                  className="w-full"
                  dropdownOpened={searchResults.length > 0 || loading}
                  styles={{
                    input: {
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    },
                    dropdown: {
                      maxHeight: "300px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between h-full w-full px-6">
                <Burger opened={opened} onClick={toggle} size="sm" />

                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Image
                    className="cursor-pointer"
                    onClick={() => router.push("/")}
                    src="/assets/logo2.png"
                    alt="logo"
                    h={50}
                    w={100}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <IconSearch
                    className="hover:cursor-pointer text-gray-700 hover:text-gray-900"
                    size="22"
                    onClick={() => setSearchOpen(true)}
                  />

                  <div className="relative">
                    <IconShoppingBag
                      onClick={() => router.push("/cart")}
                      className="hover:cursor-pointer text-gray-700 hover:text-gray-900"
                      size="22"
                    />
                    {cartCount > 0 && (
                      <div className="absolute -top-2 -right-2">
                        <span className="bg-[#0b182d] text-white rounded-full text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <Grid className="h-full items-center w-full px-6 mt-5">
              <GridCol
                span={{ base: 12, md: 2 }}
                className="flex justify-start"
              >
                <Image
                  className="cursor-pointer"
                  onClick={() => router.push("/")}
                  src="/assets/logo2.png"
                  alt="logo"
                  h={50}
                  w={100}
                />
              </GridCol>

              <GridCol
                span={{ base: 12, md: 8 }}
                className="flex justify-center"
              >
                <div
                  className={`${
                    smallerTextFlag ? "" : "uppercase"
                  } flex justify-center items-center gap-2`}
                >
                  {items}
                </div>
              </GridCol>

              <GridCol
                span={{ base: 12, md: 2 }}
                className="flex items-center justify-end gap-4"
              >
                {user ? (
                  <UserProfile isSmaller={isSmaller} user={user} />
                ) : (
                  <IconUser
                    className="cursor-pointer text-gray-700 hover:text-gray-900"
                    onClick={open}
                    size="20"
                  />
                )}

                <div className="w-px h-6 bg-gray-300" />

                <IconSearch
                  className="hover:cursor-pointer text-gray-700 hover:text-gray-900"
                  size="20"
                  onClick={() => setSearchOpen(true)}
                />

                <div className="relative">
                  <IconShoppingBag
                    onClick={() => router.push("/cart")}
                    className="hover:cursor-pointer text-gray-700 hover:text-gray-900"
                    size="20"
                  />
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-[#0b182d] text-white rounded-full text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    </div>
                  )}
                </div>
              </GridCol>
            </Grid>
          )}
        </nav>

        <DrawerComponent
          cartCount={cartCount}
          isMobile={isMobile}
          isSmaller={isSmaller}
          opened={opened}
          toggle={toggle}
          user={user}
        />
      </header>
    </>
  );
}
