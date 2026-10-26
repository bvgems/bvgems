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
import { IconChevronDown, IconChevronRight, IconUser } from "@tabler/icons-react";
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
        overlayProps={{ backgroundOpacity: 0.45, blur: 5 }}
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
            control: {
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 11,
              paddingBottom: 11,
              fontWeight: 600,
              fontSize: 15.5,
              borderRadius: 12,
            },
            panel: {
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
              paddingBottom: 6,
            },
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
                    <div className="flex flex-col gap-1 py-1">
                      {link.links.map((sublink: any, index: number) => {
                        const isCalibrated = link.label === "Calibrated Stones";
                        const gemScale = isCalibrated
                          ? sublink.value === "Alexandrite"
                            ? "scale-[2.4]"
                            : sublink.value === "Paraiba Tourmaline"
                            ? "scale-[2.05]"
                            : sublink.value === "Morganite" || sublink.value === "Peridot"
                            ? "scale-[2.12]"
                            : "scale-[2.2]"
                          : "scale-100";

                        return (
                          <div
                            key={index}
                            className="group flex items-center justify-between px-2.5 py-2 rounded-xl active:bg-slate-100 active:scale-[0.98] hover:bg-slate-50 cursor-pointer transition-all duration-150 ease-out select-none"
                            onClick={() => {
                              toggle();
                              router.push(sublink.link);
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {sublink.image && (
                                <div className="w-11 h-11 shrink-0 flex items-center justify-center overflow-hidden">
                                  <img
                                    loading="lazy"
                                    src={sublink.image}
                                    alt={sublink.label}
                                    className={`w-full h-full object-contain ${gemScale}`}
                                  />
                                </div>
                              )}
                              <span className="text-[14.5px] font-medium text-[#0b182d] tracking-tight truncate">
                                {sublink.label}
                              </span>
                            </div>

                            <IconChevronRight
                              size={15}
                              stroke={2}
                              className="text-gray-300 group-hover:text-gray-500 group-active:text-gray-700 transition-colors shrink-0 ml-2"
                            />
                          </div>
                        );
                      })}

                      {link.label === "Calibrated Stones" && (
                        <div className="pt-2.5 mt-1 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => {
                              toggle();
                              router.push("/calibrated-stones");
                            }}
                            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 active:scale-[0.98] text-[#0b182d] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer select-none"
                          >
                            <span>VIEW ALL CALIBRATED STONES</span>
                            <IconChevronRight size={14} stroke={2.5} />
                          </button>
                        </div>
                      )}

                      {link.label === "Free Size" && (
                        <div className="flex flex-col gap-2.5 mt-2 border-t pt-3 border-gray-100">
                          <Button
                            onClick={() => {
                              toggle();
                              router.push("/free-size-gemstones");
                            }}
                            fullWidth
                            variant="outline"
                            color="#0b182d"
                            size="sm"
                            className="rounded-xl active:scale-[0.98] transition-transform"
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
                            className="rounded-xl active:scale-[0.98] transition-transform"
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
              className="mt-3 px-2.5 py-2 rounded-xl active:bg-slate-100 active:scale-[0.98] hover:bg-slate-50 cursor-pointer font-medium text-[14.5px] text-[#0b182d] transition-all duration-150 ease-out select-none flex items-center justify-between"
            >
              <span>Profile</span>
              <IconChevronRight size={15} stroke={2} className="text-gray-300" />
            </div>
            <div
              onClick={() => {
                toggle();
                router.push("/profile?tab=recently-viewed");
              }}
              className="mt-1 px-2.5 py-2 rounded-xl active:bg-slate-100 active:scale-[0.98] hover:bg-slate-50 cursor-pointer font-medium text-[14.5px] text-[#0b182d] transition-all duration-150 ease-out select-none flex items-center justify-between"
            >
              <span>Recently Viewed</span>
              <IconChevronRight size={15} stroke={2} className="text-gray-300" />
            </div>
            <div
              onClick={() => {
                toggle();
                router.push("/my-orders");
              }}
              className="mt-1 px-2.5 py-2 rounded-xl active:bg-slate-100 active:scale-[0.98] hover:bg-slate-50 cursor-pointer font-medium text-[14.5px] text-[#0b182d] transition-all duration-150 ease-out select-none flex items-center justify-between"
            >
              <span>My Orders</span>
              <IconChevronRight size={15} stroke={2} className="text-gray-300" />
            </div>
            {user ? (
              <Button
                color="#0b182d"
                onClick={handleLogout}
                fullWidth
                className="mt-5 rounded-xl active:scale-[0.98] transition-transform"
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
