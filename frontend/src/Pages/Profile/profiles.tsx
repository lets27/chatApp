import { Camera, Loader, Mail, User } from "lucide-react";
import useUserContext from "../../context/useUser";
import userAcc from "../../assets/userAcc.png";
import { useState } from "react";
import useUpdateProfile from "../../Hooks/useUpdateProfile";
import toast from "react-hot-toast";

const Profile = () => {
  const { loading, user, setUser } = useUserContext(); // Add setUser from context
  const [file, setFile] = useState<File | null>(null);
  const { updating, error, updateProfile } = useUpdateProfile();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);

    // Immediate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImg(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const updatedUser = await updateProfile(formData);

      // Update context with new user data
      if (updatedUser) {
        setUser(updatedUser);
        if (updatedUser) {
          setUser(updatedUser);
          // Wait a frame to ensure image loads
          setTimeout(() => setSelectedImg(null), 100);
        }
      }
    } catch (err) {
      setSelectedImg(null); // Reset on error
    }
  };

  if (error) {
    toast.error(error);
  }

  if (loading) {
    return <Loader className="size-10 animate-spin" />;
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || user?.profilePic || userAcc}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user && user.username}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user && user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                {/* <span>{user && user.createdAt?.split("T")[0]}</span> */}
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
