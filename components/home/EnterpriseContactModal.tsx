"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";

interface EnterpriseContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EnterpriseContactModal({
  open,
  onClose,
}: EnterpriseContactModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0b1220] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-800 bg-[#0b1220]/95 px-5 py-5 backdrop-blur-md sm:px-7">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close contact form"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-4 pr-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-800/60 bg-sky-950/40">
              <Building2 className="h-5 w-5 text-sky-400" />
            </div>

            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">
                <span>Enterprise</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Talk to our team
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Tell us about your organization and what you need from
                DevReview AI.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="enterprise-name"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Full name <span className="text-sky-400">*</span>
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    id="enterprise-name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Smith"
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="enterprise-email"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Work email <span className="text-sky-400">*</span>
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    id="enterprise-email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="enterprise-company"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Company / Organization{" "}
                  <span className="text-sky-400">*</span>
                </label>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    id="enterprise-company"
                    name="company"
                    type="text"
                    required
                    placeholder="Acme Inc."
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              </div>

              {/* Job title */}
              <div>
                <label
                  htmlFor="enterprise-job-title"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Job title
                </label>

                <input
                  id="enterprise-job-title"
                  name="jobTitle"
                  type="text"
                  placeholder="Engineering Manager"
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                />
              </div>

              {/* Team size */}
              <div>
                <label
                  htmlFor="enterprise-team-size"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Team size
                </label>

                <select
                  id="enterprise-team-size"
                  name="teamSize"
                  defaultValue=""
                  className="h-11 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 outline-none transition-all focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                >
                  <option value="" disabled>
                    Select team size
                  </option>
                  <option value="1-10">1–10 developers</option>
                  <option value="11-50">11–50 developers</option>
                  <option value="51-200">51–200 developers</option>
                  <option value="201-500">201–500 developers</option>
                  <option value="500+">500+ developers</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="enterprise-phone"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Phone number
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    id="enterprise-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label
                htmlFor="enterprise-topic"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                What can we help with?{" "}
                <span className="text-sky-400">*</span>
              </label>

              <select
                id="enterprise-topic"
                name="topic"
                defaultValue=""
                required
                className="h-11 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 outline-none transition-all focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="enterprise-plan">
                  Enterprise plan
                </option>
                <option value="security">
                  Security & compliance
                </option>
                <option value="on-premise">
                  On-premise deployment
                </option>
                <option value="custom-integration">
                  Custom integration
                </option>
                <option value="other">
                  Something else
                </option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="enterprise-message"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Tell us about your requirements{" "}
                <span className="text-sky-400">*</span>
              </label>

              <div className="relative">
                <MessageSquare className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-600" />

                <textarea
                  id="enterprise-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your team, repository size, security requirements, deployment needs, or anything else we should know..."
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm leading-6 text-white outline-none transition-all placeholder:text-slate-700 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-slate-800 pt-5">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-lg shadow-sky-950/30 transition-all hover:bg-sky-500 hover:shadow-sky-900/30"
              >
                <Send className="h-4 w-4" />
                Send Request
              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-slate-600">
                We'll use the information you provide to respond to your
                enterprise inquiry.
              </p>
            </div>
          </form>
        ) : (
          /* Success */
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-800/60 bg-emerald-950/40">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Thanks for reaching out!
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              We've received your enterprise inquiry. Our team will review
              your requirements and get back to you.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-7 rounded-xl border border-slate-700 bg-slate-900 px-6 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}