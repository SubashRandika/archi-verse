import { MousePointerClick } from "lucide-react";
import { Fragment } from "react";
import type { ExplanationBlock, GlossaryTerm, ModuleMessage } from "@/content/modules";
import { cn } from "@/lib/utils";

/** Renders typed explanation blocks (ADR-0005). Block types live in `src/content/modules`. */
export function ExplanationBlocks({ blocks }: { blocks: readonly ExplanationBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ExplanationBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-reading text-paper/90">{block.text}</p>;

    case "list":
      return (
        <ul className="flex flex-col gap-2 text-reading text-paper/90">
          {block.items.map((item, index) => (
            <li key={index} className="relative pl-4">
              <span
                aria-hidden="true"
                className="absolute top-[0.7em] left-0 size-1 rounded-full bg-graphite"
              />
              {item.term && <span className="font-medium text-paper">{item.term}: </span>}
              {item.text}
            </li>
          ))}
        </ul>
      );

    case "code":
      return <CodeFigure caption={block.caption} language={block.language} lines={block.lines} />;

    case "callout":
      return (
        <p className="flex gap-2.5 rounded-md border border-rule bg-hull-raised/60 px-3 py-2.5 text-caption text-paper/85">
          <MousePointerClick aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-graphite" />
          <span>{block.text}</span>
        </p>
      );

    case "table":
      return (
        <figure className="overflow-hidden rounded-md border border-rule">
          <table className="w-full text-caption">
            <caption className="border-b border-rule bg-hull-raised px-3 py-1.5 text-left text-label text-graphite">
              {block.caption}
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">{block.columns[0]}</th>
                <th scope="col">{block.columns[1]}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([label, value]) => (
                <tr key={label} className="border-b border-rule last:border-b-0">
                  <th scope="row" className="px-3 py-1.5 text-left font-normal text-paper/90">
                    {label}
                  </th>
                  <td className="px-3 py-1.5 text-right whitespace-nowrap text-paper tabular-nums">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
            {block.footer && (
              <tfoot className="border-t border-rule-strong bg-hull-raised">
                <tr>
                  <th scope="row" className="px-3 py-1.5 text-left font-medium text-paper">
                    {block.footer[0]}
                  </th>
                  <td className="px-3 py-1.5 text-right font-medium text-paper tabular-nums">
                    {block.footer[1]}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </figure>
      );
  }
}

/** A message (HTTP or SQL) as a captioned code figure. */
export function MessageFigure({
  message,
  highlighted = false,
}: {
  message: ModuleMessage;
  highlighted?: boolean;
}) {
  return (
    <CodeFigure
      caption={message.caption}
      language={message.language}
      lines={message.lines}
      highlighted={highlighted}
    />
  );
}

function CodeFigure({
  caption,
  language,
  lines,
  highlighted = false,
}: {
  caption: string;
  language: "http" | "sql" | "json";
  lines: readonly string[];
  highlighted?: boolean;
}) {
  const bodyStart = language === "http" ? lines.indexOf("") : -1;
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-md border bg-hull-raised transition-colors",
        highlighted ? "border-flow-selection" : "border-rule",
      )}
    >
      <figcaption className="border-b border-rule px-3 py-1.5 text-label text-graphite">
        {caption}
      </figcaption>
      {/* Focusable so keyboard users can scroll long lines (WCAG 2.1.1). */}
      <pre
        tabIndex={0}
        className="overflow-x-auto px-3 py-2.5 font-mono text-[0.78rem] leading-relaxed text-paper focus-visible:outline-offset-[-2px]"
      >
        <code>
          {lines.map((line, index) => (
            <Fragment key={index}>
              {language === "http" ? (
                <HttpLine
                  line={line}
                  isStartLine={index === 0}
                  isBody={bodyStart !== -1 && index > bodyStart}
                />
              ) : (
                line
              )}
              {"\n"}
            </Fragment>
          ))}
        </code>
      </pre>
    </figure>
  );
}

const HEADER_LINE = /^(:?[A-Za-z][\w-]*):(\s?)(.*)$/;
const STATUS_LINE = /^(HTTP\/[\d.]+) (\d{3})(.*)$/;

/**
 * Minimal HTTP highlighting, with colour meaning only: the request method in the request
 * colour, a status line in the response colour (2xx/3xx) or the error colour (4xx/5xx),
 * header names in graphite.
 */
function HttpLine({
  line,
  isStartLine,
  isBody,
}: {
  line: string;
  isStartLine: boolean;
  isBody: boolean;
}) {
  if (isBody) return <>{line}</>;
  if (isStartLine) {
    const status = STATUS_LINE.exec(line);
    if (status) {
      const [, version, code = "", reason] = status;
      const failed = Number(code) >= 400;
      return (
        <>
          <span className="text-graphite">{version} </span>
          <span className={cn("font-medium", failed ? "text-flow-error" : "text-flow-response")}>
            {code}
            {reason}
          </span>
        </>
      );
    }
    const [method = "", ...rest] = line.split(" ");
    return (
      <>
        <span className="font-medium text-flow-request">{method}</span> {rest.join(" ")}
      </>
    );
  }
  const header = HEADER_LINE.exec(line);
  if (!header) return <>{line}</>;
  const [, name, space, value] = header;
  return (
    <>
      <span className="text-graphite">
        {name}:{space}
      </span>
      {value}
    </>
  );
}

export function TermList({ terms }: { terms: readonly GlossaryTerm[] }) {
  if (terms.length === 0) return null;
  return (
    <section aria-label="Terms" className="border-t border-rule pt-4">
      <h3 className="mb-2.5 text-caption font-medium text-graphite">Terms in this step</h3>
      <dl className="flex flex-col gap-2.5">
        {terms.map((entry) => (
          <div key={entry.term}>
            <dt className="text-caption font-medium text-paper">{entry.term}</dt>
            <dd className="text-caption text-graphite">{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
