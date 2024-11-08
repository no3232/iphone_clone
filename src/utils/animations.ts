"use client";

import gsap from "gsap/all";

import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export const animateWithGSAP = (target, animationProps, scrollProps) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      // markers: true,
      ...scrollProps,
    },
  });
};

export const animateWithGSAPTimeline = (
  timeline,
  rotationRef,
  rotationState,
  firstTarget,
  secondTarget,
  animationProps
) => {
  timeline.to(rotationRef.current, {
    y: rotationState,
    duration: 2,
    ease: "power2.inOut",
  });
  timeline.to(firstTarget, { ...animationProps, ease: "power2.inOut" }, "<");
  timeline.to(secondTarget, { ...animationProps, ease: "power2.inOut" }, "<");
};
