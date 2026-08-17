import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import LoginModal from "../../components/forms/LoginModal";

import { getTopDestinations } from "../../services/destinationService";
import heroImage from "../../assets/4928.avif";

const LandingPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login modal state
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Fetch top destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTopDestinations(4);

        setDestinations(data);
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Login success handler
  const handleLoginSuccess = (user) => {
    console.log("Login successful:", user);

    // Later:
    // Save JWT token
    // Update AuthContext
    // Navigate to dashboard
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* =========================
          NAVBAR
      ========================== */}
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
      />


      {/* =========================
          HERO SECTION
      ========================== */}
      <section
        className="
          relative
          h-[520px]
          flex
          items-center
          px-8
          md:px-16
          overflow-hidden
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >

        {/* Dark Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/70
            via-black/40
            to-transparent
            z-10
          "
        />

        {/* Hero Content */}
        <div className="relative z-20 max-w-lg text-white">

          <h1
            className="
              text-4xl
              md:text-5xl
              font-serif
              font-bold
              leading-tight
              mb-4
            "
          >
            Explore
            <br />
            The Beauty of
            <br />
            Sri Lanka
          </h1>

          <p
            className="
              text-gray-200
              text-sm
              md:text-base
              mb-6
              max-w-md
            "
          >
            Discover amazing places, luxury stays, delicious food
            and unforgettable experiences across Sri Lanka.
          </p>

          {/* Explore Button */}
          <Link
            to="/attractions"
            className="
              bg-teal-700
              hover:bg-teal-800
              text-white
              px-6
              py-3
              rounded-lg
              font-medium
              transition
              shadow-lg
              inline-block
            "
          >
            Explore Now
          </Link>

        </div>
      </section>


      {/* =========================
          TOP DESTINATIONS
      ========================== */}
      <section
        className="
          px-8
          md:px-16
          py-12
          max-w-7xl
          mx-auto
        "
      >

        {/* Section Header */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            Top Destinations
          </h2>

          <Link
            to="/attractions"
            className="
              bg-teal-700
              hover:bg-teal-800
              text-white
              px-4
              py-2
              rounded-lg
              text-sm
              font-medium
              transition
            "
          >
            View All
          </Link>

        </div>


        {/* =========================
            LOADING STATE
        ========================== */}
        {loading && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-4
              gap-6
            "
          >
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="
                  h-64
                  rounded-2xl
                  bg-gray-200
                  animate-pulse
                "
              />
            ))}
          </div>
        )}


        {/* =========================
            ERROR STATE
        ========================== */}
        {error && !loading && (
          <div className="text-center py-12">

            <p className="text-red-500 mb-4">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="
                bg-teal-700
                hover:bg-teal-800
                text-white
                px-5
                py-2
                rounded-lg
                text-sm
              "
            >
              Try Again
            </button>

          </div>
        )}


        {/* =========================
            DESTINATION CARDS
        ========================== */}
        {!loading && !error && destinations.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-4
              gap-6
            "
          >

            {destinations.map((item) => (
              <Link
                to={`/attractions/${item.id}`}
                key={item.id}
                className="
                  relative
                  h-64
                  rounded-2xl
                  overflow-hidden
                  shadow-md
                  group
                  cursor-pointer
                "
              >

                {/* Destination Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition
                    duration-300
                  "
                />

                {/* Image Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/20
                    to-transparent
                  "
                />

                {/* Destination Information */}
                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    text-white
                  "
                >

                  <h3
                    className="
                      font-bold
                      text-lg
                      leading-tight
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      text-xs
                      text-gray-300
                    "
                  >
                    {item.category}
                  </p>

                </div>

              </Link>
            ))}

          </div>
        )}


        {/* =========================
            EMPTY STATE
        ========================== */}
        {!loading && !error && destinations.length === 0 && (
          <div className="text-center py-12">

            <p className="text-gray-500">
              No destinations available.
            </p>

          </div>
        )}

      </section>


      {/* =========================
          LOGIN MODAL
      ========================== */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
};

export default LandingPage;