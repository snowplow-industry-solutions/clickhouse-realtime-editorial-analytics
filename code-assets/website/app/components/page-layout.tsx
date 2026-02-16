import Header from "./header"
import Footer from "./footer"
import ConsentManager from "./consent-manager"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Header />
      {children}
      <Footer />
      <ConsentManager />
    </div>
  )
} 