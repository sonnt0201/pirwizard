import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Box, Slider, Typography, Input } from "@mui/material";

interface VideoPlayerProps {
  onVideoUpload?: (fileName: string) => void; // Callback for video file upload
  onPlaybackTimeUpdate?: (currentTime: number) => void; // Callback for playback time updates
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  onVideoUpload,
  onPlaybackTimeUpdate,
}) => {
  const [videoFile, setVideoFile] = useState<string | null>(null); // Video file URL
  const [fileName, setFileName] = useState<string | null>(null); // File name
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // Playback speed, starts at normal
  const playerRef = useRef<ReactPlayer>(null); // Ref to ReactPlayer

  /**
   * Handle file input change event.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoFile(fileUrl);

      const filename = file.name.split('.')[0]; // remove the .extension (.webm, .mp4)

      setFileName(filename);
      onVideoUpload?.(filename);
    }
  };

  /**
   * Notify the parent component of the current playback time.
   */
  const handleProgress = (state: { playedSeconds: number }) => {
    const currentTimeMillis = Math.floor(state.playedSeconds * 1000);
    onPlaybackTimeUpdate?.(currentTimeMillis);
  };

  /**
   * Update the playback speed from the slider.
   */
  const handleSpeedChange = (event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setPlaybackSpeed(value);
    }
  };

  return (
    <Box textAlign="center"  >
      {/* File Upload Input */}
    

      {/* Video Player */}
      {videoFile ? (
        <Box maxWidth="600px" margin="auto">
          <ReactPlayer
            ref={playerRef}
            url={videoFile}
            controls
            width="100%"
            height="100%"
            playbackRate={playbackSpeed} // Apply the playback speed
            onProgress={handleProgress}
            autoPlay
          />
        </Box>
      ) : (
        <Typography variant="body2">No video uploaded. Please select a video file to play.</Typography>
      )}

      {/* Playback Speed Controller */}
      {videoFile && (
        <Box marginTop="10px">
          <Typography variant="body2" gutterBottom>
            Playback Speed: {playbackSpeed.toFixed(2)}x
          </Typography>
          <Slider
            value={playbackSpeed}
            onChange={handleSpeedChange}
            min={0.05} // Slowest speed
            max={1} // Normal speed
            step={0.01}
            marks={[
              { value: 0.05, label: "0.05x" },
              { value: 0.5, label: "0.5x" },
              { value: 1, label: "1x" },
            ]}
            aria-labelledby="playback-speed-slider"
          />
        </Box>
      )}

<Input
        type="file"
        inputProps={{ accept: "video/*" }}
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />

      {/* Notify Uploaded File Name */}
      {fileName && <Typography variant="body1">Uploaded Video: {fileName}</Typography>}
    </Box>
  );
};

export default VideoPlayer;
