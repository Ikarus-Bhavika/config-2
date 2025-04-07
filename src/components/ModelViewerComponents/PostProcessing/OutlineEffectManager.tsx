import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import useDataStore from "../../../store/store";

export function OutlineEffectManager() {
  const composerRef = useRef<EffectComposer>(null);
  const outlinePassRef = useRef<OutlinePass>(null);
  const { scene, gl, camera, size } = useThree();
  const store = useDataStore();
  useEffect(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const outlinePass = new OutlinePass(new THREE.Vector2(size.width, size.height), scene, camera);
    // outlinePass.edgeStrength = 6;
    // outlinePass.edgeGlow = 2;
    // outlinePass.edgeThickness = 1.0;
    // outlinePass.pulsePeriod = 100;
    // outlinePass.visibleEdgeColor.set('#FFAA00');
    // outlinePass.hiddenEdgeColor.set('#000000');

    outlinePass.edgeStrength = 2.74725;
    outlinePass.edgeGlow = 1.0;
    outlinePass.edgeThickness = 1;
    outlinePass.pulsePeriod = 2.5;
    outlinePass.visibleEdgeColor.set('#FFAA00');
    outlinePass.hiddenEdgeColor.set('#000000');

    composer.addPass(renderPass);
    composer.addPass(outlinePass);

    composerRef.current = composer;
    outlinePassRef.current = outlinePass;

    const handleResize = () => {
      composer.setSize(size.width, size.height);
    };

    handleResize();

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera, size]);

  useFrame(() => {
    const composer = composerRef.current;
    const outlinePass = outlinePassRef.current;
    if (!composer || !outlinePass) return;

    outlinePass.selectedObjects = store.outLineObjects;
    composer.render();
  }, 1); 

  return null;
}