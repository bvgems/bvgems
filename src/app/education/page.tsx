import { GemstonesKnowledge } from "@/components/GemstonesKnowledge";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Button, Grid, GridCol, Image, Stack, Text } from "@mantine/core";
import {
  IconDiamond,
  IconFileText,
  IconHeartHandshake,
  IconSearch,
  IconShoppingBag,
  IconTruckDelivery,
} from "@tabler/icons-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <IconDiamond size={40} />,
    title: "Extensive Selection",
    description:
      "We maintain an inventory of over a million gemstones, offering a diverse range to fulfill every requirement.",
  },
  {
    icon: <IconTruckDelivery size={40} />,
    title: "Fast Shipping",
    description:
      "Our gemstones are in stock and ready to be shipped quickly, ensuring timely delivery whenever you need them.",
  },
  {
    icon: <IconFileText size={40} />,
    title: "Full Transparency",
    description:
      "Each gemstone is accompanied by complete information about any treatments, giving you confidence and clarity in your purchase.",
  },
  {
    icon: <IconSearch size={40} />,
    title: "Trusted Quality",
    description:
      "We’re recognized for reliable consistency in color, cut, and availability — making it easy to build lasting trust with us.",
  },
  {
    icon: <IconHeartHandshake size={40} />,
    title: "Comprehensive Services",
    description:
      "Whether you’re looking for matched sets or custom color blends like ombré and rainbow palettes, we provide a wide array of gemstone services.",
  },
];

export default function Education() {
  return (
    <>
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/generated-image.png"
          alt="Gemstone Education"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col gap-6 justify-start mt-36 ml-9">
          <h1 className="text-4xl text-violet-800 font-bold max-w-[500px]">
            Gemstone Information
          </h1>
          <div className="max-w-[650px]">
            <p>
              If you're considering diving into the world of colored gemstones,
              the best first step is to educate yourself. There's much to
              explore—from understanding color and quality to evaluating
              durability and benefits. Begin your journey with our gemstone
              guide and uncover a vibrant selection to suit every customer's
              unique preferences.
            </p>
            <Button
              className="mt-3"
              color="violet"
              leftSection={<IconShoppingBag />}
            >
              Shop Gemstones
            </Button>
          </div>
        </div>
      </div>
      <GemstonesKnowledge />
      <div className="mt-16">
        <h3 className="text-center mb-4">
          <span className="text-violet-800 text-2xl font-semibold">
            Why Choose Us?
          </span>
        </h3>
        <div className="relative h-[600px] w-full">
          <Image
            src="/assets/why-bvg.png"
            alt="Gemstone Education"
            className="h-full w-full"
            fit="cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center">
            <div>
              <Grid gutter="xl">
                {features.map((feature, index) => (
                  <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
                    <Stack align="center">
                      {feature.icon}
                      <Text fw={700} size="lg">
                        {feature.title}
                      </Text>
                      <Text size="sm">{feature.description}</Text>
                    </Stack>
                  </GridCol>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
