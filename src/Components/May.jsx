import React from "react";
import img1 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_07_15 PM.png";
import img2 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_08_12 PM.png";
import img3 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_07_55 PM.png";
import img4 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_08_22 PM.png";
import img5 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_11_59 PM.png";
import img6 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_08_54 PM.png";
import img7 from "../../public/Frontend/ChatGPT Image Feb 9, 2026, 03_08_57 PM.png";

const skills = [
  { name: "HTML", img: img1 },
  { name: "CSS", img: img2 },
  { name: "SCSS", img: img3 },
  { name: "Bootstrap", img: img4 },
  { name: "JavaScript", img: img5 },
  { name: "React", img: img6 },
  { name: "Vite", img: img7 },
];

export default function May() {
  return (
    <div
      className="relative xs:w-full sm:w-[670px] rounded-[20px] overflow-hidden shadow-xl"
      style={{
        backgroundImage: `url()`, // keyinchalik background qo‘yish mumkin
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 p-4 xs:p-6 text-white h-full flex flex-col justify-between">
        <span className="flex gap-1 mb-12 xs:mb-[60px] font-semibold text-[20px] xs:text-[1px]">
          Salom, siz bilan
          <div className="text-blue-600">Mashhurbek Ergashev</div>👋
        </span>

        <div>
          <h3 className="text-[14px] xs:text-[15px] mb-10 xs:mb-[50px] font-medium mt-2">
            Frontend Development yo‘nalishida zamonaviy va tezkor web-saytlar yarataman.
            HTML, CSS, JavaScript, React va Tailwind yordamida chiroyli, moslashuvchan
            va yuqori sifatli interfeyslar ishlab chiqaman.
          </h3>
        </div>

        <div>
          <h1 className="font-medium text-[18px] xs:text-[20px]">Mening soham bo‘yicha tajribam:</h1>
          <br />
          <div className="flex gap-5 flex-wrap justify-center xs:justify-start">
            {skills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center w-[70px] xs:w-[80px]">
                <div className="relative w-[64px] h-[64px] xs:w-[72px] xs:h-[72px]">
                  <svg className=" -mt-1 -ml-1 flex justify-center items-center">
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      stroke="#2a2a2a"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="32"
                      stroke="#ff7a00"
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray="201"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Skill icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={skill.img}
                      alt={skill.name}
                      className="w-10 h-10 xs:w-11 xs:h-11 object-contain"
                    />
                  </div>
                </div>

                <p className="text-orange-500 font-semibold mt-1 text-xs">100%</p>
                <p className="text-gray-300 font-semibold text-[13px] xs:text-[15px] mt-0.5 text-center">
                  {skill.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}