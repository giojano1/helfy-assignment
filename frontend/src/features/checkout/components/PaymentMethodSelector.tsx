import { useState } from "react";
import { CreditCard, Truck } from "lucide-react";
import { useCheckoutStore } from "../store/checkoutStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { PaymentMethod } from "../types";

export function PaymentMethodSelector() {
  const { paymentMethod, setPaymentMethod, nextStep, prevStep } = useCheckoutStore();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const options: { value: PaymentMethod; label: string; icon: typeof Truck }[] = [
    { value: "cod", label: "Cash on Delivery", icon: Truck },
    { value: "card", label: "Credit Card", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
              paymentMethod === value
                ? "border-brand-primary bg-brand-primary/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={value}
              checked={paymentMethod === value}
              onChange={() => setPaymentMethod(value)}
              className="sr-only"
            />
            <Icon size={24} className={paymentMethod === value ? "text-brand-primary" : "text-text-muted"} />
            <span className="text-sm font-medium text-text-primary">{label}</span>
          </label>
        ))}
      </div>

      {paymentMethod === "card" && (
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <Input
            label="Card Number"
            placeholder="•••• •••• •••• ••••"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Expiry"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <Input
              label="CVV"
              placeholder="•••"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
          <p className="text-xs text-text-muted">
            This is a demo — no real payment is processed.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
