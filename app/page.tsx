import { Home } from "@/components/allaccess/Home";
import { loadNiemeyerPhotos } from "@/lib/niemeyerPhotos";

// Server entry: reads build-time assets (Sarah's Niemeyer photographs), then
// hands over to the client-side experience.
export default async function Page() {
  const niemeyerPhotos = await loadNiemeyerPhotos();
  return <Home niemeyerPhotos={niemeyerPhotos} />;
}
