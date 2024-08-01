"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";

interface PanoramaViewerProps {
  imageUrl: string;
  className?: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  imageUrl,
  className,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Resize renderer to fit parent
    const resizeRendererToDisplaySize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const aspect = width / height;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
    };

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Geometry for the panorama sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Load texture and create material
    const texture = new THREE.TextureLoader().load(imageUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Create mesh and add it to the scene
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Set initial camera position
    camera.position.set(0, 0, 0.1);

    // Initialize OrbitControls with touch support
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    // Create controller sphere
    const controllerGeometry = new THREE.SphereGeometry(5, 32, 32);
    const controllerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const controllerSphere = new THREE.Mesh(
      controllerGeometry,
      controllerMaterial
    );
    scene.add(controllerSphere);

    // Initialize DragControls
    const dragControls = new DragControls(
      [controllerSphere],
      camera,
      renderer.domElement
    );
    dragControls.addEventListener("dragstart", (event) => {
      controls.enabled = false;
    });
    dragControls.addEventListener("dragend", (event) => {
      controls.enabled = true;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      resizeRendererToDisplaySize();
      renderer.render(scene, camera);
    };

    // Handle window resize
    window.addEventListener("resize", resizeRendererToDisplaySize);

    // Start animation
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", resizeRendererToDisplaySize);
      controls.dispose();
      dragControls.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl]);

  return <div ref={mountRef} className={`w-full h-full ${className || ""}`} />;
};

export default PanoramaViewer;
