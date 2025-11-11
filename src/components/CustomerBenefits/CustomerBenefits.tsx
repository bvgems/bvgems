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
        transition={{ duration: 0.7, delay: index * 0.15 }}
      >
        {children}
      </motion.div>
    </GridCol>
  );
};

export const CustomerBenefits = () => {
  const customerBenefits = [
    {
      title: "Free Shipping on Orders $200+",
      description:
        "Enjoy complimentary worldwide shipping on every order—because exceptional service begins at your doorstep.",
      icon: <IconTruckDelivery size={42} stroke={1.5} />,
    },
    {
      title: "Concierge-Level Support",
      description:
        "Our expert care team is here to guide you every step of the way—personalized, attentive, and just a call or message away.",
      icon: <IconHeartHandshake size={42} stroke={1.5} />,
    },
    {
      title: "Shop with Confidence",
      description:
        "We stand behind every piece with a 15-Day Hassle-Free Return Policy and a Lifetime Warranty—your satisfaction is our promise.",
      icon: <IconTruckReturn size={42} stroke={1.5} />,
    },
    {
      title: "Guaranteed Authenticity",
      description:
        "Every gemstone and jewelry piece can be certified by an independent third-party lab upon request—ensuring complete transparency and confidence.",
      icon: <IconCertificate size={42} stroke={1.5} />,
    },
    {
      title: "24/7 Support & Secure Checkout",
      description:
        "Get instant help over WhatsApp, iMessage, or email. All transactions are 100% secure via PayPal, credit, or debit card.",
      icon: <IconBasketDollar size={42} stroke={1.5} />,
    },
  ];

  return (
    <Container size={1350} className="mt-20 pb-20">
      <AnimatedText
        text="Why Shop With Us"
        className="text-center text-3xl sm:text-4xl text-[#0b182d] mb-12"
      />
      <Grid gutter="xl" justify="center">
        {customerBenefits.map((item, index) => (
          <AnimatedGridCol key={index} index={index}>
            <div
              className="relative h-[300px] flex flex-col justify-center items-center text-center px-7 
              bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 
              hover:-translate-y-2 group overflow-hidden"
            >
              {/* Icon container */}
              <div
                className="flex items-center justify-center w-16 h-16 mb-5 rounded-full 
                bg-[#f5f2ed] text-[#926f34] group-hover:bg-[#926f34] 
                group-hover:text-white transition-colors duration-300"
              >
                {item.icon}
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-[#0b182d] mb-3">
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          </AnimatedGridCol>
        ))}
      </Grid>
    </Container>
  );
};
