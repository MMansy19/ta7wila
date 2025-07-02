import { useTranslation } from '@/hooks/useTranslation';
import Image from "next/image";

export default function PaymentServices() {
  const translations = useTranslation();

  return (
    <div className="flex flex-col items-center px-4 py-6 bg-img2 bg-black">
      <div className="flex relative gap-2 justify-center items-start  pt-10 pb-20 max-w-full  max-md:px-5">
        <div className="flex z-0 flex-col justify-center items-center my-auto  max-md:max-w-full">
          <div className="flex flex-col items-center max-w-full ">
            <h2 className="text-2xl font-bold text-right text-white">
              {translations.whatispayment}
            </h2>
            <p className="mt-12 text-base leading-6 text-center text-neutral-400 w-[714px] max-md:mt-10 max-md:max-w-full">
              {translations.paymentDescription}
            </p>
          </div>
          <div className="w-full max-w-[333px] md:max-w-[500px] mx-auto my-10">
            <Image src="/Frame 27.svg" width="800" height="900" alt="" />
            {/* <div className="relative w-[500px] h-[500px] mx-auto">
              {/* الشمس في المنتصف */}
              {/* <div className="w-16 h-16 bg-[#A5CBAD] bg-opacity-20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-xl flex items-center justify-center">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_45_428)">
                    <path
                      d="M17.1571 8.05762V5.05762C17.1571 4.7924 17.0517 4.53805 16.8642 4.35051C16.6766 4.16297 16.4223 4.05762 16.1571 4.05762H6.15707C5.62664 4.05762 5.11793 4.26833 4.74286 4.6434C4.36779 5.01848 4.15707 5.52718 4.15707 6.05762M4.15707 6.05762C4.15707 6.58805 4.36779 7.09676 4.74286 7.47183C5.11793 7.8469 5.62664 8.05762 6.15707 8.05762H18.1571C18.4223 8.05762 18.6766 8.16297 18.8642 8.35051C19.0517 8.53805 19.1571 8.7924 19.1571 9.05762V12.0576M4.15707 6.05762V18.0576C4.15707 18.5881 4.36779 19.0968 4.74286 19.4718C5.11793 19.8469 5.62664 20.0576 6.15707 20.0576H18.1571C18.4223 20.0576 18.6766 19.9523 18.8642 19.7647C19.0517 19.5772 19.1571 19.3228 19.1571 19.0576V16.0576"
                      stroke="#A5CBAD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.1571 12.0576V16.0576H16.1571C15.6267 16.0576 15.118 15.8469 14.7429 15.4718C14.3678 15.0968 14.1571 14.5881 14.1571 14.0576C14.1571 13.5272 14.3678 13.0185 14.7429 12.6434C15.118 12.2683 15.6267 12.0576 16.1571 12.0576H20.1571Z"
                      stroke="#A5CBAD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_45_428">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0.157104 0.0576172)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              {[0, 1, 2].map((orbitIndex) => {
                const radius = 90 + orbitIndex * 70;
                const duration = 10 + orbitIndex * 2;

                const points =
                  orbitIndex === 0
                    ? [{ angle: 180, image: "/ocash.svg", size: 40 }]
                    : orbitIndex === 1
                      ? [
                          { angle: 270, color: "bg-[#F58C7B]", size: 12 },
                          { angle: 180, image: "/instapay.svg", size: 40 },

                          { angle: 315, color: "bg-[#A5CBAD]", size: 14 },
                          {
                            angle: 0,
                            image: "/ecash.svg",
                            size: 30,
                            bgColor: "#A0A0A0",
                          },
                          { angle: 90, color: "bg-[#F58C7B]", size: 12 },
                        ]
                      : [
                          {
                            angle: 10,
                            image: "/vcash.svg",
                            size: 50,
                            bgColor: "#F58C7B",
                          },
                          { angle: 135, color: "bg-[#A5CBAD]", size: 12 },
                          {
                            angle: 225,
                            image: "/wecash.svg",
                            size: 30,
                          },
                          { angle: 90, color: "bg-[#F58C7B]", size: 12 },
                        ];

                return (
                  <div
                    key={orbitIndex}
                    className="absolute top-1/2 left-1/2 rounded-full border border-gray-400/30"
                    style={{
                      width: `${radius * 2}px`,
                      height: `${radius * 2}px`,
                      marginLeft: `-${radius}px`,
                      marginTop: `-${radius}px`,
                    }}
                  >
                    <div
                      className="w-full h-full absolute"
                      style={{
                        animation: `spin ${duration}s linear infinite`,
                      }}
                    >
                      {points.map((point, pointIndex) => {
                        const angleRad = (point.angle * Math.PI) / 180;
                        const x =
                          radius + radius * Math.cos(angleRad) - point.size / 2;
                        const y =
                          radius + radius * Math.sin(angleRad) - point.size / 2;

                        return point.image ? (
                          <div
                            key={pointIndex}
                            className="absolute flex items-center justify-center rounded-full"
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              width: `${point.size + 16}px`,
                              height: `${point.size + 16}px`,
                              backgroundColor: point.bgColor
                                ? point.bgColor.includes("rgba")
                                  ? point.bgColor
                                  : point.bgColor
                                : "rgba(242, 242, 242, 0.2)",
                              borderRadius: "50%",
                              padding: "4px",
                            }}
                          >
                            <Image
                              src={point.image}
                              alt={`planet-${pointIndex}`}
                              width={point.size}
                              height={point.size}
                              style={{
                                width: `${point.size}px`,
                                height: `${point.size}px`,
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            key={pointIndex}
                            className={`absolute rounded-full ${point.color}`}
                            style={{
                              width: `${point.size}px`,
                              height: `${point.size}px`,
                              left: `${x}px`,
                              top: `${y}px`,
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>  */}

            {/* <style jsx>{`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style> */}
          </div>
        </div>
      </div>
    </div>
  );
}
