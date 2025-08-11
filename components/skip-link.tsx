import Link from "next/link"

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
    >
      Aller au contenu principal
    </Link>
  )
}
