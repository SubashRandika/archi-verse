import { MousePointerClick } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Typed explanation blocks (ADR-0005). Phase 2 defines the rendering; Phase 5 moves the
 * block types into `src/content` with Zod schemas.
 */
export type ExplanationBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly { term?: string; text: string }[] }
  | { type: "http"; caption: string; lines: readonly string[] }
  | { type: "callout"; text: string }
  | { type: "terms"; terms: readonly { term: string; definition: string }[] };

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

    case "http":
      return (
        <figure className="overflow-hidden rounded-md border border-rule bg-hull-raised">
          <figcaption className="border-b border-rule px-3 py-1.5 text-label text-graphite">
            {block.caption}
          </figcaption>
          {/* Focusable so keyboard users can scroll long header lines (WCAG 2.1.1). */}
          <pre
            tabIndex={0}
            className="overflow-x-auto px-3 py-2.5 font-mono text-[0.78rem] leading-relaxed focus-visible:outline-offset-[-2px]"
          >
            <code>
              {block.lines.map((line, index) => (
                <Fragment key={index}>
                  <HttpLine line={line} isStartLine={index === 0} />
                  {"\n"}
                </Fragment>
              ))}
            </code>
          </pre>
        </figure>
      );

    case "callout":
      return (
        <p className="flex gap-2.5 rounded-md border border-rule bg-hull-raised/60 px-3 py-2.5 text-caption text-paper/85">
          <MousePointerClick aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-graphite" />
          <span>{block.text}</span>
        </p>
      );

    case "terms":
      return (
        <section aria-label="Terms" className="border-t border-rule pt-4">
          <h3 className="mb-2.5 text-caption font-medium text-graphite">Terms in this step</h3>
          <dl className="flex flex-col gap-2.5">
            {block.terms.map((entry) => (
              <div key={entry.term}>
                <dt className="text-caption font-medium text-paper">{entry.term}</dt>
                <dd className="text-caption text-graphite">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
  }
}

const HEADER_LINE = /^(:?[A-Za-z][\w-]*):(\s?)(.*)$/;

/**
 * Minimal HTTP highlighting: the method is tinted with the request colour (colour = meaning),
 * header names are graphite, values are paper.
 */
function HttpLine({ line, isStartLine }: { line: string; isStartLine: boolean }) {
  const header = isStartLine ? null : HEADER_LINE.exec(line);
  if (header) {
    const [, name, space, value] = header;
    return (
      <>
        <span className="text-graphite">
          {name}:{space}
        </span>
        <span className="text-paper">{value}</span>
      </>
    );
  }
  const [method = "", ...rest] = line.split(" ");
  return (
    <>
      <span className={cn("font-medium text-flow-request")}>{method}</span>
      <span className="text-paper"> {rest.join(" ")}</span>
    </>
  );
}
