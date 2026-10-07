import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FiCamera } from "react-icons/fi";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import { updateProfile, uploadAvatar } from "../services/profileService";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      username: user?.username,
      timezone: user?.timezone,
      tradingStyle: user?.tradingStyle,
      experience: user?.experience,
      preferredPairs: user?.preferredPairs?.join(", ") || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => setUser(updatedUser),
  });

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (avatar) => setUser((u) => ({ ...u, avatar })),
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      preferredPairs: data.preferredPairs.split(",").map((p) => p.trim().toUpperCase()).filter(Boolean),
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  return (
    <div className="profile-page">
      <Card className="profile-page__avatar-card">
        <div className="profile-page__avatar" onClick={() => fileInputRef.current?.click()}>
          {user?.avatar?.url ? (
            <img src={user.avatar.url} alt={user.username} />
          ) : (
            <span>{user?.username?.[0]?.toUpperCase()}</span>
          )}
          <div className="profile-page__avatar-overlay">
            <FiCamera />
          </div>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          hidden
        />
        <div>
          <h3>{user?.username}</h3>
          <p>{user?.email}</p>
        </div>
      </Card>

      <Card>
        <h3 className="profile-page__section-title">Profile details</h3>
        <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="profile-form__row">
            <Input label="Username" {...register("username")} />
            <Input label="Timezone" {...register("timezone")} placeholder="e.g. Africa/Lagos" />
          </div>
          <div className="profile-form__row">
            <div className="input-group">
              <label className="input-group__label">Trading Style</label>
              <div className="input-group__field">
                <select {...register("tradingStyle")}>
                  <option value="scalper">Scalper</option>
                  <option value="day-trader">Day Trader</option>
                  <option value="swing-trader">Swing Trader</option>
                  <option value="position-trader">Position Trader</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-group__label">Experience</label>
              <div className="input-group__field">
                <select {...register("experience")}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </div>
          </div>
          <Input label="Preferred Pairs (comma-separated)" {...register("preferredPairs")} />
          <Button type="submit" loading={isSubmitting || updateMutation.isPending}>Save changes</Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
