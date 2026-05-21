import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginSchema } from "../features/auth/schemas/login.schema";
import { useLogin } from "../features/auth/hooks/useLogin";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-muted">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit((data) => login(data))} className="flex flex-col gap-4">
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
          placeholder="••••••••"
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
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-brand-primary hover:underline">
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
