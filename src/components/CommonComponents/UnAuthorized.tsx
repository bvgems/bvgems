import { Button, Modal } from "@mantine/core";
import React from "react";
import dynamic from "next/dynamic";

import { useDisclosure } from "@mantine/hooks";
import { AuthForm } from "../Auth/AuthForm";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);

export const UnAuthorized = () => {
  const [modalOpened, { open, close }] = useDisclosure(false);

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

      <div className="flex flex-col gap-3 items-center justify-center mt-24">
        <LottiePlayer
          autoplay
          loop
          src="/assets/unauthorised.json"
          style={{ height: "300px", width: "300px" }}
        />
        <p className="text-xl font-semibold mt-4 text-violet-800">
          You are not authorized to access this page.
        </p>
        <Button onClick={open} color="violet">
          Log In Now
        </Button>
      </div>
    </>
  );
};
