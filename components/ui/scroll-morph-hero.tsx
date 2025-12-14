"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    onClick: () => void;
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({
    src,
    index,
    target,
    onClick,
}: FlipCardProps) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="cursor-pointer group"
            onClick={onClick}
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`drone-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 flex flex-col items-center justify-center p-4 border border-gray-700"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

// Media items: thumbnails from Unsplash, videos from local
const MEDIA_ITEMS = [
    // Bodas
    { thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80", video: "/videos/boda1.mp4", category: "Bodas" },
    { thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&q=80", video: "/videos/boda2.mp4", category: "Bodas" },
    { thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&q=80", video: "/videos/boda3.mp4", category: "Bodas" },
    { thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&q=80", video: "/videos/boda4.mp4", category: "Bodas" },
    { thumbnail: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300&q=80", video: "/videos/boda5.mp4", category: "Bodas" },

    // Agricultura
    { thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80", video: "/videos/agricultura1.mp4", category: "Agricultura" },
    { thumbnail: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&q=80", video: "/videos/agricultura2.mp4", category: "Agricultura" },
    { thumbnail: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&q=80", video: "/videos/agricultura3.mp4", category: "Agricultura" },
    { thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80", video: "/videos/agricultura4.mp4", category: "Agricultura" },
    { thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&q=80", video: "/videos/agricultura5.mp4", category: "Agricultura" },

    // Deporte
    { thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80", video: "/videos/deporte1.mp4", category: "Deporte" },
    { thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80", video: "/videos/deporte2.mp4", category: "Deporte" },
    { thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&q=80", video: "/videos/deporte3.mp4", category: "Deporte" },
    { thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&q=80", video: "/videos/deporte4.mp4", category: "Deporte" },
    { thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&q=80", video: "/videos/deporte5.mp4", category: "Deporte" },

    // Otros (Paisajes, Ciudad, Naturaleza)
    { thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80", video: "/videos/otro1.mp4", category: "Otros" },
    { thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&q=80", video: "/videos/otro2.mp4", category: "Otros" },
    { thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&q=80", video: "/videos/otro3.mp4", category: "Otros" },
    { thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80", video: "/videos/otro4.mp4", category: "Otros" },
    { thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80", video: "/videos/otro5.mp4", category: "Otros" },
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const previousVolumeRef = useRef<number>(0.3);

    // Background music
    useEffect(() => {
        audioRef.current = new Audio('/audio/background.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // 30% volume

        // Play on user interaction
        const playAudio = async () => {
            try {
                await audioRef.current?.play();
            } catch (error) {
                // Audio blocked, will play on first interaction
            }
        };

        // Try autoplay first
        playAudio();

        // Fallback: Play on any user interaction
        const handleInteraction = () => {
            if (audioRef.current?.paused) {
                playAudio();
            }
        };

        // Listen for various interaction events
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('keydown', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
        document.addEventListener('scroll', handleInteraction, { once: true });

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('scroll', handleInteraction);
        };
    }, []);

    // Toggle audio mute
    const toggleAudioMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Auto-mute background audio when video opens, restore when video closes
    useEffect(() => {
        if (audioRef.current) {
            if (selectedImage !== null) {
                // Video is open - mute background audio
                previousVolumeRef.current = audioRef.current.volume;
                audioRef.current.volume = 0;
            } else {
                // Video is closed - restore background audio
                audioRef.current.volume = previousVolumeRef.current;
            }
        }
    }, [selectedImage]);

    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 100, damping: 30, mass: 0.5 });

    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 100, damping: 30, mass: 0.5 });

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30, mass: 0.5 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const scatterPositions = useMemo(() => {
        return MEDIA_ITEMS.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-white overflow-hidden">
            {/* Logo - Top Left Corner */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
                {/* Circular radar icon */}
                <div className="relative w-16 h-16">
                    {/* Outer glow circles */}
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-10"></div>
                    <div className="absolute inset-2 rounded-full bg-red-500 opacity-20"></div>
                    {/* Main red circle */}
                    <div className="absolute inset-4 rounded-full bg-red-600"></div>
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900"></div>
                    {/* Arrow pointing to top-right */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                        <line
                            x1="32"
                            y1="32"
                            x2="50"
                            y2="14"
                            stroke="#1F2937"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        {/* Arrowhead */}
                        <path
                            d="M 50 14 L 45 16 M 50 14 L 48 19"
                            stroke="#1F2937"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                </div>
                {/* Company name */}
                <div className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                    OTRO ANGULO
                </div>
            </div>

            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text */}
                <div className={`absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 transition-opacity duration-500 ${selectedImage !== null ? 'opacity-0' : 'opacity-100'}`}>
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.6 - morphValue * 1.2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="text-xs md:text-sm font-light tracking-[0.3em] text-gray-600 mb-4"
                    >
                        Cinematografía Aérea
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 mb-6"
                        style={{
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            letterSpacing: '0.15em'
                        }}
                    >
                        NEW PERSPECTIVE
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-[10px] md:text-xs font-medium tracking-[0.25em] text-gray-500"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                </div>


                {/* Arc Active Content */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <p className="text-xs md:text-sm font-light tracking-[0.3em] text-gray-600 mb-4">
                        Cinematografía Aérea
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 mb-6"
                        style={{
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            letterSpacing: '0.15em'
                        }}
                    >
                        NEW PERSPECTIVE
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 max-w-2xl leading-relaxed font-light">
                        Eleva tu narrativa con impresionantes videos en 4K capturados con drones.<br className="hidden md:block" />
                        Nos especializamos en capturar los momentos que importan desde ángulos que nunca imaginaste.
                    </p>
                </motion.div>

                {/* Main Container */}
                <motion.div
                    className="relative flex items-center justify-center w-full h-full"
                    animate={{
                        x: selectedImage !== null ? -containerSize.width * 0.25 : 0,
                        scale: selectedImage !== null ? 0.5 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 25,
                    }}
                >
                    {MEDIA_ITEMS.slice(0, TOTAL_IMAGES).map((item, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            const circleRadius = Math.min(minDimension * 0.35, 350);
                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                            const maxRotation = spreadAngle * 0.8;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8,
                            };

                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={item.thumbnail}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                                onClick={() => setSelectedImage(i)}
                            />
                        );
                    })}
                </motion.div>

                {/* Video Player - Right Side */}
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 25,
                        }}
                        className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center p-8 bg-transparent"
                    >
                        <div className="relative w-full h-full max-w-4xl max-h-[85vh]">
                            {/* Video Player */}
                            <video
                                key={selectedImage}
                                className="w-full h-full object-cover rounded-2xl shadow-2xl bg-transparent"
                                controls
                                autoPlay
                                loop
                                style={{
                                    maskImage: 'radial-gradient(ellipse at center, black 75%, transparent 98%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 75%, transparent 98%)',
                                }}
                            >
                                <source src={MEDIA_ITEMS[selectedImage].video} type="video/mp4" />
                                Tu navegador no soporta la reproducción de video.
                            </video>

                            {/* Close button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-6 py-3 rounded-full text-sm backdrop-blur-sm transition-all duration-200 font-medium shadow-lg hover:scale-105"
                            >
                                ✕ Cerrar
                            </button>

                            {/* Category label */}
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-xs backdrop-blur-sm">
                                {MEDIA_ITEMS[selectedImage].category}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Audio Mute Button - Bottom Left Corner */}
                <button
                    onClick={toggleAudioMute}
                    className="fixed bottom-6 left-6 z-50 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110"
                    aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
                >
                    {isMuted ? (
                        // Muted icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        // Unmuted icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
