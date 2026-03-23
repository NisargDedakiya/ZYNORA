/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useCustomizerStore } from "@/lib/customizer-store";
import { useRef } from "react";

type MetalConfig = {
    color: string;
    metalness: number;
    roughness: number;
};

function getMetalConfig(metalType?: string): MetalConfig {
    switch (metalType) {
        case "Yellow Gold":
        case "18K Yellow Gold":
            return { color: "#D4AF37", metalness: 1, roughness: 0.15 };
        case "White Gold":
        case "18K White Gold":
            return { color: "#E5E4E2", metalness: 1, roughness: 0.1 };
        case "Rose Gold":
        case "18K Rose Gold":
            return { color: "#B76E79", metalness: 1, roughness: 0.15 };
        case "Platinum":
            return { color: "#DDE1E4", metalness: 1, roughness: 0.08 };
        default:
            return { color: "#E5E4E2", metalness: 1, roughness: 0.1 };
    }
}

// ---------------------------------------------------------------------------
// Auto-fit: scale + center an Object3D so its longest dimension == targetSize
// ---------------------------------------------------------------------------
function fitToScene(object: THREE.Object3D, targetSize = 2.5) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return;
    const scale = targetSize / maxDim;
    object.scale.setScalar(scale);
    // Re-center after scaling
    box.setFromObject(object);
    box.getCenter(center);
    object.position.sub(center);
}

function fitCameraToObject(
    camera: THREE.PerspectiveCamera,
    controls: any,
    object: THREE.Object3D
) {
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return false;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim <= 0) return false;

    const radius = maxDim * 0.5;
    const fitOffset = 1.35;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const distance = (radius / Math.tan(fov / 2)) * fitOffset;

    // Keep current view direction, but ensure it's valid.
    const currentTarget = controls?.target ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
    const direction = camera.position.clone().sub(currentTarget);
    if (direction.lengthSq() < 1e-6) {
        direction.set(1, 0.6, 1);
    }
    direction.normalize();

    const newPosition = center.clone().add(direction.multiplyScalar(distance));
    camera.position.copy(newPosition);
    camera.near = 0.01;
    camera.far = Math.max(1000, distance * 50);
    camera.updateProjectionMatrix();

    if (controls) {
        controls.target.copy(center);
        controls.minDistance = 0.1;
        controls.maxDistance = 100;
        controls.update();
    }

    return true;
}

function CameraAutoFit({
    targetRef,
    controlsRef,
    trigger,
}: {
    targetRef: React.RefObject<THREE.Group | null>;
    controlsRef: React.RefObject<any>;
    trigger: string;
}) {
    const { camera } = useThree();

    useEffect(() => {
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        let attempts = 0;
        let raf = 0;

        const runFit = () => {
            attempts += 1;
            const target = targetRef.current;
            const controls = controlsRef.current;

            if (!target) {
                if (attempts < 60) raf = requestAnimationFrame(runFit);
                return;
            }

            const fitted = fitCameraToObject(perspectiveCamera, controls, target);
            if (!fitted && attempts < 60) {
                raf = requestAnimationFrame(runFit);
            }
        };

        // Delay one frame so suspense children can mount meshes.
        raf = requestAnimationFrame(runFit);
        return () => cancelAnimationFrame(raf);
    }, [camera, controlsRef, targetRef, trigger]);

    return null;
}

function LoadingState() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="px-5 py-3 bg-white/95 text-[10px] uppercase tracking-[0.2em] font-bold text-[#111111] border border-gray-100 shadow-sm whitespace-nowrap">
                Loading {Math.round(progress)}%
            </div>
        </Html>
    );
}

function NoModelPlaceholder() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="20" stroke="rgba(47,143,131,0.5)" strokeWidth="3" fill="none" />
                    <circle cx="32" cy="32" r="12" stroke="rgba(47,143,131,0.25)" strokeWidth="2" fill="none" />
                </svg>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400/80 whitespace-nowrap">
                    Select a setting to preview
                </p>
            </div>
        </Html>
    );
}

function GLTFModel({ url, positionOffset = [0, 0, 0], isRing, metal }: { url: string; positionOffset?: [number, number, number]; isRing: boolean; metal: MetalConfig }) {
    const { scene } = useGLTF(url) as any;
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    // Auto-fit applied directly to clonedScene to avoid conflicting with the R3F position prop on the group
    useEffect(() => { fitToScene(clonedScene); }, [clonedScene]);

    useEffect(() => {
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: metal.color, metalness: metal.metalness, roughness: metal.roughness, envMapIntensity: 2.0,
            side: THREE.DoubleSide,
        });
        const diamondMaterial = new THREE.MeshPhysicalMaterial({
            color: "#ffffff", transmission: 1, thickness: 1.5, roughness: 0, metalness: 0, clearcoat: 1,
            clearcoatRoughness: 0, ior: 2.42, reflectivity: 1, envMapIntensity: 2.5,
            side: THREE.DoubleSide,
        } as any);
        clonedScene.traverse((child: any) => {
            if (!child.isMesh) return;
            if (child.geometry && !child.geometry.attributes?.normal) {
                child.geometry.computeVertexNormals();
            }
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = isRing ? ringMaterial : diamondMaterial;
        });
    }, [clonedScene, isRing, metal]);

    return (
        <group position={positionOffset}>
            <primitive object={clonedScene} />
        </group>
    );
}

