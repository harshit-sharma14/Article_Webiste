import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HorizontalScroll = ({ articles }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-800 py-6">
      <Slider {...settings}>
        {articles.map((article, index) => (
          <div key={index} className="px-2">
            <div className="p-4 bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-white text-center">
                {article.title}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default HorizontalScroll;