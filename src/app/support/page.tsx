'use client';
import { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, ChevronRight, Send } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import { supportService } from '@/services/support.service';
import toast from 'react-hot-toast';

const FAQ = [
  { q: 'How do I accept a new job request?',   a: 'Go to Jobs → New tab. Tap the job card to view details, then click "Accept Job" to confirm it.' },
  { q: 'When do I get paid?',                  a: 'Earnings are credited to your wallet after a job is marked complete. You can withdraw anytime (min ₹100).' },
  { q: 'How do I update my availability?',     a: 'Go to Schedule from the menu to set your working hours and mark holidays.' },
  { q: 'What if a customer cancels?',          a: 'If the customer cancels after you accepted, a cancellation fee may be charged to them which is shared with you.' },
  { q: 'How is my rating calculated?',         a: 'Your rating is the average of all customer reviews after completed jobs. Aim for 5★ on every job!' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await supportService.createTicket(form);
      toast.success('Support ticket created! We\'ll respond within 24 hours.');
      setForm({ subject: '', description: '' });
    } catch {
      toast.error('Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Help & Support" subtitle="We're here to help you succeed" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Quick contact */}
          <div className="grid grid-cols-2 gap-3">
            <a href="tel:1800-000-0000" className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-all text-center">
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                <Phone size={20} className="text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Call Support</p>
              <p className="text-xs text-gray-400">1800-000-0000</p>
            </a>
            <div className="card flex flex-col items-center gap-2 py-5 text-center">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Live Chat</p>
              <p className="text-xs text-gray-400">Mon–Sat, 9am–6pm</p>
            </div>
          </div>

          {/* Raise ticket */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Raise a Ticket</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Payment not received"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your issue in detail…"
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Submitting…' : <><Send size={16} /> Submit Ticket</>}
              </button>
            </div>
          </div>
        </div>

        {/* Right column — FAQ */}
        <div className="card h-fit">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQ.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-start justify-between w-full text-left px-4 py-3.5 gap-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">{f.q}</span>
                  <ChevronRight size={16} className={`shrink-0 text-gray-400 transition-transform mt-0.5 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 pt-3">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
