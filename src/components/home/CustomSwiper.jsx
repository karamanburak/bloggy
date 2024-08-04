import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import '../../../index.css';

const CustomSwiper = ({ items, ItemComponent }) => {
    return (
        <Swiper
            spaceBetween={30}
            slidesPerView={1}
            modules={[Autoplay, Pagination, Navigation, A11y]}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 2500 }}
        >
            {items.map((item, index) => (
                <SwiperSlide key={index}>
                    <ItemComponent {...item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CustomSwiper;