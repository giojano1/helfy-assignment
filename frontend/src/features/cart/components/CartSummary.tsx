import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

interface CartSummaryProps {
  subtotal: number;
  onClose?: () => void;
}

const TAX_RATE = 0.08;

export function CartSummary({ subtotal, onClose }: CartSummaryProps) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex justify-between text-sm">
        <span className="text-text-muted">Subtotal</span>
        <span className="text-text-primary">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-text-muted">Est. Tax (8%)</span>
        <span className="text-text-primary">${tax.toFixed(2)}</span>
      </div>
      <hr className="border-white/10" />
      <div className="flex justify-between font-semibold">
        <span className="text-text-primary">Total</span>
        <span className="text-text-primary">${total.toFixed(2)}</span>
      </div>
      <Link to="/checkout" onClick={onClose}>
        <Button className="w-full">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}
