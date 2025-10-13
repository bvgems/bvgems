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
  IconBubbleText,
  IconCreditCardPay,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { PaymentOptions } from "../CommonComponents/PaymentOptions";

export const ProductAccordion = ({ description }: any) => {
  return (
    <Accordion variant="contained">
      <AccordionItem value="print">
        <AccordionControl
          icon={
            <IconBubbleText size={20} color="var(--mantine-color-blue-6)" />
          }
        >
          <Text fw={510}>Read More</Text>
        </AccordionControl>
        <AccordionPanel>
          <div className="pl-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="photos">
        <AccordionControl
          icon={
            <IconTruckDelivery size={20} color="var(--mantine-color-blue-6)" />
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
              All sales are final; however, we are happy to provide
              complimentary size adjustments as needed, though returns will not
              be accepted.
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
