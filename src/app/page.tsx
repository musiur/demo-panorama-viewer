import React from "react";
import dynamic from "next/dynamic";

const PanoramaViewer = dynamic(() => import("../components/panorama_viewer"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  return (
    <div className="w-[100dvw] h-[100dvh] bg-gray-50 flex items-center justify-center">
      {/* <div className="w-[800px] h-[400px] rounded-2xl border-8 border-red-600">
        
      </div> */}
      <PanoramaViewer imageUrl="/bb.jpg" />
    </div>
  );
};

export default HomePage;
