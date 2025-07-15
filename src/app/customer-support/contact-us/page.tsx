import { ContactUsForm } from "@/components/ContactUs/ContactUsForm";
import {
  Button,
  Card,
  Container,
  Grid,
  GridCol,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableTr,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconPhoneDone,
  IconPhoneRinging,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function ContactUsPage() {
  return (
    <Container size="xl">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <ThemeIcon
            variant="gradient"
            size="md"
            gradient={{ from: "black", to: "#0b182d" }}
          >
            <IconPhoneDone size="1.5rem" />
          </ThemeIcon>
          <Title order={1} className="text-center" mb="xs">
            <span className="text-[1.7rem] text-[#0b182d]">Contact Us</span>
          </Title>
        </div>
        <div className="flex justify-center items-center text-center">
          If you have any questions or need help, please feel free to reach out
          to us! You can contact us by phone, email, or visit us at either of
          our two locations.
        </div>
      </div>

      <Card className="mt-5" radius="md" withBorder p="xl">
        <Grid>
          <GridCol span={{ base: 12, md: 4 }}>
            <Card
              shadow="sm"
              padding="xl"
              component="a"
              href="tel:+12129444382"
              className="cursor-pointer h-full flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col justify-center items-center text-center flex-grow">
                <ThemeIcon
                  variant="gradient"
                  size="lg"
                  radius="xl"
                  className="transition-transform hover:rotate-6 hover:scale-110"
                >
                  <IconPhoneRinging size="1.5rem" />
                </ThemeIcon>
                <Text fw={500} size="lg" mt="md">
                  Call Us
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  We are ready to answer any questions you may have about our
                  products.
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  <span className="font-black">+1 (212) 944-4382</span>
                </Text>
              </div>
            </Card>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <Card
              shadow="sm"
              padding="xl"
              component="a"
              href="mailto:bvgemsinc@gmail.com"
              className="cursor-pointer h-full flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col justify-center items-center text-center flex-grow">
                <ThemeIcon
                  variant="gradient"
                  size="lg"
                  radius="xl"
                  className="transition-transform hover:rotate-6 hover:scale-110"
                >
                  <IconMail size="1.5rem" />
                </ThemeIcon>
                <Text fw={500} size="lg" mt="md">
                  Email Us
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  Send us an email with any questions or inquiries you may have.
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  <span className="font-black">bvgemsinc@gmail.com</span>
                </Text>
              </div>
            </Card>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <Card
              shadow="sm"
              padding="xl"
              component="a"
              href="https://www.google.com/maps/place/66+W+47th+St,+New+York,+NY+10036"
              target="_blank"
              className="cursor-pointer h-full flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col justify-center items-center text-center flex-grow">
                <ThemeIcon
                  variant="gradient"
                  size="lg"
                  radius="xl"
                  className="transition-transform hover:rotate-6 hover:scale-110"
                >
                  <IconMapPin size="1.5rem" />
                </ThemeIcon>
                <Text fw={500} size="lg" mt="md">
                  Visit Us
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  Stop by our booths and experience our products in person.
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  <span className="font-black">
                    66 W 47th St, Booth #9 and #10
                    <br />
                    New York, NY 10036
                  </span>
                </Text>
              </div>
            </Card>
          </GridCol>
        </Grid>
        <div className="mt-8">
          <ContactUsForm />
        </div>
        <Grid gutter="xl" className="mt-12">
          <GridCol span={{ base: 12, md: 6 }}>
            <span className="text-[#0b182d] font-semibold">
              Our Business Hours
            </span>
            <Table
              className="mt-2.5"
              variant="vertical"
              layout="fixed"
              striped
              stripedColor=""
            >
              <TableTbody>
                <TableTr>
                  <TableTh>
                    <span className="font-semibold">Mon - Fri</span>
                  </TableTh>
                  <TableTd>
                    <span className=" font-medium">9:00 AM - 7:00 PM</span>
                  </TableTd>
                </TableTr>

                <TableTr>
                  <TableTh>
                    {" "}
                    <span className="font-semibold">Saturday</span>
                  </TableTh>
                  <TableTd>By Appointment Only</TableTd>
                </TableTr>
                <TableTr>
                  <TableTh>
                    {" "}
                    <span className="font-semibold">Sunday</span>
                  </TableTh>
                  <TableTd>
                    <span className="font-medium">Closed</span>
                  </TableTd>
                </TableTr>
              </TableTbody>
            </Table>
          </GridCol>

          <GridCol className="flex flex-col" span={{ base: 12, md: 6 }}>
            <span className="text-[#0b182d] font-bold">FAQ</span>
            <div className="mt-3">
              Need a quick answer? Check out our{" "}
              <strong className="text-[#0b182d] underline">
                {" "}
                <Link href="/customer-support/faqs">
                  Frequently Asked Questions
                </Link>
              </strong>{" "}
              for clear and helpful information on the most common queries our
              customers ask.
            </div>
          </GridCol>
        </Grid>
      </Card>
    </Container>
  );
}
