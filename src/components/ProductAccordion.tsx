import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Image,
  List,
  ListItem,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconCreditCardPay,
  IconQuestionMark,
  IconRewindBackward10,
  IconSignature,
  IconTruckDelivery,
} from "@tabler/icons-react";
import React from "react";

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
          <Text fw={510}>Payment Accepted</Text>
        </AccordionControl>
        <AccordionPanel>
          {" "}
          <List
            spacing="xs"
            size="sm"
            listStyleType="disc"
            withPadding
            styles={{ itemWrapper: { paddingLeft: "0.5rem" } }}
          >
            <ListItem>
              <div>Credit / Debit Card</div>
              <div className="text-xs text-gray-400">
                (Visa, Mastercard, Discover, American Express)
              </div>
            </ListItem>

            <ListItem>Paypal Checkout</ListItem>
            <ListItem>Apple Pay</ListItem>
            <ListItem>Wire Transfer</ListItem>
          </List>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="camera">
        <AccordionControl
          icon={
            <IconQuestionMark size={20} color="var(--mantine-color-teal-6)" />
          }
        >
          <Text fw={510}>FAQs</Text>
        </AccordionControl>
        <AccordionPanel>Content</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
