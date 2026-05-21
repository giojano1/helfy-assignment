import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { passwordSchema, type PasswordSchema } from "../schemas/profile.schema";
import { accountService } from "../services/account.service";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function PasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      accountService.changePassword(data),
    onSuccess: () => toast.success("Password changed successfully."),
    onError: () => toast.error("Failed to change password."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordSchema>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = (data: PasswordSchema) => {
    changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Current Password"
        type={showCurrent ? "text" : "password"}
        error={errors.currentPassword?.message}
        rightAddon={
          <button type="button" onClick={() => setShowCurrent((s) => !s)} className="text-text-muted hover:text-text-primary">
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("currentPassword")}
      />
      <Input
        label="New Password"
        type={showNew ? "text" : "password"}
        error={errors.newPassword?.message}
        rightAddon={
          <button type="button" onClick={() => setShowNew((s) => !s)} className="text-text-muted hover:text-text-primary">
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("newPassword")}
      />
      <Input
        label="Confirm New Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" isLoading={isPending} className="self-start">
        Change Password
      </Button>
    </form>
  );
}
