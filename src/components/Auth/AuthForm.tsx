import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { IconLogin, IconUsersPlus } from "@tabler/icons-react";
import { SigninForm } from "./SigninForm";
import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Button } from "@mantine/core";

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
          <div className="flex flex-col items-center justify-center p-6 text-center mt-4">
            <h3 className="text-lg font-semibold mb-2 text-[#0b182d]">Join B.V. Gems</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Apply for a wholesale trade account to access exclusive pricing, calibrated layouts, and our memo program.
            </p>
            <Button
              component="a"
              href="/trade/apply"
              color="#0b182d"
              fullWidth
            >
              START APPLICATION
            </Button>
            <div className="mt-6 text-[#0b182d] text-sm">
              Already have an account?{" "}
              <span
                onClick={() => setActiveTab("signIn")}
                className="uppercase underline hover:text-gray-500 font-semibold cursor-pointer"
              >
                SIGN IN
              </span>
            </div>
          </div>
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
