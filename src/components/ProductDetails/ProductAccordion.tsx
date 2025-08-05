import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  List,
  ListItem,
  Text,
} from "@mantine/core";
import {
  IconCreditCardPay,
  IconQuestionMark,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { PaymentOptions } from "../CommonComponents/PaymentOptions";

export const ProductAccordion = () => {
  return (
    <Accordion variant="contained">
      <AccordionItem value="photos">
        <AccordionControl
          icon={
            <IconTruckDelivery size={20} color="var(--mantine-color-red-6)" />
          }
        >
          <Text fw={510}>Shipping And Return</Text>
        </AccordionControl>
        <AccordionPanel>
          <List
            spacing="xs"
            size="sm"
            listStyleType="disc"
            withPadding
            styles={{ itemWrapper: { paddingLeft: "0.5rem" } }}
          >
            <ListItem>Free Shipping With FedEx</ListItem>

            <ListItem>All Packages Require Signature.</ListItem>
            <ListItem>
              The Package Can Be Returned Within 10 Business Days
            </ListItem>
          </List>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="print">
        <AccordionControl
          icon={
            <IconCreditCardPay size={20} color="var(--mantine-color-blue-6)" />
          }
        >
          <Text fw={510}>Payments Accepted</Text>
        </AccordionControl>
        <AccordionPanel>
          <div className="pl-6">
            <PaymentOptions />
          </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
