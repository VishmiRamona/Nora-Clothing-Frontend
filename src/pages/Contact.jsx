import { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('');
    try {
      await api.post('/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Error sending message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left column – Contact Form */}
          <div className="flex-1 p-8 md:p-12 bg-gray-50">
            <h2 className="text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
            <p className="text-gray-500 mb-6">We'd love to hear from you. Fill out the form and we'll get back to you within 2 days.</p>
            {status && (
              <div className={`mb-4 p-3 rounded ${status.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                id="contact-name"
                name="name"
                placeholder="Your Name"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                required
              />
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                required
              />
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right column – Contact Info */}
          <div className="flex-1 p-8 md:p-12 bg-teal text-white flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-6 opacity-90">Have a question or need help with your order? We're here to help.</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="opacity-90 break-all">support.noraonlineclothing@gmail.com</p>
              </div>
              <div>
                <h3 className="font-bold text-lg">Response Time</h3>
                <p className="opacity-90">Within 2 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}