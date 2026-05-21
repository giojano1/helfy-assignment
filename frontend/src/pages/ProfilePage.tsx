import { motion } from "framer-motion";
import { useProfile } from "../features/account/hooks/useProfile";
import { ProfileForm } from "../features/account/components/ProfileForm";
import { PasswordForm } from "../features/account/components/PasswordForm";
import { Skeleton } from "../components/ui/Skeleton";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <div className="flex flex-col gap-10 max-w-2xl">
        <section>
          <h1 className="mb-6 text-2xl font-bold text-text-primary">Profile</h1>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton height="44px" />
              <Skeleton height="44px" />
              <Skeleton height="44px" />
            </div>
          ) : profile ? (
            <ProfileForm profile={profile} />
          ) : null}
        </section>

        <hr className="border-white/10" />

        <section>
          <h2 className="mb-6 text-xl font-semibold text-text-primary">Change Password</h2>
          <PasswordForm />
        </section>
      </div>
    </motion.div>
  );
}
