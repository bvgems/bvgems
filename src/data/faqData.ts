export interface FAQItem {
  id: string;
  category: "gemstones" | "memo" | "grading" | "orders";
  categoryLabel: string;
  question: string;
  answer: string;
  keyPoints?: string[];
}

export const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "gemstones", label: "Gemstones & Sizing" },
  { id: "memo", label: "Trade Memo Program" },
  { id: "grading", label: "Grading & Certifications" },
  { id: "orders", label: "Orders & Showroom" },
] as const;

export const FAQ_DATA: FAQItem[] = [
  // --- Category: Gemstones & Sizing ---
  {
    id: "calibrated-definition",
    category: "gemstones",
    categoryLabel: "Gemstones & Sizing",
    question: "What are calibrated gemstones, and how do they benefit jewelers and designers?",
    answer:
      "Calibrated gemstones are precision-cut loose gemstones cut to exact standardized millimeter dimensions (e.g., 2.00 mm, 3.00 mm, 6x4 mm, 7x5 mm, 8x6 mm) with strict dimensional tolerances. Unlike free-form stones that require custom mountings, calibrated stones fit directly into standard jewelry mountings, halo settings, eternity bands, and production castings without requiring bench jewelers to perform costly custom seat-cutting or lapidary re-cutting.",
    keyPoints: [
      "Standard millimeter sizing (Round, Oval, Emerald Cut, Square Cushion, Elongated Cushion, Pear, Princess, Marquise, Baguette, Trillion).",
      "Saves significant labor time and manufacturing costs on custom mountings.",
      "Ensures predictable fit for multi-stone eternity bands, tennis bracelets, and halo designs.",
    ],
  },
  {
    id: "gemstone-varieties",
    category: "gemstones",
    categoryLabel: "Gemstones & Sizing",
    question: "What gemstone varieties does B.V. Gems stock in calibrated sizes?",
    answer:
      "We maintain one of the most extensive physical loose gemstone inventories in NYC’s Diamond District. Our inventory includes natural and lab-grown Sapphires in every color (Royal Blue, Cornflower, Navy, Teal/Green, Pink, Yellow, Orange, Padparadscha, Purple, and White), Colombian and Zambian Emeralds, Rubies, Aquamarines, Alexandrites, Citrine, Garnets, Amethysts, Spinels, Tourmalines, and Peridot.",
    keyPoints: [
      "Available across both calibrated millimeter sizes and unique free-size single lots.",
      "Comprehensive color palettes, from vivid saturated hues to delicate pastel shades.",
    ],
  },
  {
    id: "carat-vs-piece",
    category: "gemstones",
    categoryLabel: "Gemstones & Sizing",
    question: "What is the difference between purchasing gemstones by carat weight vs. by the piece?",
    answer:
      "We offer two distinct ordering modes tailored to how jewelers build pieces:\n\n• By the Carat (ctw): Ideal for volume parcel orders, melee pave, and matching layouts. Pricing is calculated directly on total carat weight, with a minimum order requirement equal to or greater than the weight of a single stone.\n• By the Piece: Ideal when you need an exact count of stones (e.g., 2 matched rounds for earrings, 5 stones for an anniversary ring). You select the exact piece quantity with fixed per-piece pricing.",
    keyPoints: [
      "Minimum order weight for carat purchases is always at least one full stone weight.",
      "Transparent conversion between carat weight lots and piece counts.",
    ],
  },
  {
    id: "color-matching-consistency",
    category: "gemstones",
    categoryLabel: "Gemstones & Sizing",
    question: "How do you ensure color and cut consistency across multi-stone orders?",
    answer:
      "Every gemstone parcel at B.V. Gems is meticulously graded and matched by our in-house gemologists. When you order multi-stone calibrated lots—such as layouts for eternity bands, tennis bracelets, or necklace suites—we calibrate for millimeter tolerance (±0.10 mm to ±0.20 mm), crown height, pavilion depth, hue, saturation, and brilliance so your finished piece exhibits uniform optical balance.",
    keyPoints: [
      "Manual color-matching under standardized daylight gemological lighting.",
      "Uniform crown heights and pavilion depths to ensure level setting across channel and prong mountings.",
    ],
  },
  {
    id: "matched-pairs-layouts",
    category: "gemstones",
    categoryLabel: "Gemstones & Sizing",
    question: "Do you offer matched pairs and graduated color stone layouts?",
    answer:
      "Yes. We specialize in precision-matched pairs (ideal for stud earrings, drops, and three-stone engagement rings) as well as graduated and multi-colored gemstone layout suites (including rainbow sapphire suites, ombre layouts, and graduated bracelet layouts). Each layout comes pre-measured, color-sequenced, and ready for immediate bench setting.",
  },
  {
    id: "natural-vs-lab-treatments",
    category: "gemstones",
    categoryLabel: "Gemstones & Sizing",
    question: "Are your gemstones natural or lab-grown, and how are treatments disclosed?",
    answer:
      "We offer both Natural and Lab-Grown gemstones with 100% full disclosure. Every item on our platform and trade invoice explicitly identifies whether the stone is Natural or Lab-Grown, along with standard industry enhancements (such as traditional heat treatment in corundum or minor cedarwood oil in natural emeralds). We never sell undisclosed synthetic or treated materials.",
    keyPoints: [
      "Full disclosure adhering strictly to AGTA and CIBJO guidelines.",
      "Untreated / unheated natural stones available with independent lab certificates.",
    ],
  },

  // --- Category: Trade Memo Program ---
  {
    id: "memo-program-overview",
    category: "memo",
    categoryLabel: "Trade Memo Program",
    question: "What is the B.V. Gems Memo Program, and who qualifies?",
    answer:
      "Our Memo Program is an exclusive service designed for vetted jewelry designers, independent retailers, and wholesale trade members. It allows you to take select high-value loose gemstones, matched pairs, and calibrated layouts on consignment ('memo') to present directly to your private clients before purchasing, with zero upfront capital required. Qualification is open to registered jewelry businesses with verifiable trade references or a Jewelers Board of Trade (JBT) rating.",
    keyPoints: [
      "Zero upfront capital required to present exceptional stones to your private clients.",
      "Available to verified jewelers, designers, and trade wholesalers.",
    ],
  },
  {
    id: "memo-application-process",
    category: "memo",
    categoryLabel: "Trade Memo Program",
    question: "How do I apply for trade memo privileges?",
    answer:
      "You can apply directly through our Trade Account Application or the Memo Program portal. You will need your Business Tax ID / State Resale Certificate, business details, and at least two trade references (or your JBT ID number). Our trade compliance team reviews applications within 24 to 48 business hours.",
    keyPoints: [
      "Fast 24-48 hour approval turnaround.",
      "Once approved, memo requests can be placed directly through your online account portal or by calling our showroom.",
    ],
  },
  {
    id: "memo-duration-extension",
    category: "memo",
    categoryLabel: "Trade Memo Program",
    question: "What is the standard memo duration, and can it be extended?",
    answer:
      "The standard memo period is 7 to 14 calendar days, depending on the inventory tier and volume requested. If you require extra time to accommodate a rescheduled client appointment, you can request an extension directly through your account dashboard or by contacting your B.V. Gems account representative prior to the expiration date.",
  },
  {
    id: "memo-client-purchase",
    category: "memo",
    categoryLabel: "Trade Memo Program",
    question: "What happens when my client approves the stone and decides to purchase?",
    answer:
      "Simply log into your B.V. Gems trade account portal and mark the stone as purchased, or contact your account representative via phone or email. We will issue your final invoice at your approved wholesale trade pricing. If the client declines, simply package the stone securely and return it within the agreed memo window.",
  },
  {
    id: "memo-return-conditions",
    category: "memo",
    categoryLabel: "Trade Memo Program",
    question: "What are the conditions for returning gemstones from memo?",
    answer:
      "All memoed gemstones must be returned in their original, unaltered, and unset condition, accompanied by all original security packaging and certificates. Any gemstone that has been set into a mounting, altered, chipped, or scratched while in your possession is deemed purchased and will be invoiced to your account at wholesale value.",
    keyPoints: [
      "Stones must remain unset and unaltered in original condition.",
      "Any stones set or damaged are considered sold.",
    ],
  },
  {
    id: "memo-shipping-insurance",
    category: "memo",
    categoryLabel: "Trade Memo Program",
    question: "Who is responsible for shipping and transit insurance on memo orders?",
    answer:
      "Outbound shipping for approved memo requests is dispatched via fully insured overnight courier. The requesting trade account assumes responsibility for return shipping and full transit insurance. You may use our discounted prepaid return labels or your own established third-party parcel insurance (e.g., Malca-Amit, Brinks, or Parcel Pro).",
  },

  // --- Category: Grading & Certifications ---
  {
    id: "gemstone-certifications",
    category: "grading",
    categoryLabel: "Grading & Certifications",
    question: "Do B.V. Gems stones come with independent gemological certificates?",
    answer:
      "Important single loose gemstones, high-carat emeralds, unheated sapphires, and rare collector pieces include independent lab certificates from globally recognized institutions, including GIA (Gemological Institute of America), Lotus Gemology, AGL (American Gemological Laboratories), or IGI. For calibrated stones and parcels, individual laboratory certificates are available upon request for an additional lab fee ($75 per stone).",
    keyPoints: [
      "Certifications from GIA, Lotus, AGL, or IGI.",
      "Calibrated stones can be submitted for certification upon request before shipment.",
    ],
  },
  {
    id: "origin-requests",
    category: "grading",
    categoryLabel: "Grading & Certifications",
    question: "Can I request specific origins such as Colombian vs. Zambian Emeralds or Ceylon Sapphires?",
    answer:
      "Yes. We stock origin-specific inventory, clearly identified on our website. For example, our emeralds are categorized by Colombian (celebrated for pure, warm verdant hues) and Zambian (renowned for deep saturation and high crystal clarity) origins. Origin determinations are verified through our direct mine sources and gemological testing.",
  },
  {
    id: "calibrated-size-tolerances",
    category: "grading",
    categoryLabel: "Grading & Certifications",
    question: "What millimeter tolerances do you maintain for calibrated stones?",
    answer:
      "Our calibrated stones are cut to precision tolerances of ±0.10 mm to ±0.20 mm depending on the gemstone variety and millimeter category. You can consult our interactive Size & Tolerance Guide on any product page for exact millimeter-to-carat weight conversion matrices across every cut.",
  },

  // --- Category: Orders, Shipping & Showroom ---
  {
    id: "wholesale-trade-pricing",
    category: "orders",
    categoryLabel: "Orders & Showroom",
    question: "How do I unlock wholesale trade pricing on the website?",
    answer:
      "Wholesale gemstone pricing is reserved exclusively for verified trade professionals. To access wholesale pricing, click LOG IN in the top-right header and log into your approved account, or apply for an account using our Trade Registration Form. Once approved, you gain access to wholesale carat rates, quantity tiers, and live inventory holds.",
  },
  {
    id: "nyc-showroom-pickup",
    category: "orders",
    categoryLabel: "Orders & Showroom",
    question: "Can I view and pick up gemstones in person at your NYC Diamond District showroom?",
    answer:
      "Yes! All orders, memo requests, and custom stone consultations can be picked up or inspected in person at our Manhattan Diamond District headquarters: 66 West 47th Street, Booth #9 & 10, New York, NY 10036. Appointments can be scheduled online via our Showroom Appointment tool or by calling (212) 302-0447.",
    keyPoints: [
      "Located at 66 West 47th Street, Booth #9 & 10, New York, NY 10036.",
      "Same-day pickup available for confirmed in-stock orders.",
    ],
  },
  {
    id: "shipping-speed-insurance",
    category: "orders",
    categoryLabel: "Orders & Showroom",
    question: "How fast do gemstone orders ship, and how are packages insured?",
    answer:
      "In-stock calibrated and loose stone orders placed before 3:00 PM EST ship the same business day. All packages are dispatched via fully insured expedited couriers (FedEx or UPS) with adult signature required upon delivery. Free 2 Days insured shipping is provided on all U.S. orders of $500 or more ($23 for orders under $500), and Priority Overnight shipping is available for $38 ($15 on orders of $500 or more).",
  },
  {
    id: "loose-stone-return-policy",
    category: "orders",
    categoryLabel: "Orders & Showroom",
    question: "What is your return policy on purchased loose gemstones?",
    answer:
      "For purchased loose gemstones, we offer a 14-day inspection and return window from the date of delivery. Returned stones must be in their original, unset, and undamaged condition with all original laboratory documentation and security packaging. Custom-cut orders or stones that have been mounted are non-refundable.",
  },
];
