import { useRef, useState, useCallback } from 'react';
import { X, Image, FileText, Loader2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuestStore } from '../store/useQuestStore';

// ── Certificate dimensions (A4 landscape) ─────────────────────
const CERT_W = 1414;
const CERT_H = 1000;

// ── Zone colour themes — accent only, white background ────────
const CERT_THEMES: Record<string, { accent: string; accent2: string; accentDark: string }> = {
  manual:     { accent: '#f97316', accent2: '#fbbf24', accentDark: '#c2410c' },
  sql:        { accent: '#3b82f6', accent2: '#60a5fa', accentDark: '#1d4ed8' },
  api:        { accent: '#a855f7', accent2: '#c084fc', accentDark: '#7e22ce' },
  typescript: { accent: '#0ea5e9', accent2: '#38bdf8', accentDark: '#0369a1' },
  playwright: { accent: '#10b981', accent2: '#34d399', accentDark: '#047857' },
  'ai-qa':    { accent: '#f43f5e', accent2: '#fb7185', accentDark: '#be123c' },
};

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Certificate card — premium white enterprise design ────────
function CertCard({ name, zoneName, zoneId, date }: {
  name: string; zoneName: string; zoneId: string; date: string;
}) {
  const t = CERT_THEMES[zoneId] ?? CERT_THEMES['manual'];

  return (
    <div style={{
      width: CERT_W, height: CERT_H,
      position: 'relative', overflow: 'hidden',
      background: '#ffffff',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>

      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(90deg, ${t.accentDark}, ${t.accent}, ${t.accent2}, ${t.accent}, ${t.accentDark})` }} />
      {/* Bottom accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: `linear-gradient(90deg, ${t.accentDark}, ${t.accent}, ${t.accent2}, ${t.accent}, ${t.accentDark})` }} />

      {/* Outer frame */}
      <div style={{ position: 'absolute', inset: 20, border: `1px solid #e2e8f0`, pointerEvents: 'none' }} />
      {/* Inner frame */}
      <div style={{ position: 'absolute', inset: 26, border: `1px solid ${t.accent}22`, pointerEvents: 'none' }} />

      {/* Corner ornaments */}
      {([
        { top: 20,    left: 20,    borderTop: `3px solid ${t.accent}`, borderLeft:  `3px solid ${t.accent}` },
        { top: 20,    right: 20,   borderTop: `3px solid ${t.accent}`, borderRight: `3px solid ${t.accent}` },
        { bottom: 20, left: 20,    borderBottom: `3px solid ${t.accent}`, borderLeft:  `3px solid ${t.accent}` },
        { bottom: 20, right: 20,   borderBottom: `3px solid ${t.accent}`, borderRight: `3px solid ${t.accent}` },
      ] as React.CSSProperties[]).map((style, i) => (
        <div key={i} style={{ position: 'absolute', width: 44, height: 44, ...style }} />
      ))}

      {/* Large faint watermark ✦ */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 560, lineHeight: 1,
        color: t.accent, opacity: 0.028,
        userSelect: 'none', pointerEvents: 'none',
        fontFamily: 'Arial, sans-serif',
      }}>✦</div>

      {/* ── Three-section layout ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        padding: '44px 100px 44px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        justifyContent: 'space-between',
      }}>

        {/* ── TOP: prominent brand lockup ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Thin top rule with star */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}88)` }} />
            <div style={{ fontSize: 14, color: t.accent, fontFamily: 'Arial' }}>✦</div>
            <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, ${t.accent}88, transparent)` }} />
          </div>

          {/* QA QUEST — the wordmark, dominant */}
          <div style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 52, fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#0f172a',
            lineHeight: 1,
            paddingLeft: '0.22em', // optical balance with letter-spacing
          }}>
            QAVeda
          </div>

          {/* Tagline framed by accent rules */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <div style={{ width: 60, height: 2, background: t.accent, borderRadius: 1 }} />
            <div style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 12, fontWeight: 800, letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: t.accentDark,
              paddingLeft: '0.42em',
            }}>
              Master the craft.
            </div>
            <div style={{ width: 60, height: 2, background: t.accent, borderRadius: 1 }} />
          </div>
        </div>

        {/* ── MIDDLE: core certificate content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Heraldic crest — central medallion with flanking ornaments */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 18, marginBottom: 22,
          }}>
            {/* Left ornament */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              <div style={{ width: 56, height: 1.5, background: t.accent, opacity: 0.7 }} />
              <div style={{ width: 38, height: 1.5, background: t.accent, opacity: 0.45 }} />
              <div style={{ width: 56, height: 1.5, background: t.accent, opacity: 0.7 }} />
            </div>

            {/* Central medallion */}
            <div style={{
              width: 92, height: 92, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.accent2}, ${t.accent}, ${t.accentDark})`,
              border: '3px solid #fff',
              boxShadow: `0 0 0 2px ${t.accent}, 0 6px 22px ${t.accent}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <div style={{ fontSize: 38, lineHeight: 1, fontFamily: 'Arial' }}>✦</div>
            </div>

            {/* Right ornament */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
              <div style={{ width: 56, height: 1.5, background: t.accent, opacity: 0.7 }} />
              <div style={{ width: 38, height: 1.5, background: t.accent, opacity: 0.45 }} />
              <div style={{ width: 56, height: 1.5, background: t.accent, opacity: 0.7 }} />
            </div>
          </div>

          {/* "CERTIFICATE OF MASTERY" label */}
          <div style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.38em',
            textTransform: 'uppercase', color: '#94a3b8',
          }}>
            Certificate of Mastery
          </div>

          {/* Recipient name — the hero element */}
          <div style={{
            marginTop: 18,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 106, fontWeight: 400, lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#0f172a',
          }}>
            {name || 'Your Name'}
          </div>

          {/* Name underline */}
          <div style={{
            width: '62%', height: 2, marginTop: 18,
            background: `linear-gradient(90deg, transparent, ${t.accent}99, transparent)`,
            borderRadius: 1,
          }} />

          {/* Body copy */}
          <div style={{
            marginTop: 22,
            fontFamily: 'Arial, sans-serif',
            fontSize: 16, color: '#64748b',
            letterSpacing: '0.015em', lineHeight: 1.6,
          }}>
            has demonstrated verified mastery of
          </div>

          {/* Zone name */}
          <div style={{
            marginTop: 10,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 54, fontWeight: 700, letterSpacing: '0.02em',
            color: t.accent,
          }}>
            {zoneName}
          </div>

          {/* Sub-copy */}
          <div style={{
            marginTop: 14,
            fontFamily: 'Arial, sans-serif',
            fontSize: 13, color: '#94a3b8', letterSpacing: '0.04em',
          }}>
            by passing the Mastery Trial on QAVeda
          </div>
        </div>

        {/* ── BOTTOM: footer ── */}
        <div style={{ width: '100%' }}>
          <div style={{ width: '100%', height: 1, background: '#e2e8f0', marginBottom: 22 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Date */}
            <div style={{ textAlign: 'left', minWidth: 200 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 700, color: '#1e293b' }}>{date}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', marginTop: 5 }}>Date of Completion</div>
            </div>

            {/* Seal */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: `linear-gradient(145deg, ${t.accent2}, ${t.accent}, ${t.accentDark})`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: `0 4px 20px ${t.accent}44`,
              border: `3px solid ${t.accent2}`,
            }}>
              <div style={{ fontSize: 26, lineHeight: 1, fontFamily: 'Arial' }}>✦</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 7.5, fontWeight: 900, letterSpacing: '0.2em', marginTop: 5 }}>MASTERED</div>
            </div>

            {/* Issued by */}
            <div style={{ textAlign: 'right', minWidth: 200 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 600, color: '#1e293b' }}>QAVeda</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', marginTop: 5 }}>Issued By</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
