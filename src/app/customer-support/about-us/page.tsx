"use client";

import { useEffect, useState } from "react";
import { fetchAboutUsData } from "@/apis/api";
import {
  Container,
  Grid,
  GridCol,
  Title,
  Text,
  Card,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import {
  IconDiamond,
  IconStarFilled,
  IconAward,
  IconUsers,
  IconMapPin,
  IconCertificate,
  IconHeart,
  IconCrown,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

// ---------- Stats with Icons ----------
const stats = [
  { number: 6, label: "Generations", icon: IconUsers },
  { number: 100, label: "Years Experience", icon: IconAward },
  { number: 1000, label: "Happy Clients", icon: IconHeart },
  { number: 50, label: "Countries Served", icon: IconMapPin },
];

// ---------- Motion Variants ----------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

// ---------- Increment Counter ----------
const useCounter = (end: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 30);
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(interval);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(interval);
  }, [end, duration]);
  return count;
};

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getAboutUsContent = async () => {
    const response = await fetchAboutUsData();
    setAboutData(response);
    setLoading(false);
  };

  useEffect(() => {
    getAboutUsContent();
  }, []);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-32 text-white text-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(30,30,30,0.6) 100%), url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container size="md" className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl italic"
          >
            "Every gemstone tells a story. At B.V. Gems, our role is to ensure
            that story is one of{" "}
            <span className="text-amber-400">brilliance</span>,{" "}
            <span className="text-amber-400">authenticity</span>, and{" "}
            <span className="text-amber-400">heritage</span>."
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1 }}
            className="mt-12 opacity-90 font-light block"
          >
            — The B.V. Gems Family Legacy
          </motion.span>
        </Container>
      </motion.div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-slate-50 to-stone-50">
        <Container size="lg">
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
            {stats.map((stat, index) => {
              const count = useCounter(stat.number);
              return (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Card className="text-center p-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <stat.icon
                      size={40}
                      className="mx-auto mb-4 text-amber-600"
                    />
                    <Text className="text-4xl font-bold text-slate-800 mb-2">
                      {count}
                      {stat.label.includes("+") ? "+" : ""}
                    </Text>
                    <Text className="text-slate-600 font-medium">
                      {stat.label}
                    </Text>
                  </Card>
                </motion.div>
              );
            })}
          </SimpleGrid>
        </Container>
      </div>

      {/* Main Content */}
      <Container size="lg" py={80}>
        {loading ? (
          <Skeleton height={300} radius="md" />
        ) : (
          <Grid>
            <GridCol span={{ base: 12 }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
              >
                <Title
                  pb={"lg"}
                  order={2}
                  className="text-4xl text-center text-slate-800"
                >
                  Six Generations of Excellence
                </Title>
                <div
                  className="prose prose-lg max-w-none leading-relaxed text-slate-600"
                  dangerouslySetInnerHTML={{ __html: aboutData.body }}
                />
              </motion.div>
            </GridCol>
          </Grid>
        )}
      </Container>
    </div>
  );
}
