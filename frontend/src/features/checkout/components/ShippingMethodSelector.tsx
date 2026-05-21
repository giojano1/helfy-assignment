import { useCheckoutStore } from "../store/checkoutStore";
import { Button } from "../../../components/ui/Button";
import type { ShippingMethod } from "../types";

const OPTIONS: { value: ShippingMethod; label: string; description: string; price: string }[] = [
  { value: "standard", label: "Standard Shipping", description: "5–7 business days", price: "Free" },
  { value: "express", label: "Express Shipping", description: "2–3 business days", price: "$9.99" },
  { value: "overnight", label: "Overnight Shipping", description: "Next business day", price: "$24.99" },
];

export function ShippingMethodSelector() {
  const { shippingMethod, setShippingMethod, nextStep, prevStep } = useCheckoutStore();

  return (
    <div className="flex flex-col gap-4">
      {OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
            shippingMethod === opt.value
              ? "border-brand-primary bg-brand-primary/10"
              : "border-white/10 bg-white/5 hover:border-white/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shippingMethod"
              value={opt.value}
              checked={shippingMethod === opt.value}
              onChange={() => setShippingMethod(opt.value)}
              className="accent-brand-primary"
            />
            <div>
              <p className="font-medium text-text-primary">{opt.label}</p>
              <p className="text-sm text-text-muted">{opt.description}</p>
            </div>
          </div>
          <span className="font-semibold text-text-primary">{opt.price}</span>
        </label>
      ))}

      <div className="mt-2 flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
