"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  GridCol,
  Image,
  Table,
  TableTbody,
  TableTh,
  TableThead,
} from "@mantine/core";
import { getShapesData } from "@/apis/api";
import { useAuth } from "@/hooks/useAuth";
import { IconShoppingCart, IconUser } from "@tabler/icons-react";

export function CategoryContent({
  data,
  shapes,
  allSizes,
}: {
  data: any;
  shapes: string[];
  allSizes: { [key: string]: string[] };
}) {
  const [selectedShape, setSelectedShape] = useState<string | null>(shapes[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [fetchedResult, setFetchedResult] = useState([]);
  const { user } = useAuth();

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const fetchShapesData = async (
    selectedShape: string | null,
    title: string
  ) => {
    const result: any = await getShapesData(selectedShape, title);
    setFetchedResult(result?.data);
  };

  useEffect(() => {
    fetchShapesData(selectedShape, data.title);
    setSelectedSizes([]);
  }, [selectedShape]);

  const filteredRows = fetchedResult
    .filter(
      (item: any) =>
        selectedSizes.length === 0 || selectedSizes.includes(item.size)
    )
    .map((element: any) => (
      <Table.Tr key={element.id} className="hover:bg-violet-500 cursor-pointer">
        <Table.Td>{element.type}</Table.Td>
        <Table.Td>{element.collection_slug}</Table.Td>
        <Table.Td>{element.color}</Table.Td>
        <Table.Td>{element.size}</Table.Td>
        <Table.Td>{element.ct_weight}</Table.Td>
        <Table.Td>{element.quality}</Table.Td>
        <Table.Td>{element.cut}</Table.Td>
        <Table.Td></Table.Td>
        <Table.Td>
          {user ? (
            <Button
              leftSection={<IconShoppingCart />}
              styles={{
                root: {
                  backgroundColor: "#15803d",
                  padding: "0.75rem",
                },
              }}
            >
              Add To Cart
            </Button>
          ) : (
            <Button className="p-3" leftSection={<IconUser />} color="violet">
              Signin To Order
            </Button>
          )}
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <>
      <Container className="mt-24 bg-white">
        <Grid gutter={{ md: 50 }}>
          <GridCol span={{ base: 12, md: 5 }}>
            <Image
              className="shadow-sm rounded-b-3xl"
              src={data?.image?.src}
              fit="contain"
              h={"400"}
              w={"400"}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 7 }}>
            <span className="text-3xl font-bold text-violet-800">
              {data?.title}
            </span>
            <div className="flex flex-wrap gap-3 mt-6">
              {shapes?.map((shape: string, index: number) => (
                <Button
                  key={index}
                  color="violet"
                  variant={selectedShape === shape ? "filled" : "light"}
                  size="compact-sm"
                  onClick={() => setSelectedShape(shape)}
                >
                  {shape}
                </Button>
              ))}
            </div>

            {selectedShape && (
              <div className="mt-6">
                <p className="font-semibold mb-2 text-violet-800">
                  Available Sizes for {selectedShape}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSizes[selectedShape]?.map((size: string, i: number) => (
                    <Button
                      key={i}
                      onClick={() => handleSizeToggle(size)}
                      color="violet"
                      variant={
                        selectedSizes.includes(size) ? "filled" : "outline"
                      }
                      size="sm"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </GridCol>
        </Grid>
      </Container>

      <hr className="mt-11 text-gray-300" />

      <div className="mt-10 px-44 mb-44">
        <p className="text-right text-sm text-gray-600 mb-2">
          Showing {filteredRows.length} result
          {filteredRows.length !== 1 ? "s" : ""}
        </p>
        <Table striped stickyHeaderOffset={60}>
          <TableThead>
            <Table.Tr className="font-extrabold text-[18px] text-violet-800">
              <TableTh>Type</TableTh>
              <TableTh>Gemstone</TableTh>
              <TableTh>Color</TableTh>
              <TableTh>Size</TableTh>
              <TableTh>CT Weight</TableTh>
              <TableTh>Quality</TableTh>
              <TableTh>Cut</TableTh>
              <TableTh>Estimated Price</TableTh>
            </Table.Tr>
          </TableThead>
          <TableTbody>{filteredRows}</TableTbody>
        </Table>
      </div>
    </>
  );
}
