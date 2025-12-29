/* eslint-disable unused-imports/no-unused-vars */
import { Wrapper } from "@/components/core/layout/wrapper";
import type { LegalItem, LegalMeta } from "@/lib/legal-documents";

type LegalDocumentProperties = {
  meta: LegalMeta;
  intro?: string[];
  items: LegalItem[];
};

const toId = (value: string) => {
  const base = value
    .toLowerCase()
    .replaceAll(/\([^)]*\)/g, "")
    .replaceAll(/[^\da-z]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");

  return base || "section";
};

const splitParagraphs = (text: string) => {
  return text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LegalDocument = ({ meta, intro = [], items }: LegalDocumentProperties) => {
  const toc = items.map((item) => ({ id: toId(item.title), title: item.title }));

  return (
    <section className="bg-slate-50/60">
      <Wrapper width="max-w-7xl" className="my-0 gap-6 py-10 sm:py-14">
        {/* <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">{meta.companyName}</p>
              <h2 className="text-foreground mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                {meta.platformName}
              </h2>
              {meta.effectiveDate ? (
                <p className="text-muted-foreground mt-1 text-sm">Effective date: {meta.effectiveDate}</p>
              ) : null}
            </div>

            <div className="text-muted-foreground flex flex-col gap-1 text-sm">
              {meta.address ? <p>{meta.address}</p> : null}
              {meta.phone ? <p>Tel: {meta.phone}</p> : null}
              {meta.platformUrl ? (
                <p>
                  Platform:{" "}
                  <a className="underline underline-offset-4" href={meta.platformUrl}>
                    {meta.platformUrl}
                  </a>
                </p>
              ) : null}
              {meta.website ? (
                <p>
                  Website:{" "}
                  <a className="underline underline-offset-4" href={meta.website}>
                    {meta.website}
                  </a>
                </p>
              ) : null}
              {meta.contactEmail ? (
                <p>
                  Email:{" "}
                  <a className="underline underline-offset-4" href={`mailto:${meta.contactEmail}`}>
                    {meta.contactEmail}
                  </a>
                </p>
              ) : null}
              {meta.downloadPath ? (
                <p>
                  Download:{" "}
                  <a className="underline underline-offset-4" href={meta.downloadPath} target="_blank" rel="noreferrer">
                    {meta.downloadPath}
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          {intro.length > 0 ? (
            <div className="prose prose-slate prose-p:leading-relaxed mt-5 max-w-none">
              {intro.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
          ) : null}
        </div> */}

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-30 rounded-2xl border bg-white p-4 shadow-sm">
              <p className="!text-primary text-sm !font-semibold">On this page</p>
              <nav className="mt-3 flex flex-col gap-2">
                {toc.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    {entry.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="prose prose-slate prose-headings:scroll-mt-24 prose-p:leading-relaxed max-w-none">
              {items.map((item) => {
                const paragraphs = splitParagraphs(item.text);
                const id = toId(item.title);

                return (
                  <section key={id} id={id} className="mb-8 scroll-mt-24 gap-4">
                    <h5 className="!text-primary">{item.title}</h5>
                    {paragraphs.map((p, index) => (
                      <p key={index}>{p}</p>
                    ))}
                    {item.points?.length ? (
                      <ul>
                        {item.points.map((point, index) => (
                          <li key={`${id}-${index}`}>{point}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </article>
        </div>
      </Wrapper>
    </section>
  );
};
