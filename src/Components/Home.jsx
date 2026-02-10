import React from "react";
import Threads from "./Threads";
import StyledButton from "./StyledButton";
import Button from "./Button";
import MagicBento from "./MagicBento";
import May from "./May";
import Login from "./Login";
import Footer from "./Footer";

import img2 from "../../public/Annotation 2026-02-06 192821.png";
import img3 from "../../public/Frontend/Annotation 2026-02-09 172650.png";

export default function Home() {
    return (
        <div className="bg-[#060010] text-white">

            {/* ================= HOME ================= */}
            <section id="home" className="relative min-h-screen overflow-hidden pt-[200px]">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <Threads
                        color={[1, 1, 1]}
                        amplitude={1}
                        distance={0.1}
                        enableMouseInteraction
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col xs:flex-col sm:flex-row justify-between items-center p-4">
                    <div className="text-center xs:text-center sm:text-left">
                        <h1 className="text-[22px] xs:text-[25px] sm:text-[30px] font-bold mb-4">
                            Mashhurbek Ergashev
                        </h1>
                        <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-4">
                            Frontend Development
                        </h2>

                        <Button />

                        <div className="flex flex-wrap gap-4 mt-8 justify-center sm:justify-start">
                            <StyledButton>
                                <div className="flex gap-4 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px]" viewBox="0 0 640 640">
                                        <path fill="#0546b8" d="M176.1 65.4C195.8 60 216.4 70.1 224.2 88.9L264.7 186.2C271.6 202.7 266.8 221.8 252.9 233.2L208.8 269.3C241.3 340.9 297.8 399.3 368.1 434.2L406.7 387C418 373.1 437.1 368.4 453.7 375.2L551 415.8C569.8 423.6 579.9 444.2 574.5 463.9C555.4 534.1 492.9 589.3 416.6 573.2C241.6 536.1 103.9 398.4 66.8 223.4C50.7 147.1 105.9 84.6 170.5 66.9L176.1 65.4z" />
                                    </svg>
                                    <span>97 380 42 88</span>
                                </div>
                            </StyledButton>
                        </div>
                    </div>

                    <div className="mt-6 xs:mt-6 sm:mt-0 flex justify-center items-center w-[200px] xs:w-[250px] sm:w-[350px] h-[200px] xs:h-[250px] sm:h-[350px] rounded-full border-2 border-blue-600 p-3 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        <img src={img2} alt="profile" className="rounded-full" />
                    </div>
                </div>
            </section>

            {/* ================= PORTFOLIO ================= */}
            <section id="portfolio" className="max-w-[1200px] mx-auto pt-[120px] px-4">
                <h1 className=" text-center font-bold text-[30px]">Portfolio</h1>
                <p className=" text-center">Men frontend dasturchiman — zamonaviy, tezkor va responsive web-saytlar yarataman.</p>
                <p className=" text-center mb-[20px]">Har bir loyiha dizayn va funksionallik uyg‘unligiga asoslanadi. Sifatli va ishonchli natija kafolatlanadi.</p>                <MagicBento
                    textAutoHide
                    enableStars
                    enableSpotlight
                    enableBorderGlow
                    clickEffect
                    spotlightRadius={400}
                    particleCount={12}
                    glowColor="132, 0, 255"
                />
            </section>

            {/* ================= ABOUT ================= */}
            <section id="about" className="max-w-[1200px] mx-auto pt-[120px] px-4">
                <h1 className=" text-center font-bold text-[30px]">Abaut Me</h1>
                <p className=" text-center mb-14">Frontend dasturchi sifatida tezkor, moslashuvchan va zamonaviy saytlar qilaman. Sizning biznesingiz uchun samarali yechimlar taklif qilaman.</p>

                <div className="flex flex-col xs:flex-col sm:flex-row justify-between items-center gap-6 sm:gap-12">
                    <div className="flex justify-center items-center w-[200px] xs:w-[250px] sm:w-[300px] h-[250px] xs:h-[300px] sm:h-[390px] rounded-t-full border-[1px] border-blue-600 p-3 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        <img src={img3} alt="about" className="rounded-t-full w-[300px]" />
                    </div>
                    <May />
                </div>
            </section>

            {/* ================= CONTACT ================= */}
            <section id="contact" className="max-w-[1200px] mx-auto pt-[120px] px-4">
                <h1 className=" text-center font-bold text-[30px]">Contact Me</h1>
                <p className=" text-center font-bold text-[15px]">Professional Frontend Development xizmatlari. HTML, CSS, JavaScript, React va Tailwind bilan zamonaviy web-saytlar.</p>
                <p className=" text-center font-bold text-[15px] mb-10">🚀 Sayt buyurtma berish uchun hoziroq murojaat qiling.</p>

                <div className="flex flex-col xs:flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10">
                    <iframe
                        src="https://my.spline.design/genkubgreetingrobot-BEJT5t4bdIAhgacAXRzXgd9K/"
                        className="w-full z-auto xs:w-[300px] sm:w-[500px] h-[200px] xs:h-[260px] sm:h-[500px] rounded-md"
                    />
                    <Login />
                </div>
            </section>
            <Footer />
        </div>
    );
}