const SECTIONS = [
  {
    title: '1. Information We Collect',
    text: 'When you create an account, place an order, or contact us, we collect information such as your name, email address, shipping details, and order history so we can fulfill and support your purchases.',
  },
  {
    title: '2. How We Use Your Information',
    text: 'We use your information to process orders, provide customer support, send order updates, and — where you have opted in — share news about new arrivals and promotions.',
  },
  {
    title: '3. Cookies',
    text: 'We use cookies and similar technologies to keep you signed in, remember items in your cart and wishlist, and understand how our site is used so we can keep improving it.',
  },
  {
    title: '4. Sharing Your Information',
    text: 'We do not sell your personal information. We share data only with trusted service providers (such as payment and shipping partners) to the extent necessary to fulfill your order.',
  },
  {
    title: '5. Your Choices',
    text: 'You can review and update your account details at any time from your profile, unsubscribe from marketing emails, and contact us to request that your data be deleted.',
  },
];

export default function Privacy() {
  return (
    <div className="bg-beige">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Privacy Policy</h1>
        <p className="text-teal text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-md border border-skyblue/60 p-6 md:p-10 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-navy mb-2">{s.title}</h2>
              <p className="text-sm text-teal leading-relaxed">{s.text}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-skyblue/40">
            <p className="text-sm text-teal leading-relaxed">
              Questions about your data? Reach out any time at{' '}
              <a href="mailto:support@noraclothing.com" className="text-navy font-medium hover:underline">support@noraclothing.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
