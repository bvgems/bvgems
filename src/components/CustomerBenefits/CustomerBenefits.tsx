"use client";

import { Container, Grid, GridCol } from "@mantine/core";
import {
  IconBasketDollar,
  IconHeartHandshake,
  IconTruckDelivery,
  IconTruckReturn,
  IconCertificate,
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
    <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
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
        "Enjoy complimentary worldwide shipping on every order—because exceptional service begins at your doorstep.",
      icon: <IconTruckDelivery size={48} stroke={1.5} />,
    },
    {
      title: "Concierge-Level Support",
      description:
        "Our expert care team is here to guide you every step of the way—personalized, attentive, and just a call or message away.",
      icon: <IconHeartHandshake size={48} stroke={1.5} />,
    },
    {
      title: "Shop with Confidence",
      description:
        "We stand behind every piece with a 15-Day Hassle-Free Return Policy and a Lifetime Warranty—your satisfaction is our promise.",
      icon: <IconTruckReturn size={48} stroke={1.5} />,
    },
    {
      title: "Guaranteed Authenticity",
      description:
        "Every gemstone and jewelry piece can be certified by an independent third-party lab upon request—ensuring complete transparency and confidence.",
      icon: <IconCertificate size={48} stroke={1.5} />,
    },
    {
      title: "24/7 Support & Secure Checkout",
      description:
        "Get instant help over WhatsApp, iMessage, or email. All transactions are 100% secure via PayPal, credit, or debit card.",
      icon: <IconBasketDollar size={48} stroke={1.5} />,
    },
  ];

  return (
    <Container size={1250} className="mt-14 pb-20">
      <AnimatedText
        text="Why Shop With Us"
        className="text-center text-4xl text-[#0b182d] mb-8"
      />
      <Grid gutter="xl" justify="center">
        {customerBenefits.map((item, index) => (
          <AnimatedGridCol key={index} index={index}>
            <div
              className="h-[320px] flex flex-col justify-center items-center text-center px-6 
              bg-gradient-to-br from-white to-[#f7f7f7] rounded-2xl shadow-md hover:shadow-lg 
              transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="mb-4 text-[#926f34] group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              <h1 className="text-xl font-semibold text-[#0b182d] mb-3">
                {item.title}
              </h1>

              <p className="text-gray-600 leading-relaxed text-[1rem]">
                {item.description}
              </p>
            </div>
          </AnimatedGridCol>
        ))}
      </Grid>
    </Container>
  );
};
