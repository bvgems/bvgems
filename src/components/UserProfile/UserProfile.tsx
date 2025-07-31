import {
  Avatar,
  Group,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconDiamond,
  IconLogout,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import cx from "clsx";
import classes from "./HeaderTabs.module.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const UserProfile = ({ isSmaller, user }: any) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { handleLogout } = useAuth();
  const router = useRouter();

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group gap={isSmaller ? 2 : 5}>
            <Avatar
              name={`${user?.firstName} ${user?.lastName}`}
              color="#0b182d"
            />

            <IconChevronDown size={12} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <MenuDropdown>
        <MenuItem
          onClick={() => {
            router?.push("/profile");
          }}
          leftSection={<IconUser size={16} stroke={1.5} />}
        >
          My Profile
        </MenuItem>

        <Menu.Item
          onClick={() => {
            router?.push("/my-orders");
          }}
          leftSection={<IconDiamond size={16} stroke={1.5} />}
        >
          My Orders
        </Menu.Item>
        <MenuItem
          onClick={handleLogout}
          leftSection={<IconLogout size={16} stroke={1.5} />}
        >
          Sign Out
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};
