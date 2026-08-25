import { Navbar } from "@/components/ui/navbar";
import { LoadingProfile } from "@/components/ui/loading-profile";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LoadingProfile />
    </div>
  );
}
