import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ModalKind = 'privacy' | 'terms' | 'contact' | null;

const MODAL_TITLES: Record<Exclude<ModalKind, null>, string> = {
  privacy: 'Privacy Policy',
  terms:   'Terms of Use',
  contact: 'Contact',
};

export default function Footer() {
  const [open, setOpen] = useState<ModalKind>(null);

  return (
    <>
      <footer className="mt-auto py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200/60 dark:border-white/5 bg-slate-50/40 dark:bg-transparent">
        <p className="mb-2">
          © 2026 QA Quest · Built for testers who break things on purpose.
        </p>
        <div className="flex items-center justify-center gap-3">
          <FooterLink onClick={() => setOpen('privacy')}>Privacy</FooterLink>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <FooterLink onClick={() => setOpen('terms')}>Terms</FooterLink>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <FooterLink onClick={() => setOpen('contact')}>Contact</FooterLink>
        </div>
      </footer>

      <AnimatePresence>
        {open && (
          <FooterModal kind={open} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function FooterLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors underline-offset-2 hover:underline"
    >
      {children}
    </button>
  );
}

function FooterModal({ kind, onClose }: { kind: Exclude<ModalKind, null>; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 text-slate-700 dark:text-slate-300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 pr-8">
          {MODAL_TITLES[kind]}
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          {kind === 'privacy' && <PrivacyContent />}
          {kind === 'terms'   && <TermsContent />}
          {kind === 'contact' && <ContactContent />}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PrivacyContent() {
  return (
    <>
      <p>
        QA Quest is a learning platform built for QA professionals. We respect your privacy and only collect what's needed to make the app work.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">What we store:</strong> your display name, email address, and your learning progress (XP, completed modules, badges). This is stored in Google Firebase under your account.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">What we don't do:</strong> we don't sell your data, share it with advertisers, or send marketing emails. Your progress is yours.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Authentication:</strong> sign-in is handled by Google Firebase Auth. If you sign in with Google, we receive your basic profile info (name, email, profile picture) — nothing more.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Cookies & local storage:</strong> we use browser storage to keep you signed in and to cache your progress for a faster experience. No third-party tracking cookies.
      </p>
      <p>
        Want your data deleted? Use the Contact link below to reach out.
      </p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p>
        Welcome to QA Quest. By using this app, you agree to the following:
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Use it to learn.</strong> The lessons, quizzes, and rank system are here to help you grow as a QA professional. Don't try to game the XP system, scrape the content, or use the platform for anything illegal.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Content.</strong> All lesson content, quiz questions, branding, and copy on QA Quest are the property of QA Quest and may not be reproduced or redistributed without permission.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">No warranty.</strong> QA Quest is provided as-is. While we work hard to keep things accurate and the app online, we can't guarantee zero downtime, zero bugs, or perfect content. Spotted something wrong? Tell us via Contact.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Account.</strong> You're responsible for keeping your login credentials safe. Don't share your account.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Changes.</strong> These terms may be updated as the app evolves. Continued use means you accept the latest version.
      </p>
    </>
  );
}

function ContactContent() {
  return (
    <>
      <p>
        Got a question, found a bug, or want to suggest a feature? We'd love to hear from you.
      </p>
      <p>
        <strong className="text-slate-900 dark:text-white">Email:</strong>{' '}
        <a href="mailto:connect_qaquest@gmail.com" className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline">
          connect_qaquest@gmail.com
        </a>
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        We aim to reply to every genuine query — please be patient if it takes us a day or two.
      </p>
    </>
  );
}
