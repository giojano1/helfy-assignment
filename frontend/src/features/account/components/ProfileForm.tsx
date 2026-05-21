import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import type { UserProfile } from "../types";

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { mutate: update, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      avatarUrl: profile.avatarUrl ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => update(data))} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" error={errors.firstName?.message} {...register("firstName")} />
        <Input label="Last Name" error={errors.lastName?.message} {...register("lastName")} />
      </div>
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input label="Avatar URL" placeholder="https://…" error={errors.avatarUrl?.message} {...register("avatarUrl")} />
      <Button type="submit" isLoading={isPending} className="mt-2 self-start">
        Save Changes
      </Button>
    </form>
  );
}
