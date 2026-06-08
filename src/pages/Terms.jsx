const SECTIONS = [
  {
    title: '1. Using Our Site',
    text: 'By browsing or placing an order on Nora Clothing, you agree to use the site only for lawful purposes and in a way that does not infringe the rights of, or restrict or inhibit the use of, this site by anyone else.',
  },
  {
    title: '2. Orders & Payment',
    text: 'All orders are subject to availability and confirmation. Prices are listed in USD and may change without notice. Payment is processed securely at checkout, and your order is confirmed once payment has been authorized.',
  },
  {
    title: '3. Shipping & Returns',
    text: 'Estimated delivery times are provided at checkout and may vary by location. If you are not satisfied with your purchase, please refer to our returns policy or contact our support team for assistance.',
  },
  {
    title: '4. Account Responsibility',
    text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.',
  },
  {
    title: '5. Changes to These Terms',
    text: 'We may update these terms from time to time. Continued use of the site after changes are posted constitutes your acceptance of the revised terms.',
  },
];

export default function Terms() {
  return (
    <div className="bg-beige">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Terms of Service</h1>
        <p className="text-teal text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-md border border-skyblue/60 p-6 md:p-10 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-navy mb-2">{s.title}</h2>
              <p className="text-sm text-teal leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
