import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { IconLogin, IconUsersPlus } from "@tabler/icons-react";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const AuthForm = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<string | null>("signIn");

  return (
    <div>
      <Tabs color="#0b182d" value={activeTab} onChange={setActiveTab}>
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

        {/* Sign In */}
        <TabsPanel value="signIn">
          <SigninForm
            onClose={onClose}
            goToSignup={() => setActiveTab("signUp")}
            goToForgot={() => setActiveTab("forgotPassword")}
          />
        </TabsPanel>

        {/* Sign Up */}
        <TabsPanel value="signUp">
          <SignupForm
            onClose={onClose}
            isStepper={false}
            goToSignin={() => setActiveTab("signIn")}
          />
        </TabsPanel>

        {/* Forgot Password (hidden in TabsList) */}
        <TabsPanel value="forgotPassword">
          <ForgotPasswordForm
            onClose={onClose}
            goToSignin={() => setActiveTab("signIn")}
          />
        </TabsPanel>
      </Tabs>
    </div>
  );
};
