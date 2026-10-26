"use client";

import { useState } from "react";
import styles from "./code.module.css";

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "from", "export",
  "default", "new", "true", "false", "null", "undefined", "async", "await", "typeof", "useEffect",
]);

type Token = { text: string; kind?: "keyword" | "string" | "number" | "fn" | "comment" | "punct" };

/** Just enough highlighting for short snippets of JavaScript: keywords, calls, strings, numbers, comments. */
function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\];,.=<>+\-*/!?:&|]+)|(\s+)/g;
  let match: RegExpExecArray | null;
  let last = 0;
  while ((match = pattern.exec(line))) {
    if (match.index > last) tokens.push({ text: line.slice(last, match.index) });
    const [text, comment, string, number, word, punct] = match;
    if (comment) tokens.push({ text, kind: "comment" });
    else if (string) tokens.push({ text, kind: "string" });
    else if (number) tokens.push({ text, kind: "number" });
    else if (word) {
      const called = line[pattern.lastIndex] === "(";
      tokens.push({ text, kind: KEYWORDS.has(word) ? "keyword" : called ? "fn" : undefined });
    }
    else if (punct) tokens.push({ text, kind: "punct" });
    else tokens.push({ text });
    last = pattern.lastIndex;
  }
  if (last < line.length) tokens.push({ text: line.slice(last) });
  return tokens;
}

/** A code snippet with line numbers, quiet syntax colours and a copy button. */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className={styles.block}>
      <button type="button" className={styles.copy} onClick={copy} aria-label="Copy code">
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={styles.pre}>
        <code>
          {lines.map((line, index) => (
            <span key={index} className={styles.line}>
              <span className={styles.gutter} aria-hidden="true">
                {index + 1}
              </span>
              <span>
                {tokenize(line).map((token, i) => (
                  <span key={i} className={token.kind ? styles[token.kind] : undefined}>
                    {token.text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
