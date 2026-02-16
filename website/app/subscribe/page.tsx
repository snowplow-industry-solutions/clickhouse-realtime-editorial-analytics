"use client"

import { useState } from "react"
import { Check, CreditCard, User, Calendar } from "lucide-react"
import PageLayout from "../components/page-layout"
import MainContentLayout from "../components/main-content-layout"
import PageHeader from "../components/page-header"
import { trackCreateAccount } from "@/website/lib/snowplow-tracking"
import { siteConfig } from "@/website/lib/config"
import { useRouter } from "next/navigation"
import { useUser } from "../contexts/user-context"

type PlanType = "annual" | "monthly"
type SubscriptionStep = "plan" | "details" | "payment"

interface SubscriptionData {
  plan: PlanType | null
  name: string
  email: string
  cardNumber: string
  cvv: string
  expiry: string
}

export default function SubscribePage() {
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>("plan")
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    plan: null,
    name: "",
    email: "",
    cardNumber: "4242 4242 4242 4242",
    cvv: "123",
    expiry: "12/25"
  })
  const router = useRouter();
  const { login } = useUser();

  const plans = [
    {
      id: "annual" as PlanType,
      name: "Annual",
      price: "$29.99",
      period: "per year",
      savings: "Save over 37%",
      isBestValue: true
    },
    {
      id: "monthly" as PlanType,
      name: "Monthly",
      price: "$3.99",
      period: "per month",
      savings: "Less than $1/week",
      isBestValue: false
    }
  ]

  const commonFeatures = [
    "Unlimited access to all articles",
    "Exclusive subscriber-only content",
    "Early access to breaking news"
  ]

  const handlePlanSelect = (plan: PlanType) => {
    setSubscriptionData(prev => ({ ...prev, plan }))
    setCurrentStep("details")
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Track subscription completion
    trackCreateAccount()
    // Log in the user and redirect to homepage
    login(subscriptionData.email)
    localStorage.setItem('showSubscriptionThankYou', 'true')
    router.push('/')
  }

  const renderPlanSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-gray-600">Select the subscription plan that works best for you</p>
      </div>

      {/* Common Features */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">All Plans Include:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commonFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-lg shadow-md border-2 p-6 transition-all hover:shadow-lg flex flex-col h-full ${
              plan.isBestValue ? 'border-brand-primary' : 'border-gray-200'
            }`}
          >
            {plan.isBestValue && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </span>
              </div>
            )}
            
            <div className="text-center mb-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-1">{plan.period}</span>
              </div>
              {plan.savings && (
                <span className="text-sm text-green-600 font-medium">{plan.savings}</span>
              )}
            </div>
            
            <button
              onClick={() => handlePlanSelect(plan.id)}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-medium py-3 px-4 rounded-md transition-colors mt-auto"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPersonalDetails = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Details</h2>
        <p className="text-gray-600">Please provide your information to complete your subscription</p>
      </div>
      
      <form onSubmit={handleDetailsSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={subscriptionData.name}
                onChange={(e) => setSubscriptionData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={subscriptionData.email}
                onChange={(e) => setSubscriptionData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep("plan")}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-md transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  )

  const renderPaymentDetails = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Details</h2>
        <p className="text-gray-600">Complete your subscription with secure payment</p>
      </div>
      
      <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="cardNumber"
                value={subscriptionData.cardNumber}
                onChange={(e) => setSubscriptionData(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="expiry"
                  value={subscriptionData.expiry}
                  onChange={(e) => setSubscriptionData(prev => ({ ...prev, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={subscriptionData.cvv}
                onChange={(e) => setSubscriptionData(prev => ({ ...prev, cvv: e.target.value }))}
                placeholder="123"
                className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                required
              />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {subscriptionData.plan === "annual" ? "Annual Plan" : "Monthly Plan"}
              </span>
              <span className="font-medium">
                {subscriptionData.plan === "annual" ? "$29.99" : "$3.99"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep("details")}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-md transition-colors"
            >
              Complete Subscription
            </button>
          </div>
        </div>
      </form>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "plan":
        return renderPlanSelection()
      case "details":
        return renderPersonalDetails()
      case "payment":
        return renderPaymentDetails()
      default:
        return renderPlanSelection()
    }
  }

  return (
    <PageLayout>
      <MainContentLayout sidebar={null}>
        <PageHeader
          title={`Subscribe to ${siteConfig.brand.name}`}
          description="Get unlimited access to premium content and exclusive insights"
          className="text-center"
        />
        
        <div className="py-8">
          {/* Progress indicator */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center w-[60%] mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  currentStep === "plan"
                    ? "bg-brand-primary text-white"
                    : ["details", "payment"].includes(currentStep)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  1
                </div>
                <span className="text-sm text-gray-600 text-center min-h-[40px] flex items-center justify-center">Choose Plan</span>
              </div>
              {/* Divider 1 */}
              <div className="h-1 bg-gray-200 flex-1 mx-2" style={{ alignSelf: 'center' }} />
              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  currentStep === "details"
                    ? "bg-brand-primary text-white"
                    : currentStep === "payment"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  2
                </div>
                <span className="text-sm text-gray-600 text-center min-h-[40px] flex items-center justify-center">Personal Details</span>
              </div>
              {/* Divider 2 */}
              <div className="h-1 bg-gray-200 flex-1 mx-2" style={{ alignSelf: 'center' }} />
              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  currentStep === "payment"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  3
                </div>
                <span className="text-sm text-gray-600 text-center min-h-[40px] flex items-center justify-center">Payment</span>
              </div>
            </div>
          </div>
          
          {renderCurrentStep()}
        </div>
      </MainContentLayout>
    </PageLayout>
  )
} 