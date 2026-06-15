export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D0A511] mb-8 font-black tracking-wide">
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-gold max-w-none text-gray-300 space-y-6 leading-relaxed">
          <p>
            At FantasticLimo, we prioritize your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website or services.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, request a quote, book a service, or contact customer support. This may include your name, email address, phone number, payment information, and travel details.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services. This includes processing transactions, sending booking confirmations and updates, responding to your inquiries, and personalizing your experience.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">4. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
          </p>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-10 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns about our Privacy Policy or data processing practices, please contact us at privacy@fantasticlimo.ca.
          </p>
          
          <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-luxury-gold/10">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
