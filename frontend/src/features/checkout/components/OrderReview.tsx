import { useCart } from "../../cart/hooks/useCart";
import { useCheckoutStore } from "../store/checkoutStore";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { Button } from "../../../components/ui/Button";

const SHIPPING_COSTS = { standard: 0, express: 9.99, overnight: 24.99 };
const TAX_RATE = 0.08;

export function OrderReview() {
  const { items, totalPrice } = useCart();
  const { shippingAddress, shippingMethod, paymentMethod, prevStep } = useCheckoutStore();
  const { mutate: placeOrder, isPending } = useCreateOrder();

  const shippingCost = SHIPPING_COSTS[shippingMethod];
  const tax = totalPrice * TAX_RATE;
  const total = totalPrice + shippingCost + tax;

  const handlePlace = () => {
    if (!shippingAddress) return;
    placeOrder({ shippingAddress, shippingMethod, paymentMethod });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-text-primary">Shipping to</p>
        {shippingAddress && (
          <p className="text-sm text-text-muted">
            {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city},{" "}
            {shippingAddress.country} {shippingAddress.zip}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-text-primary">Order Items</p>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-text-muted">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-text-primary">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text-primary">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Shipping ({shippingMethod})</span>
          <span className="text-text-primary">
            {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Tax (8%)</span>
          <span className="text-text-primary">${tax.toFixed(2)}</span>
        </div>
        <hr className="border-white/10" />
        <div className="flex justify-between font-semibold">
          <span className="text-text-primary">Total</span>
          <span className="text-text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={handlePlace} isLoading={isPending} className="flex-1">
          Place Order
        </Button>
      </div>
    </div>
  );
}
