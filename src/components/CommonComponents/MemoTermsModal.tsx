import { sendMemoRequestEmail } from "@/apis/api";
import { useAuth } from "@/hooks/useAuth";
import { Button, Modal, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

interface MemoTermsModalProps {
  cartItems: any[];
  opened: boolean;
  close: () => void;
}

export const MemoTermsModal = ({
  cartItems,
  opened,
  close,
}: MemoTermsModalProps) => {
  const { user } = useAuth();

  const sendMemoRequest = async () => {
    const response = await sendMemoRequestEmail(user, cartItems);
    if (response?.flag) {
      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: response?.message,
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: response?.message,
        position: "top-right",
        autoClose: 4000,
      });
    }
    close();
  };

  const renderActionButton = () => {
    if (!user) {
      return (
        <Tooltip
          label="Please sign in to send request"
          withArrow
          position="top"
        >
          <div>
            <Button color="dark" disabled>
              REQUEST MEMO APPROVAL
            </Button>
          </div>
        </Tooltip>
      );
    }

    if (user?.isMemoPurchaseApproved) {
      return (
        <Tooltip
          label="Your account has already been approved for memo purchases. You can proceed directly to checkout with memo."
          withArrow
          position="top"
        >
          <div>
            <Button color="dark" disabled>
              REQUEST MEMO APPROVAL
            </Button>
          </div>
        </Tooltip>
      );
    }

    return (
      <Button onClick={sendMemoRequest} color="dark">
        REQUEST MEMO APPROVAL
      </Button>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton
      centered
      size="md"
      overlayProps={{
        blur: 4,
        backgroundOpacity: 0.5,
      }}
      transitionProps={{ transition: "slide-up", duration: 300 }}
      radius="lg"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#0b182d]">
          Memo Purchase Terms & Conditions
        </h2>
        <ul className="list-disc space-y-4 pl-5 text-sm text-gray-700">
          <li>
            <strong>Account Required:</strong> Memo purchases are available only
            to registered customers. Please ensure you're logged into your
            account to proceed.
          </li>
          <li>
            <strong>Account Approval:</strong> To enable memo purchases, your
            account must be approved. You can request approval by clicking the
            button below. Before submitting your request, please make sure to
            provide at least <strong>three valid business references</strong> in
            your profile section to help expedite the approval process.
          </li>
          <li>
            <strong>Product Restrictions:</strong> Please note that jewelry
            items are not eligible for memo purchases. Only gemstone products
            can be purchased on memo.
          </li>
        </ul>

        <div className="mt-6 flex justify-end">{renderActionButton()}</div>
      </div>
    </Modal>
  );
};
