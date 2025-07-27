import CustomerServiceDemo from "@/components/demos/CustomerServiceDemo";
import RealEstateDemo from "@/components/demos/RealEstateDemo";
import LandingPageDemo from "@/components/demos/LandingPageDemo";

export default function TestDemos() {
  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-3xl text-white mb-8">Demo Components Test</h1>
      
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-xl text-white mb-4">Customer Service Demo</h2>
          <CustomerServiceDemo />
        </div>
        
        <div>
          <h2 className="text-xl text-white mb-4">Real Estate Demo</h2>
          <RealEstateDemo />
        </div>
        
        <div>
          <h2 className="text-xl text-white mb-4">Landing Page Demo</h2>
          <LandingPageDemo />
        </div>
      </div>
    </div>
  );
}