function OBJModel({ url, positionOffset = [0, 0, 0], isRing, metal }: { url: string; positionOffset?: [number, number, number]; isRing: boolean; metal: MetalConfig }) {
    const rawScene = useLoader(OBJLoader, url);
    const clonedScene = useMemo(() => rawScene.clone(true), [rawScene]);

    // Auto-fit applied directly to clonedScene to avoid conflicting with the R3F position prop on the group
    useEffect(() => { fitToScene(clonedScene); }, [clonedScene]);

    useEffect(() => {
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: metal.color, metalness: metal.metalness, roughness: metal.roughness, envMapIntensity: 2.0,
            side: THREE.DoubleSide,
        });
        const diamondMaterial = new THREE.MeshPhysicalMaterial({
            color: "#ffffff", transmission: 1, thickness: 1.5, roughness: 0, metalness: 0, clearcoat: 1,
            clearcoatRoughness: 0, ior: 2.42, reflectivity: 1, envMapIntensity: 2.5,
            side: THREE.DoubleSide,
        } as any);
        clonedScene.traverse((child: any) => {
            if (!child.isMesh) return;
            if (child.geometry && !child.geometry.attributes?.normal) {
                child.geometry.computeVertexNormals();
            }
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = isRing ? ringMaterial : diamondMaterial;
        });
    }, [clonedScene, isRing, metal]);

    return (
        <group position={positionOffset}>
            <primitive object={clonedScene} />
        </group>
    );
}

function ModelNode({ url, positionOffset = [0, 0, 0], isRing, metal }: { url: string; positionOffset?: [number, number, number]; isRing: boolean; metal: MetalConfig }) {
    useEffect(() => {
        console.log("[RingViewer] Loading 3D model:", url);
    }, [url]);

    const isObj = url.toLowerCase().endsWith(".obj");
    if (isObj) {
        return <OBJModel url={url} positionOffset={positionOffset} isRing={isRing} metal={metal} />;
    }
    return <GLTFModel url={url} positionOffset={positionOffset} isRing={isRing} metal={metal} />;
}

function ModelFallback({ error }: { error?: unknown }) {
    useEffect(() => {
        if (error) console.error("[RingViewer] Model load error:", error);
    }, [error]);
    return (
        <Html center>
            <div className="px-5 py-3 bg-red-50 text-[10px] uppercase tracking-[0.2em] font-bold text-red-600 border border-red-200 shadow-sm whitespace-nowrap">
                Preview Unavailable
            </div>
        </Html>
    );
}

function RingAssembly({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
    const { config } = useCustomizerStore();
    const metal = useMemo(() => getMetalConfig(config.metalType), [config.metalType]);

    const ringModelUrl = config.setting?.modelUrl ?? "";
    const diamondModelUrl = config.diamond?.modelUrl ?? "";
    const noSelection = !ringModelUrl && !diamondModelUrl;

    return (
        <group ref={groupRef}>
            {noSelection && <NoModelPlaceholder />}

            {ringModelUrl ? (
                <ErrorBoundary
                    key={ringModelUrl}
                    fallbackRender={({ error }) => <ModelFallback error={error} />}
                    resetKeys={[ringModelUrl]}
                >
                    <Suspense fallback={<LoadingState />}>
                        <ModelNode key={ringModelUrl} url={ringModelUrl} isRing={true} metal={metal} />
                    </Suspense>
                </ErrorBoundary>
            ) : null}

            {diamondModelUrl ? (
                <ErrorBoundary
                    key={diamondModelUrl}
                    fallbackRender={({ error }) => <ModelFallback error={error} />}
                    resetKeys={[diamondModelUrl]}
                >
                    <Suspense fallback={<LoadingState />}>
                        <ModelNode key={diamondModelUrl} url={diamondModelUrl} isRing={false} metal={metal} positionOffset={[0, 0.15, 0]} />
                    </Suspense>
                </ErrorBoundary>
            ) : null}
        </group>
    );
}

export default function RingViewer() {
    const [hasWebGL, setHasWebGL] = useState(true);
    const { config } = useCustomizerStore();
    const assemblyRef = useRef<THREE.Group>(null);
    const controlsRef = useRef<any>(null);

    const fitTrigger = `${config.setting?.modelUrl ?? ""}|${config.diamond?.modelUrl ?? ""}|${config.metalType}`;

    useEffect(() => {
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl) setHasWebGL(false);
        } catch {
            setHasWebGL(false);
        }
    }, []);

    if (!hasWebGL) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-[#0B1715] text-emerald-400/60 p-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">WebGL not supported on this device.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[400px] bg-[#0B1715] relative">
            <Canvas
                shadows
                camera={{ position: [0, 1.5, 4], fov: 45, near: 0.01, far: 1000 }}
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
            >
                <color attach="background" args={["#0B1715"]} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
                <directionalLight position={[-5, 5, -5]} intensity={0.6} />
                <pointLight position={[0, 3, 3]} intensity={1.0} />
                <pointLight position={[0, -1, 2]} intensity={0.3} color="#b8e0ff" />

                {/* HDR environment for reflections */}
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                </Suspense>

                <RingAssembly groupRef={assemblyRef} />
                <CameraAutoFit targetRef={assemblyRef} controlsRef={controlsRef} trigger={fitTrigger} />

                <OrbitControls
                    ref={controlsRef}
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    enableDamping={true}
                    dampingFactor={0.08}
                    autoRotate={true}
                    autoRotateSpeed={0.8}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2 + 0.2}
                    minDistance={0.1}
                    maxDistance={100}
                />
            </Canvas>
        </div>
    );
}
