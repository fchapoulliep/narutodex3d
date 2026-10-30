// NarutoLayout.tsx
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import { useParams } from "react-router-dom";
import NarutoCharacter from "./NarutoCharacter";
import narutoList from "../data/narutocharacters.json";

// Read from the data rather than hardcoded, so the right arrow stays correct when characters are added.
const lastId = String(Math.max(...narutoList.map((c) => c.id)));

/**
 * `NarutoLayout` is a React functional component that renders the layout for displaying a Naruto Character.
 * It uses the `useParams` hook to extract the `narutoId` from the URL parameters.
 *
 * The component includes:
 * - A `NavBar` component at the top.
 * - A `Slider` component with direction "left" if the character exists and the `narutoId` is not "1".
 * - A `NarutoCharacter` component that displays the Character based on the `narutoId` or a default ID if `narutoId` is not available.
 * - A `Slider` component with direction "right" if the character exists and is not the last one.
 *
 * @returns {JSX.Element} The rendered layout for the Naruto Character page.
 */
const NarutoLayout: React.FC = () => {
  const { narutoId } = useParams<{ narutoId: string }>();
  const character = narutoList.find((c) => c.id === Number(narutoId));

  // The tab title follows in-app navigation; the built page of each character already has it.
  useEffect(() => {
    document.title = character ? `${character.name} | NarutoDex 3D` : "NarutoDex 3D";
  }, [character]);

  // No arrows on an unknown id: they would lead to other unknown ids.
  return (
    <>
      <NavBar />
      {character && narutoId !== "1" && <Slider direction="left" />}
      <NarutoCharacter narutoId={narutoId || "defaultId"} />
      {character && narutoId !== lastId && <Slider direction="right" />}
    </>
  );
};

export default NarutoLayout;
