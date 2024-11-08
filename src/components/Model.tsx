"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ModelView from "./ModelView";
import { useEffect, useRef, useState } from "react";
import { yellowImg } from "@/utils";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from "@/constants";
import { animateWithGSAPTimeline } from "@/utils/animations";

const Model = () => {
  const [size, setSize] = useState("small");
  const [model, setModel] = useState({
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#FFE7B9", "#6F6C64"],
    img: yellowImg,
  });

  // 컨테이너 ref 이벤트 소스에 할당해주기 위해서 설정
  const containerRef = useRef(null);
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

  // ref가 설정되면 eventSource 업데이트
  useEffect(() => {
    if (containerRef.current) {
      setEventSource(containerRef.current);
    }
  }, []);

  // 카메라 컨트롤을 생성하기
  const cameraControlSmall = useRef(null);
  const cameraControlLarge = useRef(null);

  // 모델 그룹 생성
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  // 로테이션 3D 모델이 얼마나 회전하는지를 알려주는 값
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  const tl = gsap.timeline();

  useEffect(() => {
    if (size === "large") {
      animateWithGSAPTimeline(tl, small, smallRotation, "#view1", "#view2", {
        transform: "translateX(-100%)",
        duration: 2,
      });
    }

    if (size === "small") {
      animateWithGSAPTimeline(tl, large, largeRotation, "#view2", "#view1", {
        transform: "translateX(0%)",
        duration: 2,
      });
    }
  }, [size]);

  useGSAP(() => {
    gsap.to("#heading", { y: 0, opacity: 1 });
  });

  return (
    <div className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>
        <div className="flex flex-col items-center mt-5">
          <div
            className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative"
            ref={containerRef}
            id="root"
          >
            <ModelView
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />
            <ModelView
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />
            <Canvas
              className="w-full h-full"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                overflow: "hidden",
              }}
              eventSource={eventSource as HTMLElement}
            >
              <View.Port />
            </Canvas>
          </div>
          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>
            <div className="flex-center">
              <ul className="color-container">
                {models.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className="w-6 h-6 rounded-full mx-2 cursor-pointer"
                      style={{ backgroundColor: item.color[0] }}
                      onClick={() => {
                        setModel(item);
                      }}
                    />
                  );
                })}
              </ul>
              <button className="size-btn-container">
                {sizes.map(({ label, value }) => {
                  return (
                    <span
                      key={label}
                      className="size-btn"
                      style={{
                        backgroundColor:
                          size === value ? "white" : "transparent",
                        color: size === value ? "#000" : "#fff",
                      }}
                      onClick={() => {
                        setSize(value);
                      }}
                    >
                      {label}
                    </span>
                  );
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
