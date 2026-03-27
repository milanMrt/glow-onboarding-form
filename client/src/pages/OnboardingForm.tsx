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
  { id: 1, label: "Clinic Info" },
  { id: 2, label: "Business Basics" },
  { id: 3, label: "Treatments & Pricing" },
  { id: 4, label: "Capacity" },
  { id: 5, label: "Brand Assets" },
  { id: 6, label: "Billing" },
];

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-6 = steps
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
    if (currentStep > 0) {
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-white mb-4">Welcome to Glow Marketing</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Your onboarding has been initiated. Check your email for next steps and your Google Drive folder link.
          </p>
          <p className="text-sm text-gray-500">
            Our team will be in touch shortly to schedule your onboarding call.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-sm tracking-widest text-gray-500 mb-8">— GLOW MARKETING —</div>
          {currentStep === 0 ? (
            <>
              <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
                Let's build your <span className="text-yellow-600">growth system.</span>
              </h1>
              <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
                This form helps us understand your clinic, your goals, and your current situation so we can build a campaign that fits from day one. Fill it in at least 24 hours before your onboarding call so we arrive prepared.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-8 mb-12 text-sm">
                <div>
                  <div className="text-gray-500 mb-2">TIME</div>
                  <div className="text-white">~12 minutes</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">QUESTIONS</div>
                  <div className="text-white">~25 questions</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">COVERS</div>
                  <div className="text-white">Your full setup</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-medium transition-colors"
              >
                START →
              </button>
            </>
          ) : (
            <>
              <div className="text-xs tracking-widest text-gray-500 mb-4">
                STEP {currentStep} OF {steps.length}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                {currentStep === 1 && "What is the name of your clinic?"}
                {currentStep === 2 && "Tell us about your business"}
                {currentStep === 3 && "What treatments do you offer?"}
                {currentStep === 4 && "What's your capacity?"}
                {currentStep === 5 && "Show us your brand"}
                {currentStep === 6 && "Billing information"}
              </h1>
              <p className="text-gray-400 text-sm">
                {currentStep === 1 && "This helps us keep your submission organised on our end."}
                {currentStep === 2 && "We want to understand your online presence and current setup."}
                {currentStep === 3 && "This helps us know where to focus your first campaign."}
                {currentStep === 4 && "So we don't over-promise on bookings."}
                {currentStep === 5 && "So we create ads that match your aesthetic."}
                {currentStep === 6 && "We'll need this to set up your account."}
              </p>
            </>
          )}
        </div>

        {/* Form */}
        {currentStep > 0 && (
          <div className="max-w-xl mx-auto mb-12">
            {error && (
              <div className="mb-6 p-4 bg-red-950 border border-red-800 rounded flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Step 1 */}
              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="clinic_name" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      CLINIC / BUSINESS NAME *
                    </Label>
                    <Input
                      id="clinic_name"
                      name="clinic_name"
                      value={formData.clinic_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Glow Aesthetics Stockholm"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_name" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      YOUR NAME *
                    </Label>
                    <Input
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      EMAIL *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@clinic.se"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      PHONE / WHATSAPP *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+46 70 220 79 66"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                </>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <>
                  <div>
                    <Label htmlFor="business_age" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      HOW LONG HAS THE BUSINESS BEEN RUNNING? *
                    </Label>
                    <Select value={formData.business_age} onValueChange={(value) => handleSelectChange("business_age", value)}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="less_than_1">Less than 1 year</SelectItem>
                        <SelectItem value="1_3">1-3 years</SelectItem>
                        <SelectItem value="3_5">3-5 years</SelectItem>
                        <SelectItem value="5_plus">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="website_url" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      WEBSITE URL *
                    </Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_handle" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      INSTAGRAM HANDLE *
                    </Label>
                    <Input
                      id="instagram_handle"
                      name="instagram_handle"
                      value={formData.instagram_handle}
                      onChange={handleInputChange}
                      placeholder="@yourhandle"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook_page_url" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      FACEBOOK PAGE URL
                    </Label>
                    <Input
                      id="facebook_page_url"
                      name="facebook_page_url"
                      value={formData.facebook_page_url}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/..."
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_status" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      META BUSINESS MANAGER STATUS *
                    </Label>
                    <Select value={formData.meta_status} onValueChange={(value) => handleSelectChange("meta_status", value)}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="have_access">I have access</SelectItem>
                        <SelectItem value="need_help">I need help setting it up</SelectItem>
                        <SelectItem value="dont_have">I don't have one</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="booking_system" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      BOOKING SYSTEM *
                    </Label>
                    <Select value={formData.booking_system} onValueChange={(value) => handleSelectChange("booking_system", value)}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="calendly">Calendly</SelectItem>
                        <SelectItem value="acuity">Acuity Scheduling</SelectItem>
                        <SelectItem value="ghl">GoHighLevel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <>
                  <div>
                    <Label htmlFor="main_treatments" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      LIST YOUR MAIN TREATMENTS *
                    </Label>
                    <Textarea
                      id="main_treatments"
                      name="main_treatments"
                      value={formData.main_treatments}
                      onChange={handleInputChange}
                      placeholder="e.g., Botox, Fillers, Laser, Microneedling..."
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600 min-h-24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_treatment" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      WHICH TREATMENT SHOULD WE LEAD WITH FIRST? *
                    </Label>
                    <Input
                      id="lead_treatment"
                      name="lead_treatment"
                      value={formData.lead_treatment}
                      onChange={handleInputChange}
                      placeholder="e.g., Botox"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_treatment_price" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      PRICE FOR THE LEAD TREATMENT *
                    </Label>
                    <Input
                      id="lead_treatment_price"
                      name="lead_treatment_price"
                      value={formData.lead_treatment_price}
                      onChange={handleInputChange}
                      placeholder="e.g., 2500 SEK"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="popular_package" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      MOST POPULAR PACKAGE
                    </Label>
                    <Textarea
                      id="popular_package"
                      name="popular_package"
                      value={formData.popular_package}
                      onChange={handleInputChange}
                      placeholder="e.g., Gold Package: Botox + Fillers + Laser - 5000 SEK"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600 min-h-20"
                    />
                  </div>
                </>
              )}

              {/* Step 4 */}
              {currentStep === 4 && (
                <>
                  <div>
                    <Label htmlFor="practitioners" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      HOW MANY PRACTITIONERS? *
                    </Label>
                    <Input
                      id="practitioners"
                      name="practitioners"
                      type="number"
                      value={formData.practitioners}
                      onChange={handleInputChange}
                      placeholder="e.g., 3"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_clients_per_day" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      MAX CLIENTS PER DAY *
                    </Label>
                    <Input
                      id="max_clients_per_day"
                      name="max_clients_per_day"
                      type="number"
                      value={formData.max_clients_per_day}
                      onChange={handleInputChange}
                      placeholder="e.g., 15"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="calendar_fullness" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      HOW FULL IS YOUR CALENDAR RIGHT NOW? *
                    </Label>
                    <Select value={formData.calendar_fullness} onValueChange={(value) => handleSelectChange("calendar_fullness", value)}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="empty">Empty - lots of availability</SelectItem>
                        <SelectItem value="moderate">Moderate - some availability</SelectItem>
                        <SelectItem value="full">Full - limited availability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Step 5 */}
              {currentStep === 5 && (
                <>
                  <div>
                    <Label htmlFor="brand_colors" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      BRAND COLOURS (HEX CODES OR "SEE WEBSITE") *
                    </Label>
                    <Input
                      id="brand_colors"
                      name="brand_colors"
                      value={formData.brand_colors}
                      onChange={handleInputChange}
                      placeholder="#FF6B35, #FFB703 or 'see website'"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      UPLOAD YOUR LOGO (URL)
                    </Label>
                    <Input
                      id="logo_url"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assets_drive_link" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      GOOGLE DRIVE LINK WITH PHOTOS, VIDEOS, BEFORE/AFTERS
                    </Label>
                    <Input
                      id="assets_drive_link"
                      name="assets_drive_link"
                      value={formData.assets_drive_link}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                </>
              )}

              {/* Step 6 */}
              {currentStep === 6 && (
                <>
                  <div>
                    <Label htmlFor="company_name" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      REGISTERED COMPANY NAME *
                    </Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Beauty Clinic AB"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_number" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      ORGANISATION NUMBER *
                    </Label>
                    <Input
                      id="org_number"
                      name="org_number"
                      value={formData.org_number}
                      onChange={handleInputChange}
                      placeholder="e.g., 556970-3050"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billing_email" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      BILLING EMAIL *
                    </Label>
                    <Input
                      id="billing_email"
                      name="billing_email"
                      type="email"
                      value={formData.billing_email}
                      onChange={handleInputChange}
                      placeholder="billing@clinic.se"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billing_address" className="text-xs tracking-widest text-gray-400 mb-3 block">
                      BILLING ADDRESS *
                    </Label>
                    <Textarea
                      id="billing_address"
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleInputChange}
                      placeholder="Strandvägen 1, 114 51 Stockholm, Sweden"
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-600 min-h-20"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="text-xs tracking-widest text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← BACK
              </button>

              {currentStep === 6 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-black font-medium transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    "SUBMIT →"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-medium transition-colors"
                >
                  CONTINUE →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
