import { motion } from "framer-motion";
import { useCheckoutStore } from "../features/checkout/store/checkoutStore";
import { CheckoutStepper } from "../features/checkout/components/CheckoutStepper";
import { AddressForm } from "../features/checkout/components/AddressForm";
import { ShippingMethodSelector } from "../features/checkout/components/ShippingMethodSelector";
import { PaymentMethodSelector } from "../features/checkout/components/PaymentMethodSelector";
import { OrderReview } from "../features/checkout/components/OrderReview";
import { OrderConfirmation } from "../features/checkout/components/OrderConfirmation";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

const STEP_TITLES = ["Shipping Address", "Shipping Method", "Payment", "Review Order", "Confirmed!"];

export default function CheckoutPage() {
  const step = useCheckoutStore((s) => s.step);

  const stepComponents = [
    <AddressForm key="address" />,
    <ShippingMethodSelector key="shipping" />,
    <PaymentMethodSelector key="payment" />,
    <OrderReview key="review" />,
    <OrderConfirmation key="confirmation" />,
  ];

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      {step < 4 && (
        <div className="mb-8">
          <CheckoutStepper currentStep={step} />
        </div>
      )}

      <div className="mx-auto max-w-lg">
        {step < 4 && (
          <h1 className="mb-6 text-xl font-bold text-text-primary">{STEP_TITLES[step]}</h1>
        )}
        {stepComponents[step]}
      </div>
    </motion.div>
  );
}
