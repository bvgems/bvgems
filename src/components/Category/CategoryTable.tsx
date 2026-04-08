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
  Checkbox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandGmail,
  IconBrandWhatsapp,
  IconFileExcel,
  IconMail,
  IconPrinter,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AuthForm } from "../Auth/AuthForm";
import { getCartStore } from "@/store/useCartStore";
import React, { useMemo, useState, useEffect } from "react";
import { AddToCartModal } from "../CommonComponents/AddToCartModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const CategoryTable = ({
  fetchedResult,
  selectedSizes,
  data,
  typeFilter,
  emeraldShade,
}: any) => {
  const name = data?.handle;
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const router = useRouter();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [productModal, { open: openProductModal, close: closeProductModal }] =
    useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [priceOptionModal, { open: openPriceModal, close: closePriceModal }] =
    useDisclosure(false);

  const [sortOrder, setSortOrder] = useState<string | null>("lowToHigh");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const goToCartPage = (item: any) => {
    router.push(`/product-details?id=${item?.id}&name=${name}`);
  };

  const formattedSelectedSize = selectedSizes[0];

  const exportToExcel = (
    items: any[],
    options: { showPiece: boolean; showCarat: boolean },
  ) => {
    const data = items.map((item) => ({
      Gemstone: item.collection_slug,
      Shape: item.shape,
      Size: item.size,
      Carat: item.ct_weight,
      Quality: item.quality,
      Image: item.image_url,
      ...(options.showPiece && { "Price Per Piece": item.price }),
      ...(options.showCarat && {
        "Price Per Carat": getPerCaratPrice(item),
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gems");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "gemstones.xlsx");
  };

  const totalFilteredRows = useMemo(() => {
    return (
      fetchedResult?.filter((item: any) => {
        const sizeMatch =
          selectedSizes.length === 0 || item.size === formattedSelectedSize;
        const typeMatch = !typeFilter || item.type === typeFilter;
        const availableMatch = item.is_available === true;
        return sizeMatch && typeMatch && availableMatch;
      }) ?? []
    );
  }, [fetchedResult, selectedSizes, typeFilter]);

  const totalPages = Math.ceil(totalFilteredRows.length / rowsPerPage);

  const getPerCaratPrice = (element: any) => {
    if (!element?.ct_weight || !element?.price) return 0;
    if (element?.type === "Lab Grown" || element?.quality === "Lab Grown") {
      if (
        element?.collection_slug === "Alexandrite" ||
        element?.collection_slug === "Paraiba Tourmaline"
      ) {
        return 85;
      }
      return 50;
    }
    return (element?.price / element?.ct_weight).toFixed(2);
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

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelectAll = () => {
    const allSelected = filteredAndSortedRows.every(
      (row: any) => selectedRows[row.id],
    );

    const newSelection: Record<string, boolean> = {};
    filteredAndSortedRows.forEach((row: any) => {
      newSelection[row.id] = !allSelected;
    });

    setSelectedRows(newSelection);
  };

  const generateText = (items: any[], options: PriceOptions) => {
    return items
      .map((item) => {
        return `
Gemstone: ${item.collection_slug}
Shape: ${item.shape}
Image: ${item.image_url}
Size: ${item.size}
CT: ${item.ct_weight}
Quality: ${item.quality}
${options.showPiece && item.price ? `Price Per Piece: $${item.price}` : ""}
${options.showCarat ? `Price Per Carat: $${getPerCaratPrice(item)}` : ""}
-------------------------`;
      })
      .join("\n");
  };

  type PriceOptions = {
    showPiece: boolean;
    showCarat: boolean;
  };

  const sendWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };
  const sendEmail = (items: any[], options: PriceOptions) => {
    const text = generateText(items, options);

    window.location.href = `mailto:?subject=Gemstones&body=${encodeURIComponent(text)}`;
  };
  const selectedItems = filteredAndSortedRows.filter(
    (item: any) => selectedRows[item.id],
  );
  const handlePrint = (options: PriceOptions) => {
    const rows = selectedItems
      .map(
        (item) => `
      <tr>
        <td><img src="${item.image_url}" width="60" /></td>
        <td>${item.collection_slug}</td>
        <td>${item.shape}</td>
        <td>${item.size}</td>
        <td>${item.ct_weight}</td>
        <td>${item.quality}</td>
        ${options.showPiece ? `<td>$${item.price ?? "-"}</td>` : ""}
        ${options.showCarat ? `<td>$${getPerCaratPrice(item)}</td>` : ""}
      </tr>
    `,
      )
      .join("");

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h2>Selected Gemstones</h2>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Gemstone</th>
              <th>Shape</th>
              <th>Size</th>
              <th>Carat</th>
              <th>Quality</th>
              ${options.showPiece ? "<th>Price Per Piece</th>" : ""}
              ${options.showCarat ? "<th>Price Per Carat</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;

    const win = window.open("", "_blank");
    win?.document.write(html);
    win?.document.close();
    win?.print();
  };

  const handleBulkAction = (option: string | null) => {
    if (!option) return;

    const showPiece: any = option === "piece" || option === "both";
    const showCarat: any = option === "carat" || option === "both";

    if (bulkAction === "whatsapp") {
      const text = generateText(selectedItems, {
        showPiece,
        showCarat,
      });
      sendWhatsApp(text);
    }

    if (bulkAction === "email") {
      sendEmail(selectedItems, {
        showPiece,
        showCarat,
      });
    }

    if (bulkAction === "excel") {
      exportToExcel(selectedItems, {
        showPiece,
        showCarat,
      });
    }

    if (bulkAction === "print") {
      handlePrint({
        showPiece,
        showCarat,
      });
    }

    closePriceModal();
  };
  const isPurchaseByCarat = (product: any) => {
    const size = product?.size;
    if (product?.quality === "Lab Grown") {
      if (
        size === "1.00 mm" ||
        size === "1.25 mm" ||
        size === "1.50 mm" ||
        size === "1.75 mm"
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <Modal
        size={"sm"}
        opened={priceOptionModal}
        onClose={closePriceModal}
        centered
      >
        <Select
          label="Price Display Option"
          placeholder="Select"
          data={[
            { label: "Without Price", value: "noPrice" },
            { label: "Price Per Piece", value: "piece" },
            { label: "Price Per Carat", value: "carat" },
            { label: "Both Prices", value: "both" },
          ]}
          onChange={(value) => handleBulkAction(value)}
        />
      </Modal>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>
      <Modal
        p={0}
        size={1000}
        opened={productModal}
        onClose={closeProductModal}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        {selectedProduct && (
          <AddToCartModal
            opened={productModal}
            onClose={closeProductModal}
            price={selectedProduct.price}
            image_url={selectedProduct.image_url}
            name={`${selectedProduct.collection_slug} ${selectedProduct.shape}`}
            size={selectedProduct.size}
            quality={selectedProduct.quality}
            ct_weight={selectedProduct.ct_weight}
            color={selectedProduct.color}
            product={selectedProduct}
          />
        )}
      </Modal>

      {/* <hr className="mt-11 text-gray-300" /> */}
      <div className="mt-10 px-4 md:px-8 mb-20">
        <div className="max-w-[1400px] mx-auto">
          {!user && (
            <p className="text-center text-gray-700 mb-6 text-lg font-medium">
              Please{" "}
              <button
                onClick={open}
                className="underline text-blue-600 hover:text-blue-800"
              >
                sign in
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
          {selectedItems.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              <Button
                onClick={() => {
                  setBulkAction("whatsapp");
                  openPriceModal();
                }}
                color="#0b182d"
                leftSection={<IconBrandWhatsapp size={"20"} />}
              >
                WhatsApp
              </Button>

              <Button
                onClick={() => {
                  setBulkAction("email");
                  openPriceModal();
                }}
                color="#0b182d"
                leftSection={<IconMail size={"20"} />}
              >
                Email
              </Button>

              <Button
                onClick={() => {
                  setBulkAction("excel");
                  openPriceModal();
                }}
                leftSection={<IconFileExcel size={"20"} />}
                color="#0b182d"
              >
                Export Excel
              </Button>

              <Button
                onClick={() => {
                  setBulkAction("print");
                  openPriceModal();
                }}
                leftSection={<IconPrinter size={"20"} />}
                color="#0b182d"
              >
                Print
              </Button>
            </div>
          )}
          <Table highlightOnHover highlightOnHoverColor="#DCDCDC" striped>
            {/* Desktop Header */}
            <TableThead className="hidden md:table-header-group">
              <TableTr className="font-extrabold text-[15px] text-gray-700 uppercase">
                <TableTh>
                  <Checkbox
                    onChange={toggleSelectAll}
                    checked={
                      filteredAndSortedRows.length > 0 &&
                      filteredAndSortedRows.every(
                        (row: any) => selectedRows[row.id],
                      )
                    }
                    color="#0b182d"
                  />
                </TableTh>
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
                    <TableTh>est. price per stone</TableTh>
                    <TableTh>Per Carat Price</TableTh>
                  </>
                )}
                <TableTh></TableTh>
              </TableTr>
            </TableThead>

            <TableTbody>
              {filteredAndSortedRows.length > 0 ? (
                filteredAndSortedRows.map((element: any) => {
                  // console.log('elementtt',element)
                  const isExpanded = expandedRows[element.id];
                  return (
                    <React.Fragment key={element.id}>
                      {/* Desktop Row */}
                      <TableTr
                        className="cursor-pointer hidden md:table-row"
                        onClick={() => goToCartPage(element)}
                      >
                        <TableTd onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={!!selectedRows[element.id]}
                            onChange={() => toggleSelectRow(element.id)}
                            color="#0b182d"
                          />
                        </TableTd>
                        <TableTd>
                          <div className="w-14 h-14 flex items-center justify-center rounded overflow-hidden shadow-sm border border-gray-200">
                            <img
                              src={element.image_url}
                              alt="gem"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </TableTd>
                        <TableTd>{element.type}</TableTd>
                        <TableTd className="capitalize">
                          {element.collection_slug}
                        </TableTd>
                        <TableTd>
                          {element.collection_slug === "Tanzanite"
                            ? "Purplish Blue"
                            : element.color}
                        </TableTd>
                        <TableTd>{element.size}</TableTd>
                        <TableTd>{element.ct_weight}</TableTd>
                        <TableTd>{element.quality}</TableTd>
                        <TableTd>{element.cut}</TableTd>
                        {user && (
                          <>
                            <TableTd>
                              {element?.price ? (
                                `$ ${Number(element.price).toFixed(2)}`
                              ) : (
                                <a
                                  href={`mailto:sales@bvgems.com?subject=${encodeURIComponent(
                                    `Price Request for ${element?.collection_slug} ${element?.shape} ${element?.size} ${element?.ct_weight}cts., ${element?.quality} Quality`,
                                  )}&body=${encodeURIComponent(
                                    `Hello,\n\nI would like to request the price for the following gemstone:\n\nGemstone: ${element?.collection_slug}\nShape: ${element?.shape}\nSize: ${element?.size}\nCarat Weight: ${element?.ct_weight} cts\nQuality: ${element?.quality}\n\nPlease let me know the pricing and availability.\n\nThank you!`,
                                  )}`}
                                  className="underline text-blue-600"
                                >
                                  Request Pricing
                                </a>
                              )}
                            </TableTd>
                            <TableTd>
                              {isPurchaseByCarat(element) ? (
                                getPerCaratPrice(element) !== 0 ? (
                                  `$ ${getPerCaratPrice(element)}`
                                ) : (
                                  <a
                                    href={`mailto:sales@bvgems.com?subject=${encodeURIComponent(
                                      `Price Request for ${element?.collection_slug} ${element?.shape} ${element?.size} ${element?.ct_weight}cts., ${element?.quality} Quality`,
                                    )}&body=${encodeURIComponent(
                                      `Hello,\n\nI would like to request the price for the following gemstone:\n\nGemstone: ${element?.collection_slug}\nShape: ${element?.shape}\nSize: ${element?.size}\nCarat Weight: ${element?.ct_weight} cts\nQuality: ${element?.quality}\n\nPlease let me know the pricing and availability.\n\nThank you!`,
                                    )}`}
                                    className="underline text-blue-600"
                                  >
                                    Request Pricing
                                  </a>
                                )
                              ) : (
                                <a
                                  href={`mailto:sales@bvgems.com?subject=${encodeURIComponent(
                                    `Price Request for ${element?.collection_slug} ${element?.shape} ${element?.size} ${element?.ct_weight}cts., ${element?.quality} Quality`,
                                  )}&body=${encodeURIComponent(
                                    `Hello,\n\nI would like to request the price for the following gemstone:\n\nGemstone: ${element?.collection_slug}\nShape: ${element?.shape}\nSize: ${element?.size}\nCarat Weight: ${element?.ct_weight} cts\nQuality: ${element?.quality}\n\nPlease let me know the pricing and availability.\n\nThank you!`,
                                  )}`}
                                  className="underline text-blue-600"
                                >
                                  Request Pricing
                                </a>
                              )}
                            </TableTd>
                            <TableTd>
                              <Button
                                leftSection={<IconShoppingCart />}
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(element); // ✅ store the clicked product
                                  openProductModal();
                                }}
                                color="#0b182d"
                              >
                                ADD TO CART
                              </Button>
                            </TableTd>
                          </>
                        )}
                      </TableTr>

                      {/* Mobile Row */}
                      <TableTr
                        onClick={() => goToCartPage(element)}
                        className="md:hidden"
                      >
                        <TableTd colSpan={3} className="w-full">
                          <div className="flex items-center justify-between w-full">
                            {/* Left: Image + details */}
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 flex-shrink-0 rounded overflow-hidden shadow-sm border border-gray-200">
                                <img
                                  src={element.image_url}
                                  alt="gem"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex flex-col text-sm">
                                <span>Size: {element.size}</span>
                                <span>Quality: {element.quality}</span>
                              </div>
                            </div>

                            {/* Right: Button */}
                            <Button
                              variant="light"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(element.id);
                              }}
                            >
                              {isExpanded ? "Hide" : "View Details"}
                            </Button>
                          </div>
                        </TableTd>
                      </TableTr>

                      {/* Mobile Expanded Row */}
                      {isExpanded && (
                        <TableTr className="md:hidden bg-gray-50">
                          <TableTd colSpan={3}>
                            <div className="flex flex-col gap-2 text-sm px-2 py-3">
                              <div>
                                <span>
                                  {`${element?.color} ${element?.collection_slug} ${element?.cut}`}
                                </span>
                              </div>
                              <div>
                                <strong>CT Weight:</strong> {element.ct_weight}
                              </div>
                              {user && (
                                <>
                                  <div>
                                    <strong>Est. Price Per Stone:</strong>{" "}
                                    {element?.price ? (
                                      `$ ${element.price}`
                                    ) : (
                                      <a
                                        href={`mailto:sales@bvgems.com?subject=${encodeURIComponent(
                                          `Price Request for ${element?.collection_slug} ${element?.shape} ${element?.size} ${element?.ct_weight}cts., ${element?.quality} Quality`,
                                        )}&body=${encodeURIComponent(
                                          `Hello,\n\nI would like to request the price for the following gemstone:\n\nGemstone: ${element?.collection_slug}\nShape: ${element?.shape}\nSize: ${element?.size}\nCarat Weight: ${element?.ct_weight} cts\nQuality: ${element?.quality}\n\nPlease let me know the pricing and availability.\n\nThank you!`,
                                        )}`}
                                        className="underline text-blue-600"
                                      >
                                        Request Pricing
                                      </a>
                                    )}
                                  </div>
                                  <div>
                                    <strong>Per Carat Price:</strong>{" "}
                                    {getPerCaratPrice(element) !== 0 ? (
                                      `$ ${getPerCaratPrice(element)}`
                                    ) : (
                                      <a
                                        href={`mailto:sales@bvgems.com?subject=${encodeURIComponent(
                                          `Price Request for ${element?.collection_slug} ${element?.shape} ${element?.size} ${element?.ct_weight}cts., ${element?.quality} Quality`,
                                        )}&body=${encodeURIComponent(
                                          `Hello,\n\nI would like to request the price for the following gemstone:\n\nGemstone: ${element?.collection_slug}\nShape: ${element?.shape}\nSize: ${element?.size}\nCarat Weight: ${element?.ct_weight} cts\nQuality: ${element?.quality}\n\nPlease let me know the pricing and availability.\n\nThank you!`,
                                        )}`}
                                        className="underline text-blue-600"
                                      >
                                        Request Pricing
                                      </a>
                                    )}
                                  </div>
                                </>
                              )}
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
                    <div className="text-center py-10 text-gray-600 italic">
                      No matching stones found for the selected filters.
                    </div>
                  </TableTd>
                </TableTr>
              )}
            </TableTbody>
          </Table>

          {/* Pagination */}
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
      </div>
    </>
  );
};
