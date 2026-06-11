export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D0A511] mb-8 font-black tracking-wide">
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-gold max-w-none text-gray-300 space-y-6 leading-relaxed">
          <p>
            Welcome to FantasticLimo. By accessing or using our website and services, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before booking any services.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">1. Booking and Reservations</h2>
          <p>
            All reservations are subject to availability. A valid credit card is required to secure a booking. FantasticLimo reserves the right to cancel any reservation that does not meet our booking criteria or payment requirements.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">2. Cancellations and Modifications</h2>
          <p>
            Cancellations must be made within the specified timeframe outlined during the booking process. Failure to cancel within this window may result in a cancellation fee. Modifications to reservations are subject to availability and may incur additional charges.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">3. Passenger Conduct</h2>
          <p>
            FantasticLimo is committed to providing a safe and comfortable environment. We strictly prohibit smoking, illegal substance use, and any disruptive behavior in our vehicles. The chauffeur reserves the right to terminate the service if passenger conduct violates these terms.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">4. Liability</h2>
          <p>
            While we strive for perfection, FantasticLimo is not liable for circumstances beyond our control, including but not limited to severe weather, road closures, traffic delays, or vehicle breakdowns. In such events, we will make every effort to provide alternative arrangements.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">5. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which FantasticLimo primarily operates.
          </p>

          <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-luxury-gold/10">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
