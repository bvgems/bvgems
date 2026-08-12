"use client";

import { Button, Container, Grid, GridCol } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const BookAppointment = () => {
  const router = useRouter();
  return (
    <Container size={1350} className="py-6 bg-[#f9f9f9]">
      <Grid>
        <GridCol span={{ base: 12, md: 6 }}>
          <div className="relative w-full h-[500px]">
            <Image loading="lazy" fill src={"/assets/book-appointment.webp"} alt="Meet our gemstone experts and book an appointment" className="object-cover" />
          </div>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <div className="p-16 flex flex-col gap-4 mt-6">
            <h1 className="text-2xl font-semibold">
              Meet Our Gemstone Experts
            </h1>
            <p className="text-lg">
              Discover a more personal way to experience fine gemstones and
              jewelry. Work closely with our certified gemologists to design
              custom rings, earrings, pendants, bands, or bracelets—tailored
              just for you.
            </p>
            <Button
              onClick={() => {
                router?.push(
                  "/customer-support/contact-us#appointment-section"
                );
              }}
              className="mt-5"
              color="#0b182d"
              variant="outline"
            >
              BOOK APPOINTMENT NOW
            </Button>
          </div>
        </GridCol>
      </Grid>
    </Container>
  );
};
