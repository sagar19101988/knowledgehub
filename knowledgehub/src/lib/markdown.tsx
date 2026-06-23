import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ── Shared markdown renderer ──────────────────────────────────
// Single source of truth for compact body content (War Room answers,
// Mastery Trial explanations, analogies). Keeps body text identical
// across the app. Long-form lessons use the `prose` config instead.
export function makeMarkdownComponents(isDark: boolean) {
  return {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          style={isDark ? atomDark : oneLight}
          PreTag="div"
          customStyle={{ borderRadius: '0.75rem', fontSize: '0.8rem', margin: 0 }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`px-1.5 py-0.5 rounded text-[0.82em] font-mono ${
            isDark ? 'bg-slate-800 text-violet-300' : 'bg-slate-100 text-blue-700'
          }`}
          {...props}
        >
          {children}
        </code>
      );
    },
    p({ children }: any) {
      return (
        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {children}
        </p>
      );
    },
    strong({ children }: any) {
      return (
        <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {children}
        </strong>
      );
    },
    em({ children }: any) {
      return <em className={isDark ? 'text-slate-200' : 'text-slate-800'}>{children}</em>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-5 space-y-1.5">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-5 space-y-1.5">{children}</ol>;
    },
    li({ children }: any) {
      return (
        <li className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {children}
        </li>
      );
    },
    h2({ children }: any) {
      return (
        <h2 className={`text-sm font-bold mt-3 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {children}
        </h2>
      );
    },
    h3({ children }: any) {
      return (
        <h3 className={`text-sm font-bold mt-2 mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {children}
        </h3>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-2">
          <table className={`w-full text-xs border-collapse ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className={`border px-2 py-1 text-left font-bold ${
          isDark ? 'border-slate-700 bg-slate-800/60 text-slate-200' : 'border-slate-300 bg-slate-100 text-slate-800'
        }`}>
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className={`border px-2 py-1 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          {children}
        </td>
      );
    },
  };
}
