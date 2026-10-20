import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, phone number, and message.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSubmitted(true);
      showToast('Thank you! Your message has been received by our management.', 'success');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting message. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          We Are Here To Serve You
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Contact Saadaat Kitchen
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Have an inquiry, catering request, or feedback? Get in touch with our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-6">
            <h2 className="text-xl font-display font-bold text-white">
              Send Us a Direct Message
            </h2>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Thank you! Your message has been logged in our kitchen management system. We will call you back shortly.
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Asad Ali"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Food Order Status">Food Order Status</option>
                    <option value="Event / Bulk Catering">Event / Bulk Catering</option>
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we assist you with our menu or services?"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Direct Channels & Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-6">
            <h2 className="text-xl font-display font-bold text-white">
              Direct Contact Details
            </h2>

            <div className="space-y-5 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-zinc-500 font-medium block">Phone Support</span>
                  <a href="tel:+923710238821" className="text-sm font-bold text-white hover:text-amber-400">
                    +92 371 0238821
                  </a>
                  <span className="text-zinc-400 block text-[11px] mt-0.5">Available for orders & delivery inquiries</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-zinc-500 font-medium block">WhatsApp Direct Link</span>
                  <a
                    href="https://wa.me/923710238821"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-400 hover:underline"
                  >
                    https://wa.me/923710238821
                  </a>
                  <span className="text-zinc-400 block text-[11px] mt-0.5">Instant chat & order confirmation</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-zinc-500 font-medium block">Kitchen Operating Hours</span>
                  <span className="text-sm font-bold text-white">
                    4:00 PM – 2:00 AM (Mon - Sun)
                  </span>
                  <span className="text-zinc-400 block text-[11px] mt-0.5">Late night dinner & midnight delivery</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-zinc-500 font-medium block">Restaurant Address</span>
                  <span className="text-sm font-bold text-white">
                    Saadaat Kitchen, Main Food Street, Karachi, Pakistan
                  </span>
                  <span className="text-zinc-400 block text-[11px] mt-0.5">Dine-in, takeaway counters, and doorstep riders</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
