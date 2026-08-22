import Link from "next/link"

const ICP_NUMBER = "粤ICP备2026119063号"
const ICP_LINK = "https://beian.miit.gov.cn/"
const POLICE_NUMBER = "粤公网安备44010602016867号"
const POLICE_LINK =
  "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602016867"

export function SiteFooter() {
  return (
    <footer className="w-full py-6 px-4">
      <div className="max-w-lg mx-auto md:max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1.5 text-xs text-warm-400">
        <Link
          href={ICP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-warm-600 transition-colors"
        >
          {ICP_NUMBER}
        </Link>
        <span className="hidden sm:inline text-warm-300" aria-hidden>
          ·
        </span>
        <Link
          href={POLICE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-warm-600 transition-colors"
        >
          {POLICE_NUMBER}
        </Link>
      </div>
    </footer>
  )
}
