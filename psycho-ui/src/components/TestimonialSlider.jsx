import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import TestimonialCard from "./TestimonialCard";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const testimonies = [
    {
        title: "Une carrière enrichissante",
        imageUrl: "/assets/testimoniesImages/testimony1.jpg",
    },
    {
        title: "Servez votre pays avec fierté",
        imageUrl: "/assets/testimoniesImages/testimony2.jpeg",
    },
    {
        title: "Une aventure unique",
        imageUrl: "/assets/testimoniesImages/testimony3.jpg",
    },
];

const TestimonialSlider = () => {
    return (
        <Swiper
            spaceBetween={50}
            centeredSlides={true}
            autoplay={{ delay: 3000 }}
            // effect={"fade"}
            modules={[Autoplay]}
        >
            {testimonies.map((testimony) => {
                return (
                    <SwiperSlide>
                        {
                            <TestimonialCard
                                key={testimony.imageUrl}
                                title={testimony.title}
                                imageUrl={testimony.imageUrl}
                            />
                        }
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default TestimonialSlider;
