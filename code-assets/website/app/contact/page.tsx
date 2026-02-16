"use client"

// Note: This is a client component, so metadata is handled in the layout
// The title will be "Contact | Media Publishing Demo" from the layout

import PageLayout from "../components/page-layout"
import PageHeader from "../components/page-header"
import FormInput from "../components/form-input"
import FormTextarea from "../components/form-textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { siteConfig } from "@/website/lib/config"

export default function ContactPage() {
  return (
    <PageLayout>
      <main className="max-w-screen-xl mx-auto px-2 md:px-4 py-12">
        <PageHeader 
          title="Contact Us" 
          description="Have a question, suggestion, or want to collaborate? We'd love to hear from you. Get in touch with our team and we'll respond as soon as possible."
          className="text-center mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="Your first name"
                />
                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Your last name"
                />
              </div>

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="your.email@example.com"
              />

              <FormInput
                id="subject"
                name="subject"
                label="Subject"
                placeholder="What's this about?"
              />

              <FormTextarea
                id="message"
                name="message"
                label="Message"
                rows={6}
                placeholder="Tell us more about your inquiry..."
              />

              <button
                type="submit"
                className="w-full py-3 px-6 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-brand-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{siteConfig.business.contact.email}</p>
                    <p className="text-gray-600">editorial@theplow.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-brand-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{siteConfig.business.contact.phone}</p>
                    <p className="text-gray-600">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-brand-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{siteConfig.business.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-brand-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">{siteConfig.business.contact.hours}</p>
                    <p className="text-gray-600">Weekend: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How can I submit an article?</h3>
                  <p className="text-gray-600 text-sm">
                    Send your article pitch to editorial@theplow.com with a brief summary and your credentials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you accept guest posts?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! We welcome guest contributions from industry experts and thought leaders.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How can I advertise with you?</h3>
                  <p className="text-gray-600 text-sm">
                    For advertising inquiries, please contact us at ads@theplow.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
