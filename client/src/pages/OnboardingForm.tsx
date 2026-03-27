import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const WEBHOOK_URL = "https://8765-i6abb8hfxkb9s3w04yftb-6c22dd36.us2.manus.computer/onboard";

const steps = [
  { id: 1, title: "Clinic Info", icon: "🏥" },
  { id: 2, title: "Business Basics", icon: "📊" },
  { id: 3, title: "Treatments & Pricing", icon: "💰" },
  { id: 4, title: "Capacity", icon: "📅" },
  { id: 5, title: "Brand Assets", icon: "🎨" },
  { id: 6, title: "Billing", icon: "💳" },
];

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clinic_name: "",
    contact_name: "",
    email: "",
    phone: "",
    business_age: "",
    website_url: "",
    instagram_handle: "",
    facebook_page_url: "",
    meta_status: "",
    booking_system: "",
    main_treatments: "",
    lead_treatment: "",
    lead_treatment_price: "",
    popular_package: "",
    practitioners: "",
    max_clients_per_day: "",
    calendar_fullness: "",
    brand_colors: "",
    logo_url: "",
    assets_drive_link: "",
    company_name: "",
    org_number: "",
    billing_email: "",
    billing_address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.clinic_name && formData.contact_name && formData.email && formData.phone);
      case 2:
        return !!(formData.business_age && formData.website_url && formData.instagram_handle && formData.meta_status);
      case 3:
        return !!(formData.main_treatments && formData.lead_treatment && formData.lead_treatment_price);
      case 4:
        return !!(formData.practitioners && formData.max_clients_per_day && formData.calendar_fullness);
      case 5:
        return !!(formData.brand_colors);
      case 6:
        return !!(formData.company_name && formData.org_number && formData.billing_email && formData.billing_address);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError("");
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setError("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to Glow Marketing! 🚀</h2>
          <p className="text-gray-600 mb-6">
            Your onboarding has been initiated. Check your email for next steps and your Google Drive folder link.
          </p>
          <p className="text-sm text-gray-500">
            Our team will be in touch shortly to schedule your onboarding call.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Glow Marketing</h1>
          <p className="text-lg text-gray-600">Client Onboarding Form</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  currentStep === step.id ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all ${
                    currentStep >= step.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-xs font-medium text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div
              className="bg-orange-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Clinic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">🏥 Clinic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clinic_name">Clinic Name *</Label>
                  <Input
                    id="clinic_name"
                    name="clinic_name"
                    value={formData.clinic_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Beauty Clinic Stockholm"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_name">Your Name *</Label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., john@clinic.se"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +46 70 220 79 66"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Basics */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">📊 Business Basics</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business_age">How long has the business been running? *</Label>
                  <Select value={formData.business_age} onValueChange={(value) => handleSelectChange("business_age", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less_than_1">Less than 1 year</SelectItem>
                      <SelectItem value="1_3">1-3 years</SelectItem>
                      <SelectItem value="3_5">3-5 years</SelectItem>
                      <SelectItem value="5_plus">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="website_url">Website URL *</Label>
                  <Input
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram_handle">Instagram Handle *</Label>
                  <Input
                    id="instagram_handle"
                    name="instagram_handle"
                    value={formData.instagram_handle}
                    onChange={handleInputChange}
                    placeholder="@yourhandle"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_page_url">Facebook Page URL</Label>
                  <Input
                    id="facebook_page_url"
                    name="facebook_page_url"
                    value={formData.facebook_page_url}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_status">Meta Business Manager Status *</Label>
                  <Select value={formData.meta_status} onValueChange={(value) => handleSelectChange("meta_status", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="have_access">I have access</SelectItem>
                      <SelectItem value="need_help">I need help setting it up</SelectItem>
                      <SelectItem value="dont_have">I don't have one</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="booking_system">Booking System *</Label>
                  <Select value={formData.booking_system} onValueChange={(value) => handleSelectChange("booking_system", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calendly">Calendly</SelectItem>
                      <SelectItem value="acuity">Acuity Scheduling</SelectItem>
                      <SelectItem value="ghl">GoHighLevel</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Treatments & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">💰 Treatments & Pricing</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="main_treatments">List your main treatments *</Label>
                  <Textarea
                    id="main_treatments"
                    name="main_treatments"
                    value={formData.main_treatments}
                    onChange={handleInputChange}
                    placeholder="e.g., Botox, Fillers, Laser, Microneedling..."
                    className="mt-2 min-h-24"
                  />
                </div>
                <div>
                  <Label htmlFor="lead_treatment">Which treatment should we lead with first? *</Label>
                  <Input
                    id="lead_treatment"
                    name="lead_treatment"
                    value={formData.lead_treatment}
                    onChange={handleInputChange}
                    placeholder="e.g., Botox"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lead_treatment_price">Price for the lead treatment *</Label>
                  <Input
                    id="lead_treatment_price"
                    name="lead_treatment_price"
                    value={formData.lead_treatment_price}
                    onChange={handleInputChange}
                    placeholder="e.g., 2500 SEK"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="popular_package">Most popular package (what's included + price)</Label>
                  <Textarea
                    id="popular_package"
                    name="popular_package"
                    value={formData.popular_package}
                    onChange={handleInputChange}
                    placeholder="e.g., Gold Package: Botox + Fillers + Laser - 5000 SEK"
                    className="mt-2 min-h-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Capacity */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">📅 Capacity</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="practitioners">How many practitioners? *</Label>
                  <Input
                    id="practitioners"
                    name="practitioners"
                    type="number"
                    value={formData.practitioners}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="max_clients_per_day">Max clients per day *</Label>
                  <Input
                    id="max_clients_per_day"
                    name="max_clients_per_day"
                    type="number"
                    value={formData.max_clients_per_day}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="calendar_fullness">How full is your calendar right now? *</Label>
                  <Select value={formData.calendar_fullness} onValueChange={(value) => handleSelectChange("calendar_fullness", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Empty - lots of availability</SelectItem>
                      <SelectItem value="moderate">Moderate - some availability</SelectItem>
                      <SelectItem value="full">Full - limited availability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Brand Assets */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">🎨 Brand Assets</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brand_colors">Brand Colours (hex codes or "see website") *</Label>
                  <Input
                    id="brand_colors"
                    name="brand_colors"
                    value={formData.brand_colors}
                    onChange={handleInputChange}
                    placeholder="e.g., #FF6B35, #FFB703 or 'see website'"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">Upload your logo (URL)</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="assets_drive_link">Google Drive link with photos, videos, before/afters</Label>
                  <Input
                    id="assets_drive_link"
                    name="assets_drive_link"
                    value={formData.assets_drive_link}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Billing */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">💳 Billing Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Registered Company Name *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Beauty Clinic AB"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="org_number">Organization Number *</Label>
                  <Input
                    id="org_number"
                    name="org_number"
                    value={formData.org_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 556970-3050"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="billing_email">Billing Email *</Label>
                  <Input
                    id="billing_email"
                    name="billing_email"
                    type="email"
                    value={formData.billing_email}
                    onChange={handleInputChange}
                    placeholder="e.g., billing@clinic.se"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="billing_address">Billing Address *</Label>
                  <Textarea
                    id="billing_address"
                    name="billing_address"
                    value={formData.billing_address}
                    onChange={handleInputChange}
                    placeholder="e.g., Strandvägen 1, 114 51 Stockholm, Sweden"
                    className="mt-2 min-h-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6"
            >
              ← Previous
            </Button>

            {currentStep === 6 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit & Start Onboarding 🚀"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next →
              </Button>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>Step {currentStep} of 6</p>
        </div>
      </div>
    </div>
  );
}
