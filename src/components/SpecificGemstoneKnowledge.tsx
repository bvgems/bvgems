"use client";

import { getGemStoneKnowledge } from "@/apis/api";
import {
  Image,
  Table,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Button,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { IconDownload } from "@tabler/icons-react";

interface Props {
  activeStone?: string;
}

export const SpecificGemstoneKnowledge = ({ activeStone }: Props) => {
  const [knowledge, setKnowledge] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchKnowledge = async () => {
      if (activeStone) {
        const gemstoneKnowledge = await getGemStoneKnowledge(activeStone);
        setKnowledge(gemstoneKnowledge);
      }
    };

    fetchKnowledge();
  }, [activeStone]);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const images = contentRef.current.querySelectorAll("img");
    const totalImages = images.length;
    let loadedImages = 0;

    const generatePDF = async () => {
      const html2pdf = (await import("html2pdf.js")).default;
      if (contentRef.current) {
        html2pdf()
          .set({
            margin: 0.5,
            filename: `${activeStone}-details.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          })
          .from(contentRef.current)
          .save();
      }
    };

    if (totalImages === 0) {
      generatePDF(); // No images
      return;
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === totalImages) generatePDF();
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) generatePDF();
        };
        img.onerror = () => {
          loadedImages++;
          if (loadedImages === totalImages) generatePDF();
        };
      }
    });
  };

  if (!activeStone) return null;

  return (
    <div className="px-10 py-5">
      {knowledge ? (
        <>
          <div className="flex flex-col items-center gap-3.5" ref={contentRef}>
            <div className="flex justify-center flex-col items-center gap-3">
              <Image
                h="200"
                w="200"
                src={knowledge?.additionalImages?.reference?.image?.url}
              />
              <span className="font-semibold">{activeStone}</span>
            </div>
            <div className="text-justify">
              {knowledge?.descriptionMetafield?.value}
            </div>
            <div>
              <h3 className="font-semibold flex justify-center mb-3">
                More Details about {activeStone}
              </h3>
              <div className="w-full max-w-md">
                <Table variant="vertical" layout="fixed" withTableBorder>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th>Hardness</Table.Th>
                      <Table.Td>{knowledge?.hardness?.value || "—"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Toughness</Table.Th>
                      <Table.Td>{knowledge?.toughness?.value || "—"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Metal Pairing</Table.Th>
                      <Table.Td>
                        {knowledge?.metalPairing?.value || "—"}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Birthstone</Table.Th>
                      <Table.Td>{knowledge?.birthstone?.value || "—"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Anniversary</Table.Th>
                      <Table.Td>
                        {knowledge?.anniversary?.value || "—"}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Enhancements</Table.Th>
                      <Table.Td>
                        {knowledge?.enhancements?.value
                          ? JSON.parse(knowledge.enhancements.value).join(", ")
                          : "—"}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Zodiac</Table.Th>
                      <Table.Td>{knowledge?.zodiac?.value || "—"}</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>

              {knowledge?.careNotes?.value && (
                <div className="mt-6 w-full max-w-md">
                  <h3 className="font-semibold mb-2">Care Instructions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {JSON.parse(knowledge.careNotes.value).map(
                      (note: string, index: number) => (
                        <li key={index}>{note}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {knowledge && (
            <div className="flex justify-end px-10">
              <Button
                leftSection={<IconDownload />}
                variant="filled"
                color="violet"
                className="mt-6"
                onClick={handleDownloadPDF}
              >
                Save as PDF
              </Button>
            </div>
          )}
        </>
      ) : (
        <p>Loading gemstone details...</p>
      )}
    </div>
  );
};
