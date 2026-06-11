export default function BecomeAPartnerPage() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D0A511] mb-8 font-black tracking-wide">
          Become a Partner
        </h1>
        <div className="prose prose-invert prose-gold max-w-none">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Join FantasticLimo's global network of elite ground transportation providers. We are always looking to partner with premium fleet operators and professional chauffeurs who share our commitment to excellence, luxury, and impeccable service.
          </p>
          <h2 className="text-2xl font-serif text-[#D0A511] mt-12 mb-6">Why Partner With Us?</h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-300">
            <li>Access to a global clientele of high-net-worth individuals, executives, and VIPs.</li>
            <li>Consistent, high-quality trip volumes.</li>
            <li>Streamlined booking, dispatch, and payment processes.</li>
            <li>Dedicated partner support team.</li>
          </ul>

          <h2 className="text-2xl font-serif text-[#D0A511] mt-12 mb-6">Requirements</h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-300">
            <li>Immaculate luxury vehicles (Mercedes-Benz S-Class, V-Class, Cadillac Escalade, or equivalent).</li>
            <li>Professional, discreet, and fully licensed chauffeurs.</li>
            <li>Comprehensive commercial insurance coverage.</li>
            <li>Commitment to the highest standards of safety and customer service.</li>
          </ul>

          <div className="mt-16 p-8 border border-luxury-gold/20 bg-dark-gray rounded-xl">
            <h3 className="text-xl font-serif text-white mb-4">Ready to elevate your business?</h3>
            <p className="text-gray-400 mb-6">Contact our partner relations team to initiate the vetting and onboarding process.</p>
            <a href="mailto:partners@fantasticlimo.ca" className="inline-block bg-luxury-gold text-matte-black font-bold py-3 px-8 rounded-full hover:bg-soft-gold transition-colors duration-300">
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
