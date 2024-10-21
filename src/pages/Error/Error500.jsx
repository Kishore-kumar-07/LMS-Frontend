import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

const Error500 = () => {
  const [animationData, setAnimationData] = useState(null);
  const animationDataUrl =
    "https://lottie.host/ddc912b9-b752-4121-bdba-372fb76e979a/r6LX4r4vpM.json";

  useEffect(() => {
    const fetchAnimationData = async () => {
      const response = await fetch(animationDataUrl);
      const data = await response.json();
      setAnimationData(data);
    };

    fetchAnimationData();
  }, [animationDataUrl]);


  const navigate = useNavigate();
  const handleBack = () =>{
    navigate('/');
  }


  return (
    <div className="flex  flex-col items-center justify-center min-h-screen p-4">
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: "300px", height: "300px" }}
        />
      ) : (
        <p>Loading animation...</p>
      )}
      <h1 className="text-4xl font-bold text-red-600 mb-2">
        Oops! Internal Server Error
      </h1>
      <p className="text-lg text-gray-700 mb-4">Failed to load the content</p>
      <button
        onClick={handleBack}
className=" text-xl border-2 border-black w-fit p-2 h-fit rounded-lg hover:bg-slate-100 "      >
        Go to Home
      </button>
    </div>
  );
};

export default Error500;