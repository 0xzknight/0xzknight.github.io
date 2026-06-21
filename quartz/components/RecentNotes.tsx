import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullPageLayout } from "../cfg"
import SimpleClean from "./styles/recentNotes.scss"
import { joinSegments, resolveRelative } from "../util/path"
import { i18n } from "../i18n"

interface Options {
  title?: string
  limit: number
}

const defaultOptions: Options = {
  limit: 10,
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }
  const RecentNotes: QuartzComponent = ({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) => {
    const pages = allFiles
      .filter((p) => p.slug && !p.slug.startsWith("tags/") && p.slug !== "index")
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter?.date ?? 0).getTime()
        const dateB = new Date(b.frontmatter?.date ?? 0).getTime()
        return dateB - dateA
      })
      .slice(0, opts.limit)

    return (
      <div class={`recent-notes ${displayClass ?? ""}`}>
        <h3>{opts.title ?? "Recent Notes"}</h3>
        <ul class="recent-notes-list">
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? page.slug
            const date = page.frontmatter?.date
              ? new Date(page.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : ""
            
            const tags = page.frontmatter?.tags ?? []
            const htbTags = tags.filter(t => ["linux", "windows", "easy", "medium", "hard", "insane"].includes(t.toLowerCase()))

            return (
              <li class="card-item">
                <div class="card-meta">
                  {date && <span class="card-date">{date}</span>}
                  {htbTags.map(tag => (
                    <span class={`card-tag tag-${tag.toLowerCase()}`}>{tag.toUpperCase()}</span>
                  ))}
                </div>
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="card-title">
                  {title}
                </a>
                {page.frontmatter?.description && (
                  <p class="card-desc">{page.frontmatter.description}</p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  RecentNotes.css = SimpleClean
  return RecentNotes
}) satisfies QuartzComponentConstructor