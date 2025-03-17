import Images from "@/constants/Images";
import CalculateMainContent from "@/components/page/calculate/CalculateMainContent";

export default function CalculatePage() {
    
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url(${Images.calculateHeroBackground})` }}
    >
      {/* The overlay of black color */}
      <div className="absolute inset-0 bg-black/50"></div>
      {/* The main content for the calculate page */}
      <CalculateMainContent/>
    </main>
  )
}
