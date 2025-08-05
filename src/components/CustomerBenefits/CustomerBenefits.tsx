"use client";
import { Container, Grid, GridCol } from "@mantine/core";
import {
  IconBasketDollar,
  IconHeartHandshake,
  IconTruckDelivery,
  IconTruckReturn,
} from "@tabler/icons-react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedText } from "../CommonComponents/AnimatedText";

const AnimatedGridCol = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <GridCol span={{ base: 12, md: 3 }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        {children}
      </motion.div>
    </GridCol>
  );
};

export const CustomerBenefits = () => {
  const customerBenefits = [
    {
      title: "Free Shipping, Always",
      description:
        "Enjoy fast, complimentary shipping on every order—because exceptional service begins at your doorstep.",
      icon: <IconTruckDelivery size={50} color="#926f34" />,
    },
    {
      title: "Concierge-Level Support",
      description:
        "Our expert client care team is here to guide you every step of the way—personalized, attentive, and just a call or message away.",
      icon: <IconHeartHandshake size={50} color="#926f34" />,
    },
    {
      title: "Shop with Confidence",
      description:
        "We stand behind every piece with a 15-Day Hassle-Free Return Policy and a Lifetime Warranty—your satisfaction is our promise.",
      icon: <IconTruckReturn size={50} color="#926f34" />,
    },
    {
      title: "24/7 Support & Secure Checkout",
      description:
        "Get instant help over WhatsApp, iMessage, or email. All transactions are 100% secure via PayPal, credit, or debit card.",
      icon: <IconBasketDollar size={50} color="#926f34" />,
    },
  ];

  return (
    <Container size={1250} className="mt-10 pb-14">
      <AnimatedText
        text="Why Shop With Us"
        className="text-center text-4xl text-[#0b182d] mb-8"
      />

      <Grid>
        {customerBenefits.map((item, index) => (
          <AnimatedGridCol key={index} index={index}>
            <div className="h-[300px] flex justify-center flex-col items-center px-6 bg-[#ededed] rounded-lg shadow-sm">
              {item.icon}
              <h1 className="text-xl mt-2.5 font-semibold text-center">
                {item.title}
              </h1>
              <p className="text-center mt-3 text-[1rem] text-gray-600">
                {item.description}
              </p>
            </div>
          </AnimatedGridCol>
        ))}
      </Grid>
    </Container>
  );
};
