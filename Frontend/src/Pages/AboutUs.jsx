import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-80 flex items-center justify-center bg-cover bg-center bg-[url('https://source.unsplash.com/1600x900/?office,team')]">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-2 text-lg">Empowering innovation, one project at a time.</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>
        <p className="mt-4 text-lg text-gray-600">
          We strive to deliver high-quality articles that inform, inspire, and engage our readers. Our commitment is to provide accurate, insightful, and well-researched content.
        </p>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-semibold">Join Our Journey</h2>
        <p className="mt-2 text-lg">We’re always looking for passionate writers and readers to be part of our community.</p>
        <button className="mt-6 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
