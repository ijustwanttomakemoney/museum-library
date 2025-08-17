// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic'

export default function MuseumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
