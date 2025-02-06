/**
 * Importing React and the slider CSS.
 */
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/slider.css";

/**
 * Props for the Slider component.
 */
interface SliderProps {
  direction: "left" | "right";
}

/**
 * Slider component that displays a left or right arrow to navigate between Naruto Character.
 * Uses the URL parameter to determine the current Naruto Character ID.
 */
const Slider: React.FC<SliderProps> = ({ direction }) => {
  const { narutoId } = useParams<{ narutoId: string }>();
  const [newId, setNewId] = React.useState(narutoId);

  useEffect(() => {
    if (direction === "left") {
      setNewId(`${parseInt(narutoId || "0") - 1}`);
    } else {
      setNewId(`${parseInt(narutoId || "0") + 1}`);
    }
  }, [narutoId]);

  return (
    <div
      style={{ cursor: "pointer" }}
      id="slider"
      className={`slider-${direction}`}
    >
      <Link
        to={`/${newId}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {direction === "left" ? (
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 123.959 123.959"
            xmlSpace="preserve"
          >
            <g>
              <path
                d="M85.742,1.779l-56,56c-2.3,2.3-2.3,6.1,0,8.401l56,56c3.801,3.8,10.2,1.1,10.2-4.2v-112
             C95.942,0.679,89.543-2.021,85.742,1.779z"
                fill="currentColor"
              />
            </g>
          </svg>
        ) : (
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 123.959 123.959"
            xmlSpace="preserve"
          >
            <g transform="scale(-1, 1) translate(-123.959, 0)">
              <path
                d="M85.742,1.779l-56,56c-2.3,2.3-2.3,6.1,0,8.401l56,56c3.801,3.8,10.2,1.1,10.2-4.2v-112
        C95.942,0.679,89.543-2.021,85.742,1.779z"
                fill="currentColor"
              />
            </g>
          </svg>
        )}
      </Link>
    </div>
  );
};

export default Slider;
