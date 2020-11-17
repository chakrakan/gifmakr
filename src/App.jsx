import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true});

function App() {
  const [ready, setReady] = useState(false);
  const [gif, setGif] = useState();
  const [video, setVideo] = useState();
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }
  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'input.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'output.gif');
    const data = ffmpeg.FS('readFile', 'output.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif'}))
    setGif(url);
  }

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <div className="App">
      { video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <h3>Output</h3>
      <button onClick={convertToGif}>Convert</button>
      {gif && <img src={gif} width="250" />}
    </div>
  ) : <p>Loading...</p>;
}

export default App;
