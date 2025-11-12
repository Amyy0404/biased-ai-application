import React, { useEffect } from "react";
import "../Styles/AboutPage.css";

const AboutPage = () => {
  useEffect(() => {
    document.body.className = "about-body"; 
    return () => {
      document.body.className = ""; 
    };
  }, []);

  return (
    <div className="about-wrapper"> 
      <div className="about-container">
        <h1 className="about-title">challenging the neutrality of AI in learning differences</h1>

        <div className="about-columns">
          <div className="about-column">
            <p>
              My project, <strong>“Challenging the Neutrality of Generative AI in Learning”</strong>,
              explores how educational AI tools often misrepresent or overlook learners with cognitive differences
              such as <strong>dyslexia, ADHD, and anxiety</strong>. While these systems are promoted as accessible
              and objective, they are trained on datasets that reflect existing social norms and biases. This means
              they can unintentionally reinforce ableist assumptions—rewarding rigid focus and neat structure, while
              undervaluing creativity, reflective reasoning, or non-linear thinking.
            </p>

            <p>
              The interactive platform I designed invites users to experience how AI feedback can subtly
              misinterpret diverse learning styles. By selecting a learner mode—Dyslexic, ADHD, or Anxious—users
              receive AI-generated feedback that mirrors real-world bias in educational contexts.
            </p>
          </div>

          <div className="about-column">
            <p>
              A key feature, <strong>Transparency Mode</strong>, allows users to reveal the assumptions
              underlying the AI’s feedback. It exposes how certain phrases or tones reflect hidden
              biases related to gender, class, and ability. This makes visible the subtle, often unspoken
              ways technology can shape perceptions of what a “good learner” should be.
            </p>

            <p>
              As <em>Zhou et al. (2023)</em> and <em>Foley & Melese (2025)</em> note, addressing such
              biases requires more than technical solutions—it demands cultural and ethical reflection.
              By allowing users to rate responses as Helpful, Neutral, or Harmful, this project becomes
              both analytical and participatory, encouraging critical awareness of how digital systems
              define and limit inclusion in education.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
