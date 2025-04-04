import React, { useState, useEffect } from "react";

const RightPanel = () => {
    const [randomImage, setRandomImage] = useState("");

    useEffect(() => {
        const getRandomImage = () => `https://picsum.photos/1200/900?random=${Math.random()}`;
        setRandomImage(getRandomImage());
    }, []);

    return (
        <div
            className="flex-1 bg-green-100 text-center hidden lg:flex"
            style={{
                backgroundImage: `url(${randomImage})`,
                backgroundSize: "cover",   // Şəkil tam dolsun
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100vh",
            }}
        >
            <img src={randomImage} alt="Random" width="1" height="1" className="hidden" />
        </div>
    );
};

export default RightPanel;
