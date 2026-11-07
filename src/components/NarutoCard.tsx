/**
 * Importing react and the Tilt component. As long as the css
 */
import React, { useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import "../css/narutocard.css";

import { Link } from "react-router-dom";
import NarutoType from "./NarutoType";

/**
 * Props for the NarutoCard component.
 *
 * @interface NarutoCardProps
 * @property {number} id - The unique identifier for the Naruto Character.
 * @property {string} name - The name of the Naruto Character.
 * @property {string} clan - The clan of the Naruto Character.
 * @property {string} village - The village of the Naruto Character.
 */
interface NarutoCardProps {
  id: number;
  name: string;
  clan: string[];
  village: string;
}

/**
 * The tilt library sizes its glare once, when the pointer enters the card.
 * The active card keeps growing after that (a 0.3 s height transition), so a
 * pointer arriving during the growth got a glare sized on the smaller card,
 * which left the corners bare until it came back. The card is measured again
 * whenever its layout size changes. setSize is internal to the library (not in
 * its types): it is called only if present.
 */
function useGlareFollowsSize() {
  const ref = useRef<Tilt>(null);
  useEffect(() => {
    const tilt = ref.current as unknown as {
      setSize?: () => void;
      wrapperEl?: { node: HTMLElement | null };
    } | null;
    const node = tilt?.wrapperEl?.node;
    if (!tilt || !node || typeof tilt.setSize !== "function" || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(() => tilt.setSize?.());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * NarutoCard component that displays a Naruto Character card with its name, ID, types, and image.
 */
const NarutoCard: React.FC<NarutoCardProps> = (narutocharacter) => {
  const glareRef = useGlareFollowsSize();
  return (
    <Tilt
      ref={glareRef}
      className={`background-stripes naruto-cards ${narutocharacter.village.toLowerCase()}`}
      glareEnable
      glareMaxOpacity={0.3}
      glareColor="white"
      glarePosition="all"
      glareBorderRadius="20px"
      scale={1.1}
    >
      <div className="inner-element">
        <Link to={`/${narutocharacter.id}`}>
          <div className="naruto-types">
            {narutocharacter.clan.map((clanItem) => (
              <NarutoType key={clanItem} type={clanItem} />
            ))}
          </div>
          <p>{narutocharacter.name}</p>
          <img
            className="naruto-character-image"
            src={`${import.meta.env.BASE_URL}/sprites/${
              narutocharacter.name
            }.png`}
            alt={narutocharacter.name}
          />
        </Link>
      </div>
    </Tilt>
  );
};

export default NarutoCard;
