import FAQClient from "./FAQClient";
import { FAQ_DATA } from "@/data/faqData";

export const metadata = {
  title: "Gemstones & Memo Program FAQ | B.V. Gems",
  description:
    "Find answers to common questions about calibrated gemstones, loose colored stones, wholesale trade pricing, and the B.V. Gems Trade Memo Program.",
};

export default function FAQPage() {
  return <FAQClient faqContent={FAQ_DATA} />;
}
