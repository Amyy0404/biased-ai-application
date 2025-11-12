import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ModePage.css";

const ModePage = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.className = "mode-body";
    return () => {
      document.body.className = "";
    };
  }, []);

  const slides = [
    {
      id: "anxiety",
      title: "[anxious student]",
      description:
        "Experience how AI feedback can unintentionally heighten self-doubt—rewarding confidence over care, and discouraging cautious reasoning.",
      onSelect: () => navigate("/main"),
    },
    {
      id: "adhd",
      title: "[ADHD]",
      description:
        "Discover how AI systems often misread creativity and idea bursts as disorganisation, over-valuing rigid structure and time control.",
      onSelect: () => navigate("/main-adhd"),
    },
    {
      id: "dyslexia",
      title: "[dyslexia]",
      description:
        "Observe how AI feedback tends to prioritise spelling and grammar over comprehension, undervaluing clarity of thought and conceptual insight.",
      onSelect: () => navigate("/main-dyslexia"),
    },
  ];

  const scrollToIndex = (index) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const slide = track.children[index];
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "center" });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth } = track;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(Math.min(slides.length - 1, activeIndex + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(Math.max(0, activeIndex - 1));
    }
  };

  return (
    <div className="mode-page-container">
      <h1 className="mode-title">
        select <br /> your learner mode
      </h1>

      <p className="mode-subtle-hint" aria-hidden="true">swipe ↔</p>

      <div className="mode-carousel" role="region" aria-label="Learner modes">
        <div
          className="carousel-track"
          ref={trackRef}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-roledescription="carousel"
          aria-live="polite"
        >
          {slides.map((s) => (
            <section key={s.id} className="mode-slide" aria-label={`${s.id} slide`}>
              <div className="mode-container">
                <button className="anxious-student-btn" onClick={s.onSelect}>
                  {s.title}
                </button>
                <p className="mode-description">{s.description}</p>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Mode choices">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeIndex === i}
            className={`dot ${activeIndex === i ? "active" : ""}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModePage;
