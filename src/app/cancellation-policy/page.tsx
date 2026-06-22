import { Clock, AlertTriangle, FileText, Phone, Mail } from "lucide-react";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D0A511] mb-8 font-black tracking-wide">
          Cancellation Policy
        </h1>
        <div className="prose prose-invert prose-gold max-w-none text-gray-300 space-y-6 leading-relaxed">
          <p className="text-gray-600 mb-8">
            At Fantastic Limo, we understand that plans can change. To maintain our premium service quality and guarantee vehicle availability for all clients, we adhere to the following cancellation policy.
          </p>

          <div className="space-y-8 mt-8">
            {/* 48 hours or more */}
            <div className="flex gap-4 items-start p-6 rounded-lg bg-dark-gray border border-luxury-gold/15">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                <Clock className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-[#D0A511] font-bold mb-2">48 Hours or More Notice</h3>
                <p className="text-gray-600">
                  Free cancellation with no charges. You will receive a full refund or can reschedule without penalty.
                </p>
              </div>
            </div>

            {/* 24 to 12 hours */}
            <div className="flex gap-4 items-start p-6 rounded-lg bg-dark-gray border border-luxury-gold/15">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                <Clock className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-[#D0A511] font-bold mb-2">24 to 12 Hours Before Scheduled Pickup</h3>
                <p className="text-gray-600">
                  50% of the total reservation amount will be charged.
                </p>
              </div>
            </div>

            {/* Less than 12 hours */}
            <div className="flex gap-4 items-start p-6 rounded-lg bg-dark-gray border border-luxury-gold/15">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-red-500 font-bold mb-2">Less Than 12 Hours Before Scheduled Pickup</h3>
                <p className="text-gray-600">
                  100% of the total reservation amount will be charged. No refunds will be issued.
                </p>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="flex gap-4 items-start p-6 rounded-lg bg-dark-gray border border-luxury-gold/15">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                <FileText className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-[#D0A511] font-bold mb-2">Additional Terms</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                  <li>
                    Cancellation requests must be submitted by phone, email, or text message and confirmed by Fantastic Limo.
                  </li>
                  <li>
                    No-shows are considered late cancellations and are fully chargeable (100% reservation amount).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-luxury-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-gray-600 font-serif font-bold text-sm uppercase tracking-wider mb-1">
                Need to modify or cancel your booking?
              </p>
              <p className="text-xs text-gray-400">
                Contact our dispatch coordinates immediately.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="tel:+17786880333"
                className="flex items-center gap-2 px-4 py-2.5 rounded bg-luxury-gold text-white font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all duration-300"
                style={{ color: "#ffffff !important" }}
              >
                <Phone className="w-4 h-4" />
                +1 (778) 688-0333
              </a>
              <a
                href="mailto:info@fantasticlimo.ca"
                className="flex items-center gap-2 px-4 py-2.5 rounded border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 font-semibold text-xs uppercase tracking-wider transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                info@fantasticlimo.ca
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-12 pt-8 border-t border-luxury-gold/10">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
