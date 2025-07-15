"use client";
import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Title,
  Container,
  Modal,
} from "@mantine/core";
import { useUserStore } from "@/store/useUserStore";
import { editProfile } from "@/apis/api";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const ProfileInfo = ({ userData }: any) => {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    phoneNumber: "",
  });

  const [initialData, setInitialData] = useState(formData);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setInitialData(userData);
      setFormData(userData);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const editProfileResponse = await editProfile(formData);

      if (editProfileResponse?.flag) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: editProfileResponse?.message,
          position: "top-right",
          autoClose: 4000,
        });

        const updatedUserData = {
          id: editProfileResponse.user.id || "",
          firstName: editProfileResponse.user.firstName || "",
          lastName: editProfileResponse.user.lastName || "",
          email: editProfileResponse.user.email || "",
          companyName: editProfileResponse.user.companyName || "",
          phoneNumber: editProfileResponse.user.phoneNumber || "",
        };

        setFormData(updatedUserData);
        setInitialData(updatedUserData);
        setUser(editProfileResponse.user);
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: editProfileResponse?.error,
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "An error occurred while updating profile",
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <Container size={"xl"}>
      <Title order={3} mb="md">
        Edit Profile
      </Title>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-9">
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.currentTarget.value)}
            mb="sm"
            className="w-full"
            disabled={isLoading}
          />
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.currentTarget.value)}
            mb="sm"
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <TextInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.currentTarget.value)}
          mb="sm"
          disabled
        />
        <TextInput
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.currentTarget.value)}
          mb="md"
          disabled={isLoading}
        />
        <TextInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.currentTarget.value)}
          mb="md"
          disabled={isLoading}
          leftSection={
            <span style={{ fontSize: "1.25rem", marginRight: "6px" }}>🇺🇸</span>
          }
        />

        <div className="flex items-end gap-3">
          <div className="w-5/6">
            <TextInput label="Password" value="********" disabled />
          </div>
          <div className="w-1/6">
            <Button onClick={open} color="red" variant="light" fullWidth>
              Change Password
            </Button>
          </div>
        </div>

        <Group>
          <Button
            className="mt-5"
            color="#0b182d"
            onClick={handleSubmit}
            disabled={!isFormChanged || isLoading}
            loading={isLoading}
          >
            SAVE CHANGES
          </Button>
        </Group>
      </div>
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
        <ChangePasswordForm onClose={close} />
      </Modal>
    </Container>
  );
};
