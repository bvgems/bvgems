"use client";

import { useAuth } from "@/hooks/useAuth";
import { links, mobileLinks } from "@/utils/constants";
import {
  Accordion,
  Button,
  Divider,
  Drawer,
  Image,
  Modal,
} from "@mantine/core";
import { IconChevronDown, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import { UserProfile } from "../UserProfile/UserProfile";
import { useDisclosure } from "@mantine/hooks";
import { AuthForm } from "../Auth/AuthForm";

export const DrawerComponent = ({
  cartCount,
  isMobile,
  isSmaller,
  opened,
  toggle,
  user,
}: any) => {
  const router = useRouter();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const { handleLogout } = useAuth();

  return (
    <>
      {/* Auth Modal */}
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      {/* Main Drawer */}
      <Drawer
        opened={opened}
        onClose={toggle}
        title={<Image loading="lazy" src="/assets/logo2.webp" h={60} w={150} />}
        padding="md"
        size="xs"
        position="left"
        zIndex={1000}
      >
        {/* Mobile Account Banner */}
        {!user ? (
          <div className="mb-4 mx-1 p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#0b182d] text-white flex items-center justify-center shrink-0">
                  <IconUser size={16} stroke={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 tracking-wide uppercase truncate">B.V. Gems</p>
                  <p className="text-[11px] text-gray-500 truncate">Log in for trade pricing</p>
                </div>
              </div>
              <Button
                size="xs"
                color="#0b182d"
                radius="xl"
                className="px-3.5 text-[11px] font-semibold tracking-wider uppercase active:scale-95 transition-transform shrink-0"
                onClick={() => {
                  toggle();
                  open();
                }}
              >
                LOG IN
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-4 mx-1 p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#0b182d] text-white flex items-center justify-center font-semibold text-xs shrink-0">
                {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "BV"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <Accordion
          variant="transparent"
          multiple={false}
          className="w-full"
          styles={{
            control: { paddingLeft: 12, fontWeight: 500, fontSize: 16 },
          }}
        >
          {(() => {
            const baseMobileLinks = [...mobileLinks];
            return baseMobileLinks.map((link: any) => {
              const hasSublinks =
                Array.isArray(link.links) && link.links.length > 0;

            return (
              <Accordion.Item key={link.label} value={link.label}>
                <Accordion.Control
                  chevron={hasSublinks ? undefined : null}
                  onClick={() => {
                    if (!hasSublinks && link.link) {
                      toggle();
                      router.push(link.link);
                    }
                  }}
                >
                  {link.label}
                </Accordion.Control>

                {hasSublinks && (
                  <Accordion.Panel>
                    <div className="flex flex-col gap-4">
                      {link.links.map((sublink: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            toggle();
                            router.push(sublink.link);
                          }}
                        >
                          {sublink.image && (
                            <Image loading="lazy" src={sublink.image} h={30} w={30} />
                          )}
                          <h2 className="text-sm font-normal">
                            {sublink.label}
                          </h2>
                        </div>
                      ))}

                      {link.label === "Calibrated Stones" && (
                        <div
                          onClick={() => {
                            toggle();
                            router.push("/calibrated-stones");
                          }}
                          className="text-[#0b182d] underline gap-1 hover:text-blue-800 flex items-center"
                        >
                          <span className="underline">View All</span>
                          <IconChevronDown
                            style={{ transform: "rotate(-90deg)" }}
                            size={16}
                            stroke={2}
                          />
                        </div>
                      )}

                      {link.label === "Free Size" && (
                        <div className="flex flex-col gap-3 mt-2 border-t pt-4 border-gray-100">
                          <Button
                            onClick={() => {
                              toggle();
                              router.push("/free-size-gemstones");
                            }}
                            fullWidth
                            variant="outline"
                            color="#0b182d"
                            size="sm"
                          >
                            VIEW ALL
                          </Button>
                          <Button
                            onClick={() => {
                              toggle();
                              router.push("/special-page");
                            }}
                            fullWidth
                            variant="outline"
                            color="#0b182d"
                            size="sm"
                            styles={{ root: { padding: '0 8px' } }}
                          >
                            <span className="text-[13px] tracking-tight">FIND YOUR PERFECT STONE</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Accordion.Panel>
                )}
              </Accordion.Item>
            );
          })})()}
        </Accordion>
        {user && (
          <div className="mt-4">
            <Divider />

            <div
              onClick={() => {
                toggle();
                router.push("/profile");
              }}
              className="mt-4 pl-2.5 cursor-pointer"
            >
              Profile
            </div>
            <div
              onClick={() => {
                toggle();
                router.push("/my-orders");
              }}
              className="mt-4 pl-2.5 cursor-pointer"
            >
              My Orders
            </div>
            {user ? (
              <Button
                color="#0b182d"
                onClick={handleLogout}
                fullWidth
                className="mt-5"
                variant="outline"
              >
                SIGN OUT
              </Button>
            ) : null}
          </div>
        )}

        {isMobile || isSmaller ? (
          <div className="mt-5">
            {!user ? (
              <Button
                color="#0b182d"
                variant="outline"
                fullWidth
                className="pl-2.5 cursor-pointer"
                onClick={() => {
                  toggle();
                  open();
                }}
              >
                SIGN IN / SIGN UP
              </Button>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </>
  );
};
