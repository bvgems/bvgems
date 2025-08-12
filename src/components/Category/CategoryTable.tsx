"use client";

import {
  Button,
  Modal,
  Select,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconShoppingCart,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AuthForm } from "../Auth/AuthForm";
import { getCartStore } from "@/store/useCartStore";
import { notifications } from "@mantine/notifications";
import React, { useMemo, useState, useEffect } from "react";

export const CategoryTable = ({
  fetchedResult,
  selectedSizes,
  data,
  typeFilter,
}: any) => {
  const name = data?.handle;
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const router = useRouter();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const goToCartPage = (item: any) => {
    router.push(`/product-details?id=${item?.id}&name=${name}`);
  };

  const addProductToCart = (element: any, quantity: number = 1) => {
    addToCart({
      product: {
        productType: "stone",
        productId: element.id,
        collection_slug: element.collection_slug,
        color: element.color,
        ct_weight: element.ct_weight,
        cut: element.cut,
        image_url: element.image_url,
        price: element.price,
        quality: element.quality,
        shape: element.shape,
        size: element.size,
        type: element.type,
      },
      quantity,
    });

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product Added To The Cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  const formattedSelectedSize = selectedSizes[0];

  const totalFilteredRows = useMemo(() => {
    return (
      fetchedResult?.filter((item: any) => {
        const sizeMatch =
          selectedSizes.length === 0 || item.size === formattedSelectedSize;
        const typeMatch = !typeFilter || item.type === typeFilter;
        return sizeMatch && typeMatch;
      }) ?? []
    );
  }, [fetchedResult, selectedSizes, typeFilter]);

  const totalPages = Math.ceil(totalFilteredRows.length / rowsPerPage);

  const getPerCaratPrice = (element: any) => {
    if (!element?.ct_weight || !element?.price) return 0;
    if (element?.type === "Lab Grown" || element?.quality === "Lab Grown") {
      return 50;
    }
    return (element?.price / element?.ct_weight).toFixed(2);
  };

  const getLabPrices = (element: any) => {
    if (!element?.ct_weight || !element?.price) return 0;
    return (50 * element?.ct_weight).toFixed(2);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSizes, sortOrder, typeFilter]);

  const filteredAndSortedRows = useMemo(() => {
    let filtered = [...totalFilteredRows];

    if (sortOrder === "lowToHigh") {
      filtered.sort((a: any, b: any) => a.ct_weight - b.ct_weight);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a: any, b: any) => b.ct_weight - a.ct_weight);
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    return filtered.slice(startIndex, startIndex + rowsPerPage);
  }, [totalFilteredRows, sortOrder, currentPage]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      <hr className="mt-11 text-gray-300" />
      <div className="mt-10 px-4 md:px-35 mb-20 uppercase">
        {!user && (
          <p className="text-center text-gray-700 mb-6 text-lg font-medium">
            Please{" "}
            <button
              onClick={open}
              className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              SIGN IN
            </button>{" "}
            to view gemstone prices.
          </p>
        )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Showing {totalFilteredRows.length} result
            {totalFilteredRows.length !== 1 ? "s" : ""}
          </p>
          <Select
            placeholder="Sort by Carat Weight"
            value={sortOrder}
            onChange={setSortOrder}
            data={[
              { label: "Low to High", value: "lowToHigh" },
              { label: "High to Low", value: "highToLow" },
            ]}
            clearable
            className="w-[220px] hidden md:block"
          />
        </div>

        <Table highlightOnHover highlightOnHoverColor="#DCDCDC" striped>
          <TableThead className="hidden md:table-header-group">
            <TableTr className="font-extrabold text-[15px] text-gray-700 uppercase">
              <TableTh>Image</TableTh>
              <TableTh>Type</TableTh>
              <TableTh>Gemstone</TableTh>
              <TableTh>Color</TableTh>
              <TableTh>Size</TableTh>
              <TableTh>CT Weight</TableTh>
              <TableTh>Quality</TableTh>
              <TableTh>Cut</TableTh>
              {user && (
                <>
                  <TableTh>
                    <div>Estimated Price</div>
                    <p className="text-xs text-gray-400">(per stone)</p>
                  </TableTh>
                  <TableTh>Per Carat Price</TableTh>
                </>
              )}
            </TableTr>
          </TableThead>

          <TableTbody>
            {filteredAndSortedRows.length > 0 ? (
              filteredAndSortedRows.map((element: any) => {
                const isExpanded = expandedRows[element.id];
                return (
                  <React.Fragment key={element.id}>
                    <TableTr
                      onClick={() => goToCartPage(element)}
                      className="cursor-pointer"
                    >
                      {/* Image cell */}
                      <TableTd>
                        <div className="w-14 h-14 flex items-center justify-center rounded overflow-hidden shadow-sm border border-gray-200">
                          <img
                            src={element.image_url}
                            alt="gem"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </TableTd>

                      <TableTd className="hidden md:table-cell">
                        {element.type}
                      </TableTd>
                      <TableTd className="hidden md:table-cell capitalize">
                        {element.collection_slug}
                      </TableTd>
                      <TableTd className="hidden md:table-cell">
                        {element.color}
                      </TableTd>
                      <TableTd className="hidden md:table-cell">
                        {element.size.includes("x")
                          ? element.size
                              .replace(/x/g, " x ")
                              .replace(/\s+/g, " ")
                              .trim()
                          : parseFloat(element.size).toFixed(2)}
                      </TableTd>
                      <TableTd className="hidden md:table-cell">
                        {element.ct_weight}
                      </TableTd>
                      <TableTd className="hidden md:table-cell">
                        {element.quality}
                      </TableTd>
                      <TableTd className="hidden md:table-cell">
                        {element.cut}
                      </TableTd>

                      {user && (
                        <>
                          <TableTd className="hidden md:table-cell">
                            {element?.quality === "Lab Grown" ||
                            element?.type === "Lab Grown" ? (
                              <span className="font-bold text-lg">
                                {getLabPrices(element)}
                              </span>
                            ) : element?.price ? (
                              <span className="font-bold text-lg">
                                $ {element.price}
                              </span>
                            ) : null}
                          </TableTd>

                          <TableTd className="hidden md:table-cell">
                            {getPerCaratPrice(element) !== 0 && (
                              <span className="font-bold text-lg">
                                $ {getPerCaratPrice(element)}
                              </span>
                            )}
                          </TableTd>
                        </>
                      )}

                      <TableTd className="hidden md:table-cell">
                        <Button
                          leftSection={<IconShoppingCart />}
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            addProductToCart(element);
                          }}
                          color="#0b182d"
                        >
                          ADD TO CART
                        </Button>
                      </TableTd>

                      {/* Mobile view */}
                      <TableTd className="md:hidden">{element.type}</TableTd>
                      <TableTd className="md:hidden">
                        {element.size}
                      </TableTd>
                      <TableTd className="md:hidden">{element.quality}</TableTd>
                      <TableTd className="md:hidden">
                        <Button
                          variant="subtle"
                          size="compact-sm"
                          color="#0b182d"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(element.id);
                          }}
                          leftSection={
                            isExpanded ? (
                              <IconMinus size={16} />
                            ) : (
                              <IconPlus size={16} />
                            )
                          }
                        >
                          {isExpanded ? "Hide" : "Details"}
                        </Button>
                      </TableTd>
                    </TableTr>

                    {/* Mobile expanded row */}
                    {isExpanded && (
                      <TableTr className="md:hidden bg-gray-50">
                        <TableTd colSpan={5}>
                          <div className="flex flex-col gap-2 text-sm px-2 py-3">
                            <div>
                              <strong>Stone:</strong> {element.collection_slug}
                            </div>
                            <div>
                              <strong>Color:</strong> {element.color}
                            </div>
                            <div>
                              <strong>CT Weight:</strong> {element.ct_weight}
                            </div>
                            <div>
                              <strong>Cut:</strong> {element.cut}
                            </div>
                            {user && (
                              <>
                                <div>
                                  <strong>Per Stone Price: </strong> $
                                  {element.price}
                                </div>
                                <div>
                                  <strong>Per Carat Price: </strong> $
                                  {getPerCaratPrice(element)}
                                </div>
                              </>
                            )}
                            <div className="mt-2">
                              <Button
                                leftSection={<IconShoppingCart />}
                                variant="outline"
                                fullWidth
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addProductToCart(element);
                                }}
                                color="#0b182d"
                              >
                                ADD TO CART
                              </Button>
                            </div>
                          </div>
                        </TableTd>
                      </TableTr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableTr>
                <TableTd colSpan={9}>
                  <div className="text-center py-10 text-gray-600 text-md italic">
                    No matching stones found for the selected filters.
                  </div>
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              siblings={1}
              boundaries={1}
              color="dark"
            />
          </div>
        )}
      </div>
    </>
  );
};
