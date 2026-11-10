import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { getTemple } from "@/data/temples";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { BookingHeader } from "@/features/booking/components/BookingHeader";
import { BookingStepper, type StepNumber } from "@/features/booking/components/BookingStepper";
import { ScheduleStep } from "@/features/booking/components/ScheduleStep";
import { DevoteeStep } from "@/features/booking/components/DevoteeStep";
import { ServicesStep } from "@/features/booking/components/ServicesStep";
import { CheckoutStep } from "@/features/booking/components/CheckoutStep";
import { BookingSidebar } from "@/features/booking/components/BookingSidebar";
import { BookingSuccess } from "@/features/booking/components/BookingSuccess";

import {
  DARSHAN_CATEGORIES,
  DEFAULT_TIME_SLOTS,
  type DarshanCategory,
  type DevoteeMember,
  type AddonService,
} from "@/features/booking/constants";

export const Route = createFileRoute("/_app/booking/$slug")({
  loader: ({ params }) => {
    const t = getTemple(params.slug);
    if (!t) throw notFound();
    return { temple: t };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Darshan Booking — ${loaderData?.temple.name}` }],
  }),
  component: BookingPage,
});

export { DARSHAN_CATEGORIES } from "@/features/booking/constants";
export type { BookingCart } from "@/features/booking/constants";

function BookingPage() {
  const { temple: t } = Route.useLoaderData();
  const { t: tStr } = useTranslation();
  const navigate = useNavigate();

  // Active step: 1 (Schedule), 2 (Devotee Details), 3 (Select Services), 4 (Checkout), or "success"
  const [currentStep, setCurrentStep] = useState<StepNumber | "success">(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 1: Schedule state
  // Default to Special Entry as in the reference design
  const [selectedCategory, setSelectedCategory] = useState<DarshanCategory>(
    DARSHAN_CATEGORIES[0]
  );
  // Default to 15 November 2026 as in the reference design
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(2026, 10, 15) // Month is 0-indexed, so 10 = November
  );
  // Default to 6:00 AM as in the reference design
  const [selectedTime, setSelectedTime] = useState<string>("6:00 AM");

  // Step 2: Devotee Details state
  const [devotees, setDevotees] = useState<DevoteeMember[]>([
    {
      id: "1",
      name: "",
      age: "",
      gender: "male",
      idType: "Aadhaar Card",
      idNumber: "",
    },
  ]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialAssistance, setSpecialAssistance] = useState(false);

  // Step 3: Optional Add-on Services
  const [selectedServices, setSelectedServices] = useState<
    Array<{ service: AddonService; qty: number }>
  >([]);

  // Service quantity updater
  const handleUpdateServiceQty = (service: AddonService, qty: number) => {
    if (qty <= 0) {
      setSelectedServices((prev) => prev.filter((s) => s.service.id !== service.id));
    } else {
      setSelectedServices((prev) => {
        const existing = prev.find((s) => s.service.id === service.id);
        if (existing) {
          return prev.map((s) => (s.service.id === service.id ? { ...s, qty } : s));
        }
        return [...prev, { service, qty }];
      });
    }
  };

  // Pre-select festival date when an upcoming event is clicked
  const handleSelectEventDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step navigation
  const goToStep = (step: StepNumber) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Payment confirmation
  const handleConfirmPayment = (_method: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
  };

  // Devotee count
  const devoteeCount = Math.max(1, devotees.length);

  // Cart format for legacy success screen compatibility
  const successCart = useMemo(() => {
    return {
      darshan: {
        type: selectedCategory.name,
        persons: devoteeCount,
        price: selectedCategory.price * devoteeCount,
        date: selectedDate,
        time: selectedTime,
      },
      poojas: selectedServices
        .filter((s) => s.service.category === "pooja")
        .map((s) => ({
          id: s.service.id,
          name: s.service.name,
          price: s.service.price * s.qty,
        })),
      prasadam: selectedServices
        .filter((s) => s.service.category === "prasadam")
        .map((s) => ({
          id: s.service.id,
          name: s.service.name,
          qty: s.qty,
          price: s.service.price * s.qty,
        })),
      archana: {
        optIn: selectedServices.some((s) => s.service.id === "archana"),
        partnerDelivery: false,
        price: selectedServices.find((s) => s.service.id === "archana")?.service.price || 0,
      },
      accommodations: {
        type: selectedServices.find((s) => s.service.category === "stay")?.service.name || "",
        nights: selectedServices.find((s) => s.service.category === "stay")?.qty || 0,
        price:
          (selectedServices.find((s) => s.service.category === "stay")?.service.price || 0) *
          (selectedServices.find((s) => s.service.category === "stay")?.qty || 0),
        checkIn: selectedDate,
      },
      venues: { type: "", price: 0, date: null },
      donations: { amount: 0, frequency: "one-time", cause: "general" },
    };
  }, [selectedCategory, devoteeCount, selectedDate, selectedTime, selectedServices]);

  const successDetails = useMemo(() => {
    return {
      name: devotees[0]?.name || "Devotee",
      phone: contactPhone,
      idNumber: devotees[0]?.idNumber || "",
      categoryId: selectedCategory.id,
      persons: devoteeCount,
    };
  }, [devotees, contactPhone, selectedCategory, devoteeCount]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-16">
      {/* 1. Top Banner Header */}
      <BookingHeader t={t} />

      {/* 2. Four-Step Progress Stepper */}
      {currentStep !== "success" && (
        <div className="border-b border-[#EDE6DC] bg-[#FAF6F0] shadow-xs">
          <BookingStepper
            currentStep={currentStep as StepNumber}
            onStepClick={(step) => goToStep(step)}
          />
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {currentStep === "success" ? (
          <BookingSuccess
            t={t}
            details={successDetails}
            cart={successCart}
            visitDate={selectedDate}
            visitTime={selectedTime}
          />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
            {/* Left Column: Active Step Flow */}
            <main className="min-w-0">
              {currentStep === 1 && (
                <ScheduleStep
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  onContinue={() => goToStep(2)}
                  onBack={() => navigate({ to: "/temple/$slug", params: { slug: t.slug } })}
                />
              )}

              {currentStep === 2 && (
                <DevoteeStep
                  devotees={devotees}
                  onChangeDevotees={setDevotees}
                  contactEmail={contactEmail}
                  onChangeContactEmail={setContactEmail}
                  contactPhone={contactPhone}
                  onChangeContactPhone={setContactPhone}
                  specialAssistance={specialAssistance}
                  onChangeSpecialAssistance={setSpecialAssistance}
                  onContinue={() => goToStep(3)}
                  onBack={() => goToStep(1)}
                />
              )}

              {currentStep === 3 && (
                <ServicesStep
                  selectedServices={selectedServices}
                  onUpdateServiceQty={handleUpdateServiceQty}
                  onContinue={() => goToStep(4)}
                  onBack={() => goToStep(2)}
                />
              )}

              {currentStep === 4 && (
                <CheckoutStep
                  temple={t}
                  category={selectedCategory}
                  visitDate={selectedDate}
                  visitTime={selectedTime}
                  devotees={devotees}
                  contactEmail={contactEmail}
                  contactPhone={contactPhone}
                  specialAssistance={specialAssistance}
                  selectedServices={selectedServices}
                  onConfirmPayment={handleConfirmPayment}
                  onBack={() => goToStep(3)}
                  isProcessing={isProcessing}
                />
              )}
            </main>

            {/* Right Column: Sidebar Panels */}
            <aside className="min-w-0 lg:sticky lg:top-4">
              <BookingSidebar
                temple={t}
                category={selectedCategory}
                visitDate={selectedDate}
                visitTime={selectedTime}
                devotees={devotees}
                selectedServices={selectedServices}
                onSelectEventDate={handleSelectEventDate}
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
