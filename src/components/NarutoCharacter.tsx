/**
 * Importing React, the Loader component, the NarutoType component, and the Link component.
 */
import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import narutoList from "../data/narutocharacters.json";
import Loader from "./Loader";
import * as THREE from "three";
import "../css/narutocharacter.css";
import NarutoType from "./NarutoType";
import { Link } from "react-router-dom";

/**
 * Interface for the NarutoProps type, which includes the Character ID.
 */
interface NarutoProps {
  narutoId: string;
}

/**
 * Interface for the NarutoModelProps type, which includes the model path and Character ID.
 */
interface NarutoModelProps {
  modelPath: string;
  /** Called once the model is drawn and its framing has settled. */
  onReady: () => void;
}

/**
 * Component that renders a 3D model of a Naruto Character using the provided model path and Character ID.
 * It handles loading the model, playing idle animations, and adjusting the model's scale and materials.
 *
 * @component
 * @param {NarutoModelProps} props - The properties for the NarutoModel component.
 * @param {string} props.modelPath - The path to the 3D model file.
 * @returns {JSX.Element} The rendered 3D model of the Naruto Character.
 */
const NarutoModel: React.FC<NarutoModelProps> = ({ modelPath, onReady }) => {
  const { scene, animations } = useGLTF(modelPath);
  const mixer = new THREE.AnimationMixer(scene);
  const frames = useRef(0);

  useEffect(() => {
    if (animations.length > 0) {
      const idleAnimation = animations.find(
        (clip) =>
          clip.name.toLowerCase().includes("idle") ||
          clip.name.toLowerCase().includes("wait") ||
          clip.name === "0"
      );
      const action = mixer.clipAction(idleAnimation || animations[0]);
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);

  useFrame((_, delta) => {
    mixer.update(delta);
    // A few frames let the framing settle (centering, scale, camera fit): only
    // then is the model shown, so that it never jumps or glides into place.
    frames.current += 1;
    if (frames.current === 5) {
      onReady();
    }
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);

      const delta = Math.min(1.0 / size.x, 1.0 / size.y, 1.0 / size.z);
      scene.scale.set(delta, delta, delta);
      scene.rotation.y = -0.5;
    }
  }, [scene]);

  return <primitive object={scene} scale={0.25} position={[0, -2, 0.5]} />;
};

/**
 * Models drawn during this visit. drei keeps them in memory, so they come back
 * at once and need no loader.
 */
const seenModels = new Set<string>();

/** How long the loader stays at least, for a model not seen yet. */
const LOADER_MIN_MS = 1000;

/**
 *  Component that renders a Naruto Character page with a 3D model, description, and type information.
 * @param narutoId The ID of the Character to display.
 * @returns The Naruto Character page with the 3D model, description, and type information.
 */
const NarutoCharacter: React.FC<NarutoProps> = ({ narutoId }) => {
  const narutocharacter = narutoList.find((p) => p.id === parseInt(narutoId));

  const narutocharacterName = narutocharacter ? narutocharacter.name : "";

  const modelPath = useMemo(
    () =>
      `${
        import.meta.env.BASE_URL
      }models/${narutocharacterName}/${narutocharacterName}.glb?v=${__BUILD_ID__}`,
    [narutocharacterName]
  );

  // The loader follows the model rather than a fixed delay. A model not seen
  // yet shows it at once and for at least LOADER_MIN_MS, so that a quick load
  // reads as a transition rather than a black flash; a model already seen
  // during the visit is still in memory and shows up without it.
  const [loaderPhase, setLoaderPhase] = React.useState<
    "visible" | "closing" | "hidden"
  >("visible");
  const [drawnPath, setDrawnPath] = React.useState<string | null>(null);
  const modelDrawn = drawnPath === modelPath;
  const loaderShownAt = useRef(performance.now());

  useLayoutEffect(() => {
    if (seenModels.has(modelPath)) {
      setLoaderPhase("hidden");
      return;
    }
    loaderShownAt.current = performance.now();
    setLoaderPhase("visible");
  }, [modelPath]);

  useEffect(() => {
    if (!modelDrawn) return;
    seenModels.add(modelPath);
    const elapsed = performance.now() - loaderShownAt.current;
    const timer = setTimeout(
      () => setLoaderPhase((phase) => (phase === "visible" ? "closing" : phase)),
      Math.max(0, LOADER_MIN_MS - elapsed),
    );
    return () => clearTimeout(timer);
  }, [modelDrawn, modelPath]);

  if (!narutocharacter) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        The Naruto Character does not exist
        <Link to="/">Go back to the NarutoDex</Link>
      </div>
    );
  }

  return (
    <div
      id="naruto-overlay"
      style={{
        backgroundImage: `url(${
          import.meta.env.BASE_URL
        }backgrounds/${narutocharacter.village
          .toLowerCase()
          .replace(/ /g, "-")}.png)`,
        backgroundPosition: "bottom",
        backgroundSize: "cover",
      }}
    >
      {loaderPhase !== "hidden" && (
        <Loader
          closing={loaderPhase === "closing"}
          onClosed={() => setLoaderPhase("hidden")}
        />
      )}
      <div className="naruto-description">
        <h2>{narutocharacter.name}</h2>
        <p>{narutocharacter.description}</p>
      </div>
      <div className="naruto-types">
        {narutocharacter.clan.map((clanItem) => (
          <NarutoType key={clanItem} type={clanItem} />
        ))}
      </div>

      <Canvas style={{
          background: "transparent",
          // Hidden until the model is in place, then faded in
          opacity: modelDrawn ? 1 : 0,
          transition: "opacity 150ms",
        }} shadows key={modelPath}>
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
        <OrbitControls
          enableDamping
          dampingFactor={0.25}
          minDistance={2}
          maxDistance={6}
        />
        {/* A model still loading suspends the scene only: without this boundary,
            the page itself would wait, and the previous page would stay on screen */}
        <Suspense fallback={null}>
          <NarutoModel
            modelPath={modelPath}
            onReady={() => setDrawnPath(modelPath)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default NarutoCharacter;
