"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { SyntheticEvent, useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "@/constants";
import { pauseImg, playImg, replayImg } from "@/utils";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  // 비디오 요소를 참조하는 배열
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  // 인디케이터 요소를 참조하는 배열
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  // 진행 상태를 나타내는 요소를 참조하는 배열
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  // 비디오 상태와 인덱스, 재생 상태, 마지막 비디오 상태 등 상태를 관리
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  // 비디오 로드 상태를 관리하는 상태
  const [loadedData, setLoadedData] = useState<
    SyntheticEvent<HTMLVideoElement, Event>[]
  >([]);

  // 비디오 상태를 추출
  // 좀 더 간단하게 조회하기 위해 구조분해 할당
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  // GSAP 애니메이션 적용
  useGSAP(() => {
    // 슬라이더가 비디오 인덱스만큼 이동
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    // 비디오 애니메이션 적용
    //스크롤 트리거를 통해 스크롤이 시작되면 비디오가 재생
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      // 스크롤 트리거가 완료되면(스크롤이 끝나면) 비디오 재생 시작?
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current;

    if (span[videoId]) {
      // 트윈을 객체로 만들어서 애니메이션 적용
      const anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // 현재 애니메이션의 진행도를 불러옴
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // 프로그래스 바의 넓이를 설정
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                  ? "10vw" // tablet
                  : "4vw", // laptop
            });

            // 백그라운드 컬러를 진행도에 맞춰서 설정
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // 비디오가 끝나면, 진행 바를 인디케이터로 교체하고 배경 색상을 변경
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // 진행바를 업데이트
      // 근데 이거 순수함수로 교체할 수 있지 않을까?
      const animUpdate = () => {
        if (videoRef.current[videoId]) {
          anim.progress(
            videoRef.current[videoId].currentTime /
              hightlightsSlides[videoId].videoDuration
          );
        }
      };

      if (isPlaying) {
        /**
         * 틱을 추가하여 진행바를 업데이트
         * 티커는 매 프레임마다 실행되는 함수
         * requestAnimationFrame을 사용하여 프레임마다 실행
         * 따라서 현재는 비디오의 진행도를 계산해서 진행바를 업데이트
         * ref를 통해서 해당 인덱스의 비디오에 접근하여 진행도를 계산
         */
        gsap.ticker.add(animUpdate);
      } else {
        // 비디오가 일시정지되면(진행바가 멈추면) 틱을 제거
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  useEffect(() => {
    if (videoRef.current[videoId]) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        if (startPlay) {
          videoRef.current[videoId].play();
        }
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // 비디오 아이디는 현재 재생 중인 비디오 인덱스를 나타냄
  const handleProcess = (type: string, i: number) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (
    i: number,
    e: SyntheticEvent<HTMLVideoElement, Event>
  ) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => {
                    if (el) {
                      videoRef.current[i] = el;
                    }
                  }}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last", 0)
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  // 비디오 로드 상태를 관리하는 함수
                  // 이 함수를 통해서 비디오가 로드 되면 로드된 비디오의 상태를 업데이트
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => {
                if (el) {
                  videoDivRef.current[i] = el;
                }
              }}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  if (el) {
                    videoSpanRef.current[i] = el;
                  }
                }}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset", videoId)
                : !isPlaying
                ? () => handleProcess("play", videoId)
                : () => handleProcess("pause", videoId)
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
