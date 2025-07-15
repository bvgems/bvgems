import {
  Container,
  Grid,
  GridCol,
  Image,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconDiamond } from "@tabler/icons-react";

export default function AboutUsPage() {
  return (
    <Container size="xl">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <ThemeIcon
            variant="gradient"
            size="md"
            gradient={{ from: "black", to: "#0b182d" }}
          >
            <IconDiamond size="1.5rem" />
          </ThemeIcon>
          <Title order={1} className="text-center" mb="xs">
            <span className="text-[1.7rem] text-[#0b182d]">
              About B. V. Gems
            </span>
          </Title>
        </div>
        <div className="flex justify-center items-center text-center">
          A Family Passion for Fine Gems & Jewelry
        </div>
      </div>
      <div>
        <Grid gutter="xl" className="mt-12">
          <GridCol span={{ base: 12, md: 6 }}>
            <Image
              src={"/assets/family-photo.png"}
              alt={"Family Photo"}
              h={"330"}
              className="object-cover w-full"
            />
          </GridCol>
          <GridCol className="flex flex-col gap-3" span={{ base: 12, md: 6 }}>
            <span className="font-medium text-[21px]">Our Story</span>
            <div className="flex flex-col justify-between h-full">
              <p className="text-justify">
                B.V. Gems is a well-known wholesaler of sapphires, rubies, and
                emeralds, located in the heart of the jewelry district in New
                York City. The company was established in 1996 by Sunil Dhandia,
                who had a passion for gemstones and a desire to create a
                reliable source for the jewelry industry. The company has grown
                significantly since then, and today it is considered one of the
                leading suppliers of colored gemstones.
              </p>
              <div className="flex justify-end">
                <Image
                  src={"/assets/signature.png"}
                  alt={"Signature"}
                  w={"150"}
                />
              </div>
            </div>
          </GridCol>
        </Grid>
      </div>
    </Container>
  );
}
