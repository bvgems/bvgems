import React from "react";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  List,
  ListItem,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQComponentProps {
  faqContent: FAQItem[];
}

export const FAQComponent: React.FC<FAQComponentProps> = ({ faqContent }) => {
  return (
    <Accordion
      chevron={<IconPlus color="#5d0ec0" size={16} />}
      chevronPosition="left"
      variant="default"
      multiple
      defaultValue={faqContent.map((_, index) => `item-${index}`)}
      transitionDuration={600}
    >
      {faqContent.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionControl>
            <span className="text-violet-800 font-bold">{item.question}</span>
          </AccordionControl>
          <AccordionPanel>
            <List withPadding>
              <ListItem className="pl-4">{item.answer}</ListItem>
            </List>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
