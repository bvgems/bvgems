"use client";

import { ContactUsForm } from "@/components/ContactUs/ContactUsForm";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Grid,
  GridCol,
  Select,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  TextInput,
} from "@mantine/core";
import {
  IconPhoneDone,
  IconPhoneRinging,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";
import { DatePicker } from "@mantine/dates";
import { bookAppointment } from "@/apis/api";
import { useAuth } from "@/hooks/useAuth";
import { notifications } from "@mantine/notifications";

export default function ContactUsPage() {
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Guest fields if !user
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const { user } = useAuth();

  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Contact Us" },
  ].map((item, index) => (
    <Anchor
      size="sm"
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Please select both date and time for your appointment.",
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (
      !user &&
      (!guestFirstName || !guestLastName || !guestEmail || !guestPhone)
    ) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Please fill in all required contact details.",
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      const dateObj =
        selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date selected");

      const payload = {
        date: dateObj.toISOString().split("T")[0],
        time: selectedTime,
        reason: reason.trim() || "N/A",
      };

      const bookingUser = user || {
        firstName: guestFirstName,
        lastName: guestLastName,
        email: guestEmail,
        phoneNumber: guestPhone,
      };

      const response = await bookAppointment(bookingUser, payload);

      if (response?.flag) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: response?.message,
          position: "top-right",
          autoClose: 4000,
        });

        // Reset form
        setSelectedDate(null);
        setSelectedTime(null);
        setReason("");
        setGuestFirstName("");
        setGuestLastName("");
        setGuestEmail("");
        setGuestPhone("");
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: response?.error || "Failed to book appointment",
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "An error occurred while booking the appointment.",
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Breadcrumbs separator="›" className="mb-6">
        {breadcrumbItems}
      </Breadcrumbs>

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
        {/* Contact Options */}
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
                <ThemeIcon variant="gradient" size="lg" radius="xl">
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
              href="mailto:sales@bvgems.com"
              className="cursor-pointer h-full flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col justify-center items-center text-center flex-grow">
                <ThemeIcon variant="gradient" size="lg" radius="xl">
                  <IconMail size="1.5rem" />
                </ThemeIcon>
                <Text fw={500} size="lg" mt="md">
                  Email Us
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  Send us an email with any questions or inquiries you may have.
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                  <span className="font-black">sales@bvgems.com</span>
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
                <ThemeIcon variant="gradient" size="lg" radius="xl">
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

        {/* Contact Form + Booking */}
        <Grid gutter="xl" className="mt-12" id="contact-section">
          <GridCol span={{ base: 12, md: 6 }}>
            <ContactUsForm />
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-5">
                <IconCalendar color="#0b182d" size="1.5rem" />
                <span className="mt-1">Schedule an Appointment</span>
              </div>
              <Text size="sm" mb="sm" c="dimmed">
                Select a date and time for your appointment.
              </Text>

              <DatePicker
                type="default"
                value={selectedDate}
                onChange={(value) => setSelectedDate(value)}
                weekendDays={[0]}
                minDate={new Date()}
                className="mb-4"
              />

              <Select
                label="Select a Time Slot"
                placeholder="Choose time"
                data={timeSlots}
                value={selectedTime}
                onChange={setSelectedTime}
                disabled={!selectedDate}
                className="mb-4"
              />

              {/* Guest fields if no user */}
              {!user && (
                <div className="mb-4">
                  <TextInput
                    label="First Name"
                    value={guestFirstName}
                    onChange={(e) => setGuestFirstName(e.currentTarget.value)}
                    required
                  />
                  <TextInput
                    label="Last Name"
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.currentTarget.value)}
                    required
                    className="mt-2"
                  />
                  <TextInput
                    label="Email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.currentTarget.value)}
                    required
                    className="mt-2"
                  />
                  <TextInput
                    label="Phone Number"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.currentTarget.value)}
                    required
                    className="mt-2"
                  />
                </div>
              )}

              <Textarea
                label="Reason for Appointment"
                placeholder="Briefly describe the purpose of your visit"
                value={reason}
                onChange={(event) => setReason(event.currentTarget.value)}
                autosize
                minRows={2}
                className="mb-4"
              />

              <Button
                loading={loading}
                color="#0b182d"
                fullWidth
                onClick={handleBookingSubmit}
              >
                BOOK APPOINTMENT
              </Button>
            </div>
          </GridCol>
        </Grid>

        {/* FAQ */}
        <Grid gutter="xl" className="mt-12">
          <GridCol className="flex flex-col mt-5" span={{ base: 12, md: 8 }}>
            <span className="text-[#0b182d] font-bold">FAQ</span>
            <div className="mt-3">
              Need a quick answer? Check out our{" "}
              <strong className="text-[#0b182d] underline">
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
