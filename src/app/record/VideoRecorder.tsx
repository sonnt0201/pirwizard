import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type RecordAction = "start" | "stop" | "cancel";

interface VideoRecorderProps {
    // The current recording action, which can be "start", "stop", or "cancel"
    recordAction: RecordAction | undefined;

    // Optional callback to notify the parent component of recording timestamps
    onRecordingTimestampUpdate?: (startTimestamp: number | null, currentTime: number | null) => void;

 
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
    recordAction,
    onRecordingTimestampUpdate,

  
}) => {
    // Ref to the Webcam component to access the video stream
    const webcamRef = useRef<Webcam>(null);

    // Ref to the MediaRecorder instance to control recording
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // State to store video data chunks during recording
    const [capturedChunks, setCapturedChunks] = useState<Blob[]>([]);

    // State to store the timestamp when recording starts
    const [startTimestamp, setStartTimestamp] = useState<number | null>(null);

    const endTimestamp = useRef<number>(0)


    // State to store the current recording time in milliseconds
    const [currentRecordingTime, setCurrentRecordingTime] = useState<number | null>(null);

    // Ref to the timer that updates the recording time
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Effect that triggers actions based on changes to the `recordAction` prop.
     * - "start": Starts recording.
     * - "stop": Stops recording and downloads the video.
     * - "cancel": Stops recording and discards the video buffer.
     */
    useEffect(() => {
        console.log({
            target: 'VideoRecorder',
            recordAction: recordAction,
        })

        if (recordAction === "start") {
            handleStartRecording();
        } else if (recordAction === "stop") {
            handleStopRecording(true); // Save video
        } else if (recordAction === "cancel") {
            handleStopRecording(false); // Discard video
        }
    }, [recordAction]);

    /**
     * Starts the recording process.
     */
    const handleStartRecording = () => {
        // Clear previous video data
        setCapturedChunks([]);

       

        endTimestamp.current = 0;

        // Reset the current recording time to 0
        setCurrentRecordingTime(0);

       

        // Get the video stream from the Webcam component
        const mediaStream = webcamRef.current?.video?.srcObject as MediaStream;

        // Initialize MediaRecorder with the video stream
        const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "video/webm" });

        // Save the MediaRecorder instance
        mediaRecorderRef.current = mediaRecorder;

        // Handle data available from the recorder
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            console.log("ondataavailable called, event size:", event.data.size);
            if (event.data.size > 0) {
                setCapturedChunks((prevChunks) => [...prevChunks, event.data]); // Store video chunks
            }
        };


         // Record the timestamp of when recording starts
         const timestamp = Date.now();
         setStartTimestamp(timestamp);
        // Start recording
        mediaRecorder.start();



        // Start updating the recording time every second
        recordingTimerRef.current = setInterval(() => {
            setCurrentRecordingTime((prev) => {
                const newTime = (prev || 0) + 1000; // Increment time by 1 second
                // onRecordingTimestampUpdate?.(startTimestamp, newTime); // Notify parent about current time
                return newTime;
            });
        }, 1000);

         // Notify the parent component about the start timestamp and reset current time
         onRecordingTimestampUpdate?.(timestamp, 0);

        console.log("Recording started at:", new Date(timestamp).toISOString());
    };

    /**
     * Stops the recording process.
     * @param save - Whether to save the recorded video (true) or discard it (false).
     */
    const handleStopRecording = (save: boolean) => {

        

        // Stop updating the recording time
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }







        if (save === true) {
            // Stop the MediaRecorder
            endTimestamp.current = Date.now()
            mediaRecorderRef.current?.stop();

        } else if (!save) {
            mediaRecorderRef.current?.pause();
            // Discard the recorded video chunks
            setCapturedChunks([]);
            console.log("Recording cancelled, buffer discarded.");
            setStartTimestamp(null);
            setCurrentRecordingTime(null);
        }

        // Reset the recording states

        // onRecordingTimestampUpdate?.(null, null); // Notify parent of reset timestamps



    };

    useEffect(() => {
        if (capturedChunks.length > 0) {

            downloadAvailableRecord();
        }
    }, [capturedChunks])


    // download avaiable chunks
    const downloadAvailableRecord = () => {
        // Capture the timestamp when recording ends
        
        console.log("Creating export video file ...")
        // Combine the video chunks into a single blob
        const blob = new Blob(capturedChunks, { type: "video/webm" });

        // Generate a downloadable URL for the blob
        const url = URL.createObjectURL(blob);

        // Use the start and end timestamps as the file name
        const fileName = `${startTimestamp}-${endTimestamp.current}.webm`;

        // Create a hidden anchor element to trigger the download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);

        console.log(`Video saved as ${fileName}`);


        // clear state
        setStartTimestamp(null);
        setCurrentRecordingTime(null);
    }

    // noti time to parent 
    useEffect(() => {
        onRecordingTimestampUpdate?.(startTimestamp, currentRecordingTime); // Notify parent about current time
    }, [startTimestamp, currentRecordingTime])

    // Render the webcam view
    return <
        Webcam ref={webcamRef} audio={false}
       
    />;
};

export default VideoRecorder;
