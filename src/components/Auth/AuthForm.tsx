import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { IconLogin, IconUsersPlus } from "@tabler/icons-react";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";

export const AuthForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div>
      {" "}
      <Tabs color="violet" defaultValue="signIn">
        <TabsList grow>
          <TabsTab
            className="flex justify-center"
            value="signIn"
            leftSection={<IconLogin size={15} />}
          >
            <span className="font-semibold">Sign In</span>
          </TabsTab>
          <TabsTab
            className="font-semibold flex justify-center"
            value="signUp"
            leftSection={<IconUsersPlus size={15} />}
          >
            <span className="font-semibold">Apply for an Account</span>
          </TabsTab>
        </TabsList>

        <TabsPanel value="signIn">
          <SigninForm onClose={onClose} />
        </TabsPanel>

        <TabsPanel value="signUp">
          <SignupForm onClose={onClose} isStepper={false} />
        </TabsPanel>
      </Tabs>
    </div>
  );
};
