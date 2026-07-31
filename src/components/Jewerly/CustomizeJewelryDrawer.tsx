import { getShapesData, sendCustomJewelryRequest } from "@/apis/api";
import { useAuth } from "@/hooks/useAuth";
import {
  gemstoneOptionsForCustomization,
  GOLD_COLORS,
} from "@/utils/constants";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Image,
  Text,
  Autocomplete,
  Button,
  Loader,
  TextInput,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CustomizeJewelryDrawer = ({
  type,
  productData,
  close,
  value,
  setValue,
}: any) => {
  const [fullUrl, setFullUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedGemstone, setSelectedGemstone] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedGoldColor, setSelectedGoldColor] = useState<string | null>(
    null
  );
  const [sizeSwitch, setSizeSwitch] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, []);

  const form = useForm({
    initialValues: { email: "" },
    validateInputOnChange: true,
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  const submitRequest = async () => {
    const variables: any = {
      selectedGemstone,
      selectedGoldColor,
      size: value,
    };
    setLoading(true);

    try {
      const sentEmail = user ? user?.email : form?.values?.email;
      const response = await sendCustomJewelryRequest(
        sentEmail,
        variables,
        fullUrl
      );

      setModalMessage(response?.message || "Request submitted successfully!");
      setModalOpen(true);
    } catch (err) {
      setModalMessage("Something went wrong. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = () => {
    if (!selectedGemstone || !selectedGoldColor) return true;
    if (loading) return true;
    if (!user && (!form.values.email || form.errors.email)) return true;
    return false;
  };

  return (
    <>
      {/* Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Request Status"
        centered
      >
        <Text size="sm" mb="md">
          {modalMessage}
        </Text>
        <Button fullWidth onClick={() => setModalOpen(false)} color="#0b182d">
          Ok
        </Button>
      </Modal>

      <Text size="sm" mb="md">
        With B.V. Gems, you can now customize every product — choose your
        gemstone, and metal color for this design.
      </Text>

      <span
        onClick={() => {
          router?.push("/custom-jewelry");
        }}
        className="text-violet-800 underline cursor-pointer text-sm"
      >
        Want To Make Whole Customized {type}?
      </span>

      <Accordion multiple defaultValue={["gemstone", "shape", "goldColor"]}>
        {/* Gemstones Grid */}
        <AccordionItem className="mt-2" value="gemstone">
          <AccordionControl>Gemstone</AccordionControl>
          <AccordionPanel>
            <div className="grid grid-cols-4 gap-6">
              {gemstoneOptionsForCustomization.map(
                (item: any, index: number) => {
                  const isSelected = selectedGemstone === item.value;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedGemstone(item.value)}
                      className={`cursor-pointer flex flex-col items-center text-center ${
                        isSelected ? "border rounded-md p-2" : ""
                      }`}
                    >
                      <Image loading="lazy" src={item?.image} h={36} w={36} fit="contain" />
                      <span className="text-xs mt-1">{item?.label}</span>
                    </div>
                  );
                }
              )}
            </div>
          </AccordionPanel>
        </AccordionItem>

        {/* Gold Colors */}
        <AccordionItem className="mt-2" value="goldColor">
          <AccordionControl>Gold Color</AccordionControl>
          <AccordionPanel>
            <div className="grid grid-cols-4 gap-6">
              {GOLD_COLORS?.map((item: any, index: number) => {
                const isSelected = selectedGoldColor === item.value;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedGoldColor(item.value)}
                    className={`cursor-pointer flex flex-col items-center text-center ${
                      isSelected ? "border rounded-md p-2" : ""
                    }`}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: item.hex,
                      }}
                    />
                    <span className="text-xs mt-1">{item?.label}</span>
                  </div>
                );
              })}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* Submit Request */}
      <div className="mb-10 mt-6">
        {!user && (
          <TextInput
            withAsterisk
            className="mt-3"
            label="Enter Email Address"
            placeholder="your email address"
            {...form.getInputProps("email")}
          />
        )}

        <Button
          size="md"
          radius={0}
          disabled={isDisabled()}
          color="#0b182d"
          mt={"lg"}
          fullWidth
          onClick={submitRequest}
          rightSection={<IconArrowRight />}
        >
          {loading ? <Loader size="xs" color="white" /> : "Submit Request"}
        </Button>
      </div>
    </>
  );
};
