"use client"

import { FormInputIcon, Phone, MapPin, RefreshCw, Shield, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { siteConfig, getRandomUtmParameters } from "@/website/lib/config"
import { buildUrlWithUtm } from "@/website/lib/utils"

export default function Footer() {
  const router = useRouter()
  const handleUtmReload = () => {
    const currentUrl = window.location.href
    const utmParams = getRandomUtmParameters()
    const urlWithUtm = buildUrlWithUtm(currentUrl, utmParams)
    window.location.href = urlWithUtm
  }

  const handleManageConsent = () => {
    // Dispatch a custom event to show the consent manager
    window.dispatchEvent(new CustomEvent('showConsentManager'))
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-screen-xl mx-auto px-2 md:px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-brand-primary">
              {siteConfig.brand.name}
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              {siteConfig.brand.tagline}
            </p>
            <div className="flex space-x-4">
              {siteConfig.business.social.twitter && (
                <a href={siteConfig.business.social.twitter} className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              )}
              {siteConfig.business.social.linkedin && (
                <a href={siteConfig.business.social.linkedin} className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {siteConfig.navigation.footerLinks
                .filter(link => link.category === 'company')
                .map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                </a>
              </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FormInputIcon className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
              <li className="text-gray-300 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {siteConfig.business.contact.phone}
              </li>
              <li className="text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {siteConfig.business.contact.address.split(',')[1]?.trim() || siteConfig.business.contact.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 {siteConfig.brand.name}. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            {/* UTM Reload Button */}
            {siteConfig.features.utmParameters && (
              <button
                onClick={handleUtmReload}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                title="Reload with UTM parameters for marketing tracking"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                UTM Reload
              </button>
            )}

            {/* Manage Consent Button */}
            {siteConfig.features.consentManager && (
              <button
                onClick={handleManageConsent}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                title="Manage cookie and privacy preferences"
              >
                <Shield className="h-3 w-3 mr-1.5" />
                Manage Consent
              </button>
            )}

            {/* Video Button */}
            <button
              onClick={() => router.push('/video')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
              title="Watch our demo video"
            >
              <Play className="h-3 w-3 mr-1.5" />
              Watch Video
            </button>
            
            {/* Legal Links */}
            {siteConfig.navigation.footerLinks
              .filter(link => link.category === 'legal')
              .map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`text-gray-400 hover:text-white text-sm transition-colors ${
                    link.href.includes('snowplow.io') ? 'relative group' : ''
                  }`}
                  title={link.href.includes('snowplow.io') ? 'Cross-domain tracking enabled' : undefined}
                >
                  {link.name}
                  {link.href.includes('snowplow.io') && (
                    <span className="ml-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ↗
                    </span>
                  )}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
