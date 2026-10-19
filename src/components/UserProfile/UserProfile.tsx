import {
  Avatar,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBasketCheck,
  IconChevronDown,
  IconLogout,
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
          className={cx(
            "flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97] transition-all duration-150 cursor-pointer",
            { "bg-gray-100 border-gray-300": userMenuOpened }
          )}
          aria-label="User profile menu"
        >
          <Avatar
            name={`${user?.firstName || ""} ${user?.lastName || ""}`}
            color="#0b182d"
            size={28}
            radius="xl"
            className="text-[12px] font-semibold"
          />
          {user?.firstName && !isSmaller && (
            <span className="text-xs font-medium text-gray-800 max-w-[90px] truncate">
              {user.firstName}
            </span>
          )}
          <IconChevronDown size={13} stroke={2} className="text-gray-500" />
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
        <MenuItem
          onClick={() => {
            router.push("/my-orders");
          }}
          leftSection={<IconBasketCheck size={16} stroke={1.5} />}
        >
          My Orders
        </MenuItem>
        {user?.email &&
          [
            "sales@bvgems.com",
            "meet.vikartr@gmail.com",
            "shrey@gmail.com",
          ].includes(user.email) && (
            <MenuItem
              onClick={() => {
                router.push("/admin/accounts");
              }}
              leftSection={<IconUser size={16} stroke={1.5} />}
            >
              Admin Accounts
            </MenuItem>
          )}
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
