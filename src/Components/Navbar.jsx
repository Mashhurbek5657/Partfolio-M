import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");

  const goToSection = (id) => {
    setActive(id);
    navigate("/");

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const Item = ({ id, label, icon }) => (
    <button
      onClick={() => goToSection(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition
                    ${active === id
          ? "bg-white/10 text-white"
          : "text-white/70 hover:text-white"
        }
                  `}
    >
      {icon}
      <span className="hidden sm:inline text-sm">{label}</span>
    </button>
  );

  return (
    <div
      className="
    fixed z-50
    bottom-6 md:top-6
    md:bottom-auto
    left-1/2 -translate-x-1/2
  "
    >
      <nav
        className="
                      flex items-center justify-between
                      w-[820px] md:w-[820px]
                      max-md:w-[320px]
                      h-[64px]
                      px-6
                      rounded-full
                      bg-white/5 backdrop-blur-xl
                      border border-white/10
                      shadow-lg
                    "
      >
        <div
          onClick={() => goToSection("home")}
          className="cursor-pointer hidden md:flex items-center gap-3 text-white"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className=' w-[29px]' viewBox="0 0 640 640"><path fill="#ffffff" d="M184 48C170.7 48 160 58.7 160 72C160 110.9 183.4 131.4 199.1 145.1L200.2 146.1C216.5 160.4 224 167.9 224 184C224 197.3 234.7 208 248 208C261.3 208 272 197.3 272 184C272 145.1 248.6 124.6 232.9 110.9L231.8 109.9C215.5 95.7 208 88.1 208 72C208 58.7 197.3 48 184 48zM128 256C110.3 256 96 270.3 96 288L96 480C96 533 139 576 192 576L384 576C425.8 576 461.4 549.3 474.5 512L480 512C550.7 512 608 454.7 608 384C608 313.3 550.7 256 480 256L128 256zM480 448L480 320C515.3 320 544 348.7 544 384C544 419.3 515.3 448 480 448zM320 72C320 58.7 309.3 48 296 48C282.7 48 272 58.7 272 72C272 110.9 295.4 131.4 311.1 145.1L312.2 146.1C328.5 160.4 336 167.9 336 184C336 197.3 346.7 208 360 208C373.3 208 384 197.3 384 184C384 145.1 360.6 124.6 344.9 110.9L343.8 109.9C327.5 95.7 320 88.1 320 72z" /></svg>
          </div>
          <span className="font-semibold text-lg">
            Mashhurbek <span className="text-blue-600">Portfolio</span>
          </span>
        </div>

        {/* MENU */}
        <div className="flex gap-2 md:gap-8 mx-auto md:mx-0">
          <Item
            id="home"
            label="Home"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className=' w-[20px]' viewBox="0 0 640 640"><path fill="#ffffff" d="M304 70.1C313.1 61.9 326.9 61.9 336 70.1L568 278.1C577.9 286.9 578.7 302.1 569.8 312C560.9 321.9 545.8 322.7 535.9 313.8L527.9 306.6L527.9 511.9C527.9 547.2 499.2 575.9 463.9 575.9L175.9 575.9C140.6 575.9 111.9 547.2 111.9 511.9L111.9 306.6L103.9 313.8C94 322.6 78.9 321.8 70 312C61.1 302.2 62 287 71.8 278.1L304 70.1zM320 120.2L160 263.7L160 512C160 520.8 167.2 528 176 528L224 528L224 424C224 384.2 256.2 352 296 352L344 352C383.8 352 416 384.2 416 424L416 528L464 528C472.8 528 480 520.8 480 512L480 263.7L320 120.3zM272 528L368 528L368 424C368 410.7 357.3 400 344 400L296 400C282.7 400 272 410.7 272 424L272 528z" /></svg>
            }
          />
          <Item
            id="about"
            label="About"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className=' w-[20px]' viewBox="0 0 640 640"><path fill="#ffffff" d="M470.5 463.6C451.4 416.9 405.5 384 352 384L288 384C234.5 384 188.6 416.9 169.5 463.6C133.9 426.3 112 375.7 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320C528 375.7 506.1 426.2 470.5 463.6zM430.4 496.3C398.4 516.4 360.6 528 320 528C279.4 528 241.6 516.4 209.5 496.3C216.8 459.6 249.2 432 288 432L352 432C390.8 432 423.2 459.6 430.5 496.3zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 304C297.9 304 280 286.1 280 264C280 241.9 297.9 224 320 224C342.1 224 360 241.9 360 264C360 286.1 342.1 304 320 304zM232 264C232 312.6 271.4 352 320 352C368.6 352 408 312.6 408 264C408 215.4 368.6 176 320 176C271.4 176 232 215.4 232 264z" /></svg>
            }
          />
          <Item
            id="portfolio"
            label="Portfolio"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className=' w-[20px]' viewBox="0 0 640 640"><path fill="#ffffff" d="M512 464L128 464C119.2 464 112 456.8 112 448L112 304L528 304L528 448C528 456.8 520.8 464 512 464zM528 256L112 256L112 160C112 151.2 119.2 144 128 144L266.7 144C270.2 144 273.5 145.1 276.3 147.2L314.7 176C328.5 186.4 345.4 192 362.7 192L512 192C520.8 192 528 199.2 528 208L528 256zM128 512L512 512C547.3 512 576 483.3 576 448L576 208C576 172.7 547.3 144 512 144L362.7 144C355.8 144 349 141.8 343.5 137.6L305.1 108.8C294 100.5 280.5 96 266.7 96L128 96C92.7 96 64 124.7 64 160L64 448C64 483.3 92.7 512 128 512z" /></svg>
            }
          />
          <Item
            id="contact"
            label="Contact"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className=' w-[20px]' viewBox="0 0 640 640"><path fill="#ffffff" d="M544 144C552.8 144 560 151.2 560 160L560 480C560 488.8 552.8 496 544 496L96 496C87.2 496 80 488.8 80 480L80 160C80 151.2 87.2 144 96 144L544 144zM96 96C60.7 96 32 124.7 32 160L32 480C32 515.3 60.7 544 96 544L544 544C579.3 544 608 515.3 608 480L608 160C608 124.7 579.3 96 544 96L96 96zM240 312C270.9 312 296 286.9 296 256C296 225.1 270.9 200 240 200C209.1 200 184 225.1 184 256C184 286.9 209.1 312 240 312zM208 352C163.8 352 128 387.8 128 432C128 440.8 135.2 448 144 448L336 448C344.8 448 352 440.8 352 432C352 387.8 316.2 352 272 352L208 352zM408 208C394.7 208 384 218.7 384 232C384 245.3 394.7 256 408 256L488 256C501.3 256 512 245.3 512 232C512 218.7 501.3 208 488 208L408 208zM408 304C394.7 304 384 314.7 384 328C384 341.3 394.7 352 408 352L488 352C501.3 352 512 341.3 512 328C512 314.7 501.3 304 488 304L408 304z" /></svg>
            }
          />
        </div>
      </nav>
    </div>
  );
}