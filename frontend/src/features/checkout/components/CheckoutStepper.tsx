import { Check } from "lucide-react";

const STEPS = ["Shipping Address", "Shipping Method", "Payment", "Review"];

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  done
                    ? "bg-brand-primary text-white"
                    : active
                    ? "border-2 border-brand-primary text-brand-primary"
                    : "border-2 border-white/20 text-text-muted"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  active ? "font-medium text-text-primary" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 h-px w-12 sm:w-20 transition-colors ${
                  done ? "bg-brand-primary" : "bg-white/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
