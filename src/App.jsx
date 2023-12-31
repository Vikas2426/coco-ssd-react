import { useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import drawBox from "./utilities/drawBox";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [timer, setTimer] = useState(null);
  const start = async () => {
    const net = await cocossd.load();

    const timer = setInterval(() => {
      detect(net);
    }, 15);
    setTimer(timer);
  };

  const stop = () => {
    clearInterval(timer);
    setTimer(null);
  };

  const detect = async (net) => {
    if (webcamRef?.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const { videoWidth, videoHeight } = webcamRef.current.video;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      webcamRef.current.width = videoWidth;
      webcamRef.current.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);

      const ctx = canvasRef.current.getContext("2d");
      drawBox(obj, ctx);
      console.log("drawRect is running");
    }
  };

  return (
    <>
      <header className="brand">
        <img
          src="https://p1.hiclipart.com/preview/100/501/80/cowboy-hat-cartoon-comics-spy-vs-spy-sunglasses-eyewear-clothing-costume-hat-png-clipart.jpg"
          width={70}
          height={70}
        />
        <h2>Eye Spy</h2>
      </header>
      <main>
        <Webcam
          ref={webcamRef}
          muted={true}
          className="detectionContainer webcam"
        />

        <canvas ref={canvasRef} className="detectionContainer canvas" />
      </main>
      <button
        className="button-primary"
        onClick={() => {
          timer ? stop() : start();
        }}
      >
        {timer ? "Stop" : "Start"}
      </button>
    </>
  );
}

export default App;
