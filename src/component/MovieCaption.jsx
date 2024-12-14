import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';

function MovieCaption() {
  const [videoUrl, setVideoUrl] = useState('');
  const [captions, setCaptions] = useState([]);
  const [captionText, setCaptionText] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  const isYouTube = (url) => {
    const ytRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return ytRegex.test(url);
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const addCaption = () => {
    if (!captionText || !startTime || !endTime) {
      alert('Please fill in all caption fields.');
      return;
    }

    const startSeconds = convertTimeToSeconds(startTime);
    const endSeconds = convertTimeToSeconds(endTime);

    if (startSeconds >= endSeconds) {
      alert('Start time must be less than end time');
      return;
    }

    setCaptions([...captions, { text: captionText, start: startSeconds, end: endSeconds }]);
    setCaptionText('');
    setStartTime('');
    setEndTime('');
  };

  const convertTimeToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleYouTubeReady = (event) => {
    const player = event.target;
    player.playVideo();
  };

  const handleYouTubeStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const interval = setInterval(() => {
        setCurrentTime(event.target.getCurrentTime());
      }, 1000);

      if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
        clearInterval(interval);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const activeCaption = captions.find(
    (caption) => currentTime >= caption.start && currentTime <= caption.end
  );

  const videoId = isYouTube(videoUrl) ? extractYouTubeId(videoUrl) : null;

  return (
    <>
      <div className=' md:flex max-md:space-y-1    md:p-4 p-2 rounded bg-blue-200/50     *:rounded gap-2 *:w-full *:bg-white  ' >

        <div className="app-container p-2 border-gray-500 hover:shadow-xl  border">
          <h1 className="text-center md:text-2xl sm:text-xl text-[13px] md:font-bold font-semibold  mb-4">Simple Web App to Add Captions to a video</h1>

          {/* Video URL Input */}
          <div className="input-section">
            <label className="block mb-2">Enter Video URL:</label>
            <input
              type="text"
              className="w-full border p-2 mb-4 outline-blue-400"
              placeholder="Enter YouTube or video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* Caption Input */}
          <div className="caption-section mb-4">
            <label className="block mb-2">Caption Text:</label>
            <textarea
              className="w-full border p-2 mb-2 outline-blue-400"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Enter caption text"
            />
            <label className="block mb-2">Start Time (HH:MM:SS):</label>
            <input
              type="text"
              className="w-full border p-2 mb-2 outline-blue-400"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="00:00:00"
            />
            <label className="block mb-2">End Time (HH:MM:SS):</label>
            <input
              type="text"
              className="w-full border p-2 mb-4 outline-blue-400"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="00:00:00"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addCaption}>
              Add Caption
            </button>
          </div>


        </div>

          {/* Video Section */}
        <div className='border border-gray-500 relative max-md:h-80 '>

          <div className="video-section overflow-hidden h-full *:h-full relative">
            {videoId ? (
              <YouTube
                videoId={videoId}
                onReady={handleYouTubeReady}
                onStateChange={handleYouTubeStateChange}
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                  },
                }}
                
              />
            ) : (
              videoUrl && (
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full"
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )
            )}
          </div>

          {/* Display Active Caption */}
          {activeCaption && (
            <div className="captions absolute bottom-20  left-0 w-full text-center bg-black bg-opacity-50 text-white py-2">
              {activeCaption.text}
            </div>
          )}
     
         
        </div>
      </div>

    </>

  );
}

export default MovieCaption;
