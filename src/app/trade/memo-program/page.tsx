import { RequestMemoButton } from "@/components/Memo/RequestMemoButton";
import { BookAppointment } from "@/components/BookAppointment/BookAppointment";

export const metadata = {
  title: "Memo Program - Wholesale Exclusives | B.V. Gems",
  description: "Learn about the B.V. Gems Memo Program for jewelers. Apply for a trade account today.",
};

export default function MemoProgramPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-[#0b182d] text-white py-16 px-6 text-center">
        <h1 className="text-3xl md:text-4xl uppercase tracking-widest font-light mb-4">
          The B.V. Gems Memo Program
        </h1>
        <p className="text-gray-300 font-light max-w-2xl mx-auto text-lg">
          Exclusive access for verified trade professionals. View stones in your store before committing.
        </p>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-6">
        
        {/* Section 1: What is Memo? */}
        <section className="mb-16">
          <h2 className="text-2xl uppercase tracking-widest mb-6 font-semibold">What is the Memo Program?</h2>
          <div className="prose max-w-none text-gray-700 font-light leading-relaxed">
            <p className="mb-4">
              Our Memo Program is exclusively designed to empower trusted designers and wholesalers. We understand that seeing the perfect stone in person is crucial for closing a high-end sale. Through this program, approved trade professionals can request premium loose stones, matched pairs, and calibrated layouts on memo, allowing you to showcase our inventory to your clients with complete confidence and zero upfront cost.
            </p>
          </div>
        </section>

        {/* Section 2: 3 Steps */}
        <section className="mb-16">
          <h2 className="text-2xl uppercase tracking-widest mb-8 font-semibold text-center">3 Steps to Get Approved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-[#0b182d] mb-4">1</div>
              <h3 className="font-semibold uppercase tracking-wider mb-2">Apply</h3>
              <p className="text-sm text-gray-600">Submit your trade credentials (JBT, State Resale License) for verification.</p>
            </div>
            <div className="text-center p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-[#0b182d] mb-4">2</div>
              <h3 className="font-semibold uppercase tracking-wider mb-2">Review</h3>
              <p className="text-sm text-gray-600">Our team will review your application and establish your memo terms within 48 hours.</p>
            </div>
            <div className="text-center p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl font-bold text-[#0b182d] mb-4">3</div>
              <h3 className="font-semibold uppercase tracking-wider mb-2">Request</h3>
              <p className="text-sm text-gray-600">Once approved, you can request stones on memo directly through your account portal or via phone.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Terms Summary */}
        <section className="mb-16 bg-gray-50 p-8">
          <h2 className="text-xl uppercase tracking-widest mb-6 font-semibold">Terms Summary</h2>
          <ul className="list-disc pl-5 text-gray-700 font-light space-y-3">
            <li>The standard memo period is <strong>7 to 14 days</strong>, depending on the value and volume of the requested stones.</li>
            <li>The requesting account assumes full responsibility for the stones while in their possession, including all return shipping and transit insurance costs.</li>
            <li>All gemstones must be returned in their original, unaltered condition. Any stones that have been chipped, scratched, or set into mountings will be considered purchased.</li>
            <li>Stones not returned by the end of the agreed memo period will be automatically invoiced to your account at the agreed wholesale price.</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <RequestMemoButton />
        </div>
      </div>
      
      {/* Contact Block */}
      <BookAppointment />
    </div>
  );
}
