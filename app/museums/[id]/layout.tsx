import { supabase } from "@/lib/supabaseClient"

// Generate static params for all museum IDs
export async function generateStaticParams() {
  try {
    const { data: museums, error } = await supabase
      .from("museums")
      .select("id")
    
    if (error) {
      console.error('Error fetching museum IDs:', error)
      return []
    }
    
    return museums?.map((museum) => ({
      id: museum.id.toString(),
    })) || []
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

export default function MuseumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
