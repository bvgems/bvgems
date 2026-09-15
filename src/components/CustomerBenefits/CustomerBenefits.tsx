"use client";

import { Container, Grid, GridCol } from "@mantine/core";
import {
  IconBasketDollar,
  IconHeartHandshake,
  IconTruckDelivery,
  IconDiamond,
  IconCertificate,
  IconGlobe,
  IconBuildingBank,
  IconScale
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
      title: "Generational Expertise",
      description:
        "A fixture in NYC's Diamond District for over 75 years, supplying master jewelers and top brands across 50+ countries.",
      icon: <IconBuildingBank size={42} stroke={1.5} />,
    },
    {
      title: "Global Ethical Sourcing",
      description:
        "Direct relationships with mines worldwide to ensure every gemstone is conflict-free, responsible, and fully traceable.",
      icon: <IconGlobe size={42} stroke={1.5} />,
    },
    {
      title: "Precision Calibration",
      description:
        "Exact dimensions and uniform color grading for flawless setting. We manufacture in volume to guarantee consistency.",
      icon: <IconDiamond size={42} stroke={1.5} />,
    },
    {
      title: "Concierge Account Management",
      description:
        "Dedicated trade experts offering personalized memo programs, volume pricing, and priority sourcing for custom projects.",
      icon: <IconHeartHandshake size={42} stroke={1.5} />,
    },
    {
      title: "Guaranteed Authenticity",
      description:
        "Every gemstone can be certified by independent third-party labs (GIA, IGI) upon request, ensuring complete transparency.",
      icon: <IconCertificate size={42} stroke={1.5} />,
    },
    {
      title: "Unparalleled Wholesale Value",
      description:
        "By cutting out the middlemen and manufacturing in-house, we pass on exceptional value directly to our trade partners.",
      icon: <IconScale size={42} stroke={1.5} />,
    },
  ];

  return (
    <Container size={1350} className="mt-32 mb-20">
      <div className="text-center mb-16">
        <AnimatedText
          text="The B.V. Gems Advantage"
          className="text-4xl md:text-5xl uppercase tracking-widest text-[#0b182d] font-light mb-6"
        />
        <p className="text-lg text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
          Backed by 6 generations of expertise, we are the trusted direct source for precision-calibrated gemstones and custom layouts for jewelers worldwide.
        </p>
      </div>
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
                className="flex items-center justify-center w-16 h-16 mb-6 rounded-full 
                bg-[#0b182d] text-white group-hover:bg-[#d4af37] group-hover:scale-110
                transition-all duration-500 shadow-md"
              >
                {item.icon}
              </div>

              {/* Title */}
              <p className="text-xl font-light tracking-wider uppercase text-[#0b182d] mb-4">
                {item.title}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed font-light">
                {item.description}
              </p>
              
              {/* Decorative Accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#d4af37] group-hover:w-1/2 transition-all duration-500"></div>
            </div>
          </AnimatedGridCol>
        ))}
      </Grid>
    </Container>
  );
};
