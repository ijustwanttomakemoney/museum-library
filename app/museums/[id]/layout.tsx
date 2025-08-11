// Generate static params for all museum IDs
export async function generateStaticParams() {
  // Return all possible museum IDs that exist in your data
  const museumIds = ['1', '2', '3', '4', '5', '6', '7']
  
  return museumIds.map((id) => ({
    id: id,
  }))
}

export default function MuseumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
