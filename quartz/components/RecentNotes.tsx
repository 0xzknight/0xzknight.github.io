import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import SimpleClean from "./styles/recentNotes.scss"
import { resolveRelative } from "../util/path"

interface Options {
  title?: string
  limit: number
}

const defaultOptions: Options = {
  limit: 10,
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }
  const RecentNotes: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    // Строгий фильтр: исключаем папки, теги, 404 и файлы без валидного title во frontmatter
    const pages = allFiles
      .filter((p) => {
        const hasTitle = p.frontmatter?.title && p.frontmatter.title.trim() !== ""
        const isNotSpecial = !p.slug?.startsWith("tags/") && p.slug !== "index" && p.slug !== "404"
        const isNotUntitled = p.frontmatter?.title?.toLowerCase() !== "untitled"
        return hasTitle && isNotSpecial && isNotUntitled
      })
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter?.date ?? 0).getTime()
        const dateB = new Date(b.frontmatter?.date ?? 0).getTime()
        return dateB - dateA
      })
      .slice(0, opts.limit)

    return (
      <div class={`recent-notes ${displayClass ?? ""}`}>
        <ul class="recent-notes-list">
          {pages.map((page) => {
            const title = page.frontmatter!.title
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