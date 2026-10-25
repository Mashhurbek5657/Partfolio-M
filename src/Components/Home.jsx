import React from "react";
import Threads from "./Threads";
import StyledButton from "./StyledButton";
import Button from "./Button";
import MagicBento from "./MagicBento";
import May from "./May";
import Login from "./Login";
import Lanyard from "./Lanyard";
import Footer from "./Footer";


import { useState } from "react";
import {
    FaHtml5,
    FaCss3Alt,
    FaJs,
    FaReact,
    FaBootstrap,
    FaGithub,
} from "react-icons/fa";
import { SiVite } from "react-icons/si";


import img3 from "../../public/Кодер в неоновом рабочем пространстве.png";
import img2 from "../../public/Аниме-портрет в худи Front End.png";

export default function Home() {
    return (
        <div className="bg-[#060010] text-white">

            {/* ================= HOME ================= */}
            <section id="home" className="relative min-h-screen overflow-hidden pt-[200px]">
                {/* Background */}
                <div className="!-mt-[15px]">
                    <div
                        className="relative z-10 max-w-[1200px] mx-auto 
        flex flex-col xl:flex-row 
        justify-between items-center p-4"
                    >
                        {/* TEXT SECTION */}
                        <div className="text-center xl:text-left order-2 xl:order-1">
                            <h1 className="text-[22px] xs:text-[25px] sm:text-[30px] font-bold mb-4">
                                Mashhurbek Ergashov
                            </h1>

                            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-4">
                                Frontend Development
                            </h2>
                            <Button />

                            <div className="flex flex-wrap gap-4 mt-3 justify-center xl:justify-start">
                                <StyledButton>
                                    <div className="flex gap-4 items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-[20px]"
                                            viewBox="0 0 640 640"
                                        >
                                            <path
                                                fill="#0546b8"
                                                d="M176.1 65.4C195.8 60 216.4 70.1 224.2 88.9L264.7 186.2C271.6 202.7 266.8 221.8 252.9 233.2L208.8 269.3C241.3 340.9 297.8 399.3 368.1 434.2L406.7 387C418 373.1 437.1 368.4 453.7 375.2L551 415.8C569.8 423.6 579.9 444.2 574.5 463.9C555.4 534.1 492.9 589.3 416.6 573.2C241.6 536.1 103.9 398.4 66.8 223.4C50.7 147.1 105.9 84.6 170.5 66.9L176.1 65.4z"
                                            />
                                        </svg>
                                        <span>97 210 88 04</span>
                                    </div>
                                </StyledButton>
                            </div>
                        </div>

                        {/* IMAGE SECTION */}
                        <div
                            className="order-1 xl:order-2 
          mt-6 xl:mt-0
          flex justify-center items-center
          w-[200px] xs:w-[250px] sm:w-[350px]
          h-[200px] xs:h-[250px] sm:h-[350px]
          rounded-full border-2 border-blue-600 p-3
          shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                        >
                            <div className="orbit-scene">

                                {/* Faqat ikonkalarning orbitasi aylanadi */}
                                <div className="orbit-ring">
                                    <div className="orbit-icon html" title="HTML5">
                                        <FaHtml5 />
                                    </div>

                                    <div className="orbit-icon css" title="CSS3">
                                        <FaCss3Alt />
                                    </div>

                                    <div className="orbit-icon javascript" title="JavaScript">
                                        <FaJs />
                                    </div>

                                    <div className="orbit-icon react" title="React">
                                        <FaReact />
                                    </div>

                                    <div className="orbit-icon bootstrap" title="Bootstrap">
                                        <FaBootstrap />
                                    </div>

                                    <div className="orbit-icon github" title="GitHub">
                                        <FaGithub />
                                    </div>

                                    <div className="orbit-icon vite" title="Vite">
                                        <SiVite />
                                    </div>
                                </div>

                                {/* Rasm markazda o'z holicha qoladi */}
                                <div className="orbit-profile">
                                    <img
                                        src={img2}
                                        alt="Mashhurbek Ergashev"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Content */}
            </section>

            {/* ================= PORTFOLIO ================= */}
            <div className=" flex justify-center items-center">
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
            </div>

            {/* ================= ABOUT ================= */}
            <section id="about" className="max-w-[1200px] mx-auto pt-[120px] px-4">
                <h1 className="text-center font-bold text-[30px]">Abaut Me</h1>
                <p className="text-center mb-14">Frontend dasturchi sifatida tezkor, moslashuvchan va zamonaviy saytlar qilaman. Sizning biznesingiz uchun samarali yechimlar taklif qilaman.</p>

                <div className="flex flex-col xs:flex-col sm:flex-row justify-between items-center gap-6 sm:gap-12">
                    <div className="w-full sm:w-[400px] h-[420px] xs:h-[460px] sm:h-[520px] shrink-0">
                        <Lanyard
                            frontImage={img3}
                            backImage={img2}
                            strapImage="/band.png"
                            imageFit="cover"
                            cardColor="#ffffff"
                            orientation="portrait"
                            finish="glossy"
                            cornerRadius={0.3}
                            size={0.6}
                            anchor="center"
                            strapLength={0.5}
                            strapColor="#111111"
                            strapWidth={0.65}
                            metal="silver"
                            gravity={1}
                            damping={0.5}
                            elasticity={0.5}
                            breeze={0.5}
                            interactive
                            intro
                        />
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
                        className="
            w-full
            z-auto
            h-[260px]
            xs:w-[340px] xs:h-[320px]
            sm:w-[500px] sm:h-[420px]
            rounded-md
        "
                    />
                    <Login />
                </div>
            </section>
            <Footer />
        </div>
    );
}