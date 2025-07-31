"use client";

import { getGemStoneKnowledge } from "@/apis/api";
import { Image, Table, Button } from "@mantine/core";
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
      generatePDF();
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
    <div className="px-2 py-5">
      {knowledge ? (
        <>
          <div
            className="flex flex-col items-center"
            ref={contentRef}
          >
            <div className="flex justify-center flex-col items-center gap-3">
              <Image
                h={160}
                w={160}
                className="object-cover"
                src={knowledge?.additionalImages?.reference?.image?.url}
              />
              <span className="text-xl md:text-2xl font-semibold capitalize">
                {activeStone}
              </span>
            </div>
            <div className="text-justify text-sm md:text-base leading-relaxed mt-3 mb-4">
              {knowledge?.descriptionMetafield?.value}
            </div>
            <div className="w-full max-w-full md:max-w-3xl">
              <h3 className="font-semibold text-center text-lg md:text-xl mb-3">
                More Details about {activeStone}
              </h3>
              <Table
                variant="vertical"
                layout="fixed"
                withTableBorder
                striped
                highlightOnHover
              >
                <Table.Tbody>
                  {[
                    ["Hardness", knowledge?.hardness?.value],
                    ["Toughness", knowledge?.toughness?.value],
                    ["Metal Pairing", knowledge?.metalPairing?.value],
                    ["Birthstone", knowledge?.birthstone?.value],
                    ["Anniversary", knowledge?.anniversary?.value],
                    [
                      "Enhancements",
                      knowledge?.enhancements?.value
                        ? JSON.parse(knowledge.enhancements.value).join(", ")
                        : null,
                    ],
                    ["Zodiac", knowledge?.zodiac?.value],
                  ].map(([label, value]) => (
                    <Table.Tr key={label}>
                      <Table.Th className="w-1/3 text-sm md:text-base">
                        {label}
                      </Table.Th>
                      <Table.Td className="text-sm md:text-base">
                        {value || "—"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {knowledge?.careNotes?.value && (
                <div className="mt-6 w-full">
                  <h3 className="font-semibold text-base md:text-lg mb-2">
                    Care Instructions
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
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

          <div className="flex justify-end px-4 md:px-10 mt-6">
            <Button
              leftSection={<IconDownload />}
              variant="filled"
              color="#0b182d"
              onClick={handleDownloadPDF}
            >
              Save as PDF
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Loading gemstone details...
        </p>
      )}
    </div>
  );
};
