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
import { IconChevronDown } from "@tabler/icons-react";
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
        title={<Image src="/assets/logo2.png" h={60} w={150} />}
        padding="md"
        size="xs"
        position="left"
        zIndex={1000}
      >
        <Accordion
          variant="transparent"
          multiple={false}
          className="w-full"
          styles={{
            control: { paddingLeft: 12, fontWeight: 500, fontSize: 16 },
          }}
        >
          {mobileLinks.map((link: any) => {
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
                            <Image src={sublink.image} h={30} w={30} />
                          )}
                          <h1 className="text-sm font-normal">
                            {sublink.label}
                          </h1>
                        </div>
                      ))}

                      {link.label === "Calibrated Gemstones" && (
                        <div
                          onClick={() => {
                            toggle();
                            router.push("/loose-gemstones");
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
                    </div>
                  </Accordion.Panel>
                )}
              </Accordion.Item>
            );
          })}
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