interface CertificateModalProps {
  zoneId: string;
  zoneName: string;
  /** Date the user actually passed the Mastery Trial. Falls back to today. */
  completionDate?: Date;
  onClose: () => void;
}

export function CertificateModal({ zoneId, zoneName, completionDate, onClose }: CertificateModalProps) {
  const navigate   = useNavigate();
  const playerName = useQuestStore(s => s.playerName);
  const isGuest    = useQuestStore(s => s.isGuest);
  const isDark     = useQuestStore(s => s.theme) === 'dark';

  const [name, setName]               = useState(playerName ?? '');
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null);
  const [dlError, setDlError]         = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const date = formatDate(completionDate ?? new Date());

  const slug = zoneName.replace(/\s+/g, '-');

  const getDataUrl = useCallback(async (format: 'png' | 'jpeg') => {
    const el = certRef.current;
    if (!el) throw new Error('Certificate element not found in DOM');
    await document.fonts.ready;
    const { toPng, toJpeg } = await import('html-to-image');
    const opts = { pixelRatio: 2, width: CERT_W, height: CERT_H, skipAutoScale: true };
    return format === 'png' ? toPng(el, opts) : toJpeg(el, { ...opts, quality: 0.95 });
  }, []);

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPng = async () => {
    setDlError(null);
    setDownloading('png');
    try {
      const dataUrl = await getDataUrl('png');
      triggerDownload(dataUrl, `QAQuest-${slug}-Certificate.png`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Certificate] PNG download failed:', err);
      setDlError(`PNG failed: ${msg}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadPdf = async () => {
    setDlError(null);
    setDownloading('pdf');
    try {
      const dataUrl = await getDataUrl('jpeg');
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 297, 210);
      pdf.save(`QAQuest-${slug}-Certificate.pdf`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Certificate] PDF download failed:', err);
      setDlError(`PDF failed: ${msg}`);
    } finally {
      setDownloading(null);
    }
  };

  // Scale for the in-modal preview — target ~580px preview width inside a max-w-2xl modal
  const PREVIEW_W = 580;
  const PREVIEW_SCALE = PREVIEW_W / CERT_W;
  const PREVIEW_H = Math.round(CERT_H * PREVIEW_SCALE);

  return (
    <>
      {/* Modal overlay */}
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl rounded-2xl border"
          style={{
            background: isDark ? '#0d0b1a' : '#fff',
            borderColor: isDark ? 'rgba(139,92,246,0.3)' : '#e2e8f0',
            boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.7)' : '0 20px 60px rgba(0,0,0,0.15)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-4">
            <div>
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Your Certificate
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {zoneName} · Mastery Trial
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-5 pb-5 space-y-4">

            {/* Guest gate */}
            {isGuest ? (
              <div className="text-center py-8 space-y-3">
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Sign in to download your certificate.
                </p>
                <button
                  onClick={() => { onClose(); navigate('/login'); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-black transition"
                >
                  <LogIn size={15} /> Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Name input */}
                <div>
                  <label className={`text-[11px] font-bold uppercase tracking-widest block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Your name on the certificate
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium outline-none transition ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700 text-white placeholder-slate-500 focus:border-violet-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-400'
                    }`}
                  />
                </div>

                {/* Certificate preview */}
                <div
                  className="rounded-xl overflow-hidden mx-auto"
                  style={{ width: PREVIEW_W, height: PREVIEW_H }}
                >
                  <div style={{
                    width: CERT_W,
                    height: CERT_H,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                  }}>
                    <CertCard name={name} zoneName={zoneName} zoneId={zoneId} date={date} />
                  </div>
                </div>

                {/* Error message */}
                {dlError && (
                  <p className="text-xs text-rose-400 font-semibold text-center">{dlError}</p>
                )}

                {/* Download buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={downloadPng}
                    disabled={!!downloading || !name.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                  >
                    {downloading === 'png'
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Image size={16} />}
                    Download PNG
                  </button>
                  <button
                    onClick={downloadPdf}
                    disabled={!!downloading || !name.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                  >
                    {downloading === 'pdf'
                      ? <Loader2 size={16} className="animate-spin" />
                      : <FileText size={16} />}
                    Download PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden full-resolution certificate for html2canvas capture */}
      <div style={{ position: 'absolute', left: -9999, top: 0, width: CERT_W, height: CERT_H, overflow: 'hidden', pointerEvents: 'none' }}>
        <div ref={certRef}>
          <CertCard name={name || playerName || 'Your Name'} zoneName={zoneName} zoneId={zoneId} date={date} />
        </div>
      </div>
    </>
  );
}
