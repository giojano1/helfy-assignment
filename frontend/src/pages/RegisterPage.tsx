import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { registerSchema, type RegisterSchema } from "../features/auth/schemas/register.schema";
import { useRegister } from "../features/auth/hooks/useRegister";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
        <p className="mt-1 text-sm text-text-muted">Join ShopForge and start shopping</p>
      </div>

      <form onSubmit={handleSubmit((data) => registerUser(data))} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          error={errors.password?.message}
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register("password")}
        />

        <Button type="submit" isLoading={isPending} className="mt-2 w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-primary hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
