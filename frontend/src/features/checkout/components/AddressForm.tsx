import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressSchema } from "../schemas/address.schema";
import { useCheckoutStore } from "../store/checkoutStore";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function AddressForm() {
  const { shippingAddress, setShippingAddress, nextStep } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: shippingAddress ?? undefined,
  });

  const onSubmit = (data: AddressSchema) => {
    setShippingAddress(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Full Name" placeholder="John Doe" error={errors.fullName?.message} {...register("fullName")} />
      <Input label="Address" placeholder="123 Main St" error={errors.address?.message} {...register("address")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="City" placeholder="New York" error={errors.city?.message} {...register("city")} />
        <Input label="ZIP Code" placeholder="10001" error={errors.zip?.message} {...register("zip")} />
      </div>
      <Input label="Country" placeholder="United States" error={errors.country?.message} {...register("country")} />
      <Button type="submit" className="mt-2">Continue</Button>
    </form>
  );
}
