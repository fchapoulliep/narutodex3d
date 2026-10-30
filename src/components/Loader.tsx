/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.css";

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /** Plays the closing animation (the black disc shrinks to the center). */
  closing: boolean;
  /** Called once the closing animation is over, for the page to remove the loader. */
  onClosed: () => void;
}

/**
 * Loader component that displays a loading animation.
 *
 * This component includes:
 * - A Sharingan Radar animation.
 *
 * @component
 * @example
 * return (
 *   <Loader />
 * )
 */
const Loader: React.FC<LoaderProps> = ({ closing, onClosed }) => {
  return (
    <div
      className={`loader${closing ? " animation" : ""}`}
      onAnimationEnd={(event) => {
        // The inner animation loops forever: only the disc's own closing animation counts.
        if (event.target === event.currentTarget && closing) {
          onClosed();
        }
      }}
    >
      <div className="eye">
        <svg className="sharingan" viewBox="0 0 100 100">
          <g id="full_pupil">
            <circle id="iris" r="30" cx="50%" cy="50%"></circle>
            <circle id="pupil" r="10" cx="50%" cy="50%"></circle>

            <text
              id="iris_anomaly"
              className="iris_anomaly"
              transform="rotate(180 30,8)"
            >
              ,
            </text>
            <use
              href="#iris_anomaly"
              transform="rotate(120 50,50)"
              fill="black"
            ></use>
            <use
              href="#iris_anomaly"
              transform="rotate(240 50,50)"
              fill="black"
            ></use>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
