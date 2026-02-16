import Sidebar from "./sidebar"
import Advertisement from "./advertisement"
import { siteConfig } from "@/website/lib/config"

interface MainContentLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  className?: string
  advertising?: {
    banner?: boolean
    inArticle?: boolean
    sponsored?: boolean
    category?: string
  }
}

export default function MainContentLayout({ 
  children, 
  sidebar = <Sidebar />, 
  className = "",
  advertising = {}
}: MainContentLayoutProps) {
  const hasSidebar = sidebar !== null && sidebar !== undefined

  return (
    <main className={`max-w-screen-xl mx-auto px-2 md:px-4 py-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className={hasSidebar ? "lg:col-span-3" : "lg:col-span-4"}>
          {children}
          
          {/* Random Advertisement */}
          {siteConfig.features.advertising && (
            <div className="mt-8">
              <Advertisement />
            </div>
          )}
        </div>
        {hasSidebar && sidebar}
      </div>
    </main>
  )
} 