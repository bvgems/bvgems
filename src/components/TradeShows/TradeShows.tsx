"use client";

import {
  Card,
  Grid,
  GridCol,
  Button,
  Image,
  Text,
  Badge,
  Divider,
  Tooltip,
  Group,
} from "@mantine/core";
import { IconCalendarPlus, IconExternalLink } from "@tabler/icons-react";
import { AnimatedText } from "../CommonComponents/AnimatedText";

// ===== Types =====
export interface TradeShow {
  name: string;
  booth: string;
  website: string;
  logo: string;
  location: string;
  start: string; // supports "YYYY-MM-DD" or "MM-DD-YYYY"
  end: string; // supports "YYYY-MM-DD" or "MM-DD-YYYY"
  // optional: startTime/endTime like "09:00", "17:00" (24h)
  startTime?: string;
  endTime?: string;
}

// ===== Data =====
export const tradeShows: TradeShow[] = [
  {
    name: "JIS Miami",
    booth: "Booth #1339",
    website: "https://www.jisshow.com/fall/en-us.html",
    logo: "https://www.jisshow.com/content/dam/sitebuilder/rna/jis/2021/spring/JISFall.png/_jcr_content/renditions/original.image_file.592.300.file/367267082/JISFall.png",
    location: "Miami Beach Convention Center | Miami Beach, FL",
    start: "10-10-2025",
    end: "10-13-2025",
  },
  {
    name: "Tucson GJX",
    booth: "Booth #1234",
    website: "https://gjx.rocks",
    logo: "https://gjx.rocks/wp-content/themes/gjx-2020/images/logo.png",
    location: "198 S. Granada Tucson, AZ 85701",
    start: "02-02-2026",
    end: "02-07-2026",
  },
  {
    name: "Las Vegas AGTA",
    booth: "Booth #A-28057",
    website: "https://agta.org/trade-shows/agta-gemfair-las-vegas/",
    logo: "https://agta.org/wp-content/uploads/2024/08/AGTA-Horiz-Logo.svg",
    location: "Las Vegas, Nevada",
    start: "05-28-2026",
    end: "06-01-2026",
  },
];

// ===== Helpers =====

// Normalize "YYYY-MM-DD" or "MM-DD-YYYY" (and tolerate single-digit M/D)
function toDate(s: string): Date {
  const parts = s.split("-").map((p) => p.trim());
  if (parts.length !== 3) return new Date(s); // let Date try

  // If first part has 4 digits -> YYYY-MM-DD
  if (parts[0].length === 4) {
    const [y, m, d] = parts.map((x) => parseInt(x, 10));
    return new Date(Date.UTC(y, m - 1, d));
  }

  // Else assume MM-DD-YYYY
  const [m, d, y] = parts.map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, m - 1, d));
}

function fmtMonthDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
function fmtMonthDayYear(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDateRange(startStr: string, endStr: string) {
  const s = toDate(startStr);
  const e = toDate(endStr);

  if (s.getUTCFullYear() === e.getUTCFullYear()) {
    if (s.getUTCMonth() === e.getUTCMonth()) {
      // Same month+year — Oct 10–13, 2025
      return `${fmtMonthDay(s)}–${e.getUTCDate()}, ${s.getUTCFullYear()}`;
    }
    // Same year, different months — Oct 30 – Nov 2, 2025
    return `${fmtMonthDay(s)} – ${fmtMonthDayYear(e)}`;
  }
  // Different years — Dec 31, 2025 – Jan 2, 2026
  return `${fmtMonthDayYear(s)} – ${fmtMonthDayYear(e)}`;
}

function buildZDate(dateStr: string, timeHHmm?: string) {
  // Default to 09:00 and 17:00 UTC window if time not provided
  const time = timeHHmm ?? "09:00";
  const [hh, mm] = time.split(":").map((x) => parseInt(x, 10));
  const d = toDate(dateStr);
  d.setUTCHours(hh, mm, 0, 0);
  // Format YYYYMMDDTHHMMSSZ
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const H = pad(d.getUTCHours());
  const M = pad(d.getUTCMinutes());
  const S = "00";
  return `${y}${m}${day}T${H}${M}${S}Z`;
}

function generateGoogleCalendarLink(show: TradeShow) {
  const details = `B.V. Gems Inc — ${show.booth}`;
  const startDate = buildZDate(show.start, show.startTime ?? "09:00");
  const endDate = buildZDate(show.end, show.endTime ?? "17:00");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    show.name
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(
    show.location
  )}&trp=false&sprop=name:B.V.%20Gems%20Inc`;
}

function generateICSDataURI(show: TradeShow) {
  const dtStart = buildZDate(show.start, show.startTime ?? "09:00");
  const dtEnd = buildZDate(show.end, show.endTime ?? "17:00");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//B.V. Gems Inc//Trade Show//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${show.name.replace(/\s+/g, "_")}@bvgems.com`,
    `URL:${show.website}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${show.name}`,
    `DESCRIPTION:${"B.V. Gems Inc — " + show.booth}`,
    `LOCATION:${show.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

// ===== UI =====
export default function TradeShows() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedText
          text="Upcoming Trade Shows"
          className="text-center text-3xl sm:text-4xl text-[#0b182d] mb-12"
        />

        <Grid gutter="xl">
          {tradeShows.map((show, idx) => {
            const dateRange = formatDateRange(show.start, show.end);

            return (
              <GridCol key={idx} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  padding="lg"
                  radius="lg"
                  shadow="sm"
                  className="h-full transition-all duration-300 hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.85) 100%)",
                    border: "1px solid rgba(11,24,45,0.06)",
                  }}
                >
                  {/* Logo */}
                  <a
                    href={show.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${show.name} website`}
                  >
                    <div
                      style={{
                        height: 100, // fixed container height
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <Image
                        src={show.logo}
                        alt={show.name}
                        fit="contain"
                        style={{
                          maxHeight: "80px", // 👈 limit logo height
                          maxWidth: "160px", // 👈 limit logo width
                          objectFit: "contain", // prevent stretching
                        }}
                      />
                    </div>
                  </a>

                  <Group justify="center" gap="xs" mb="xs">
                    <Text fw={700} size="lg" c="#0b182d">
                      {show.name}
                    </Text>
                    <Tooltip label="Open show website">
                      <a
                        href={show.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${show.name} site`}
                        className="inline-flex items-center"
                      >
                        <IconExternalLink size={18} />
                      </a>
                    </Tooltip>
                  </Group>

                  <Text size="sm" c="dimmed" ta="center" mb="xs">
                    {show.location}
                  </Text>

                  <Group justify="center" mb="xs">
                    <Badge
                      size="sm"
                      variant="light"
                      color="dark"
                      radius="sm"
                      className="px-3 py-1"
                    >
                      {show.booth}
                    </Badge>
                  </Group>

                  <Text ta="center" size="sm" mb="sm">
                    <span className="font-medium text-[#0b182d]">Dates:</span>{" "}
                    {dateRange}
                  </Text>

                  <Divider my="md" />

                  <Group justify="center" gap="md" className="mt-1">
                    <Button
                      component="a"
                      href={generateGoogleCalendarLink(show)}
                      target="_blank"
                      leftSection={<IconCalendarPlus size={18} />}
                      color="#0b182d"
                      className="hover:-translate-y-0.5 transition-transform"
                      aria-label={`Add ${show.name} to Google Calendar`}
                    >
                      Google Calendar
                    </Button>

                    <Button
                      component="a"
                      href={generateICSDataURI(show)}
                      download={`${show.name.replace(/\s+/g, "-")}-BVGems.ics`}
                      variant="outline"
                      color="#0b182d"
                      leftSection={<IconCalendarPlus size={18} />}
                      className="hover:-translate-y-0.5 transition-transform"
                      aria-label={`Download iCal for ${show.name}`}
                    >
                      iCal/Outlook
                    </Button>
                  </Group>
                </Card>
              </GridCol>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
