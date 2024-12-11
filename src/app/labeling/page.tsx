'use client'

import { Stack } from "@mui/material"
import VideoPlayer from "./VideoPlayer"
import { useEffect, useRef, useState } from "react"

import { VideoInfo } from "@/models/client/VideoInfo"
import { ControllerBar } from "./ControllerBar"
import { LabelingMachine } from "./LabelingMachine"
import { PirRecord } from "@/models/client/PirRecord"
import { APIs } from "@/models/client/APIs"

 const Page = () => {

    const [videoInfo, setVideoInfo] = useState<VideoInfo>(); // info of current video
    const [timePlayed, setTimePlayed] = useState<number>(0); // current time playback

    const pirRecords = useRef<PirRecord[]>()

    useEffect(() => {
        if (videoInfo) {
            APIs.getRecordsMatchingWithVideo(videoInfo);
        }
    },[videoInfo])

    return (<>

       {videoInfo && <ControllerBar
        
        videoInfo={videoInfo}
        timePlayed={timePlayed}
        // current={(videoInfo && timePlayed)? (videoInfo?.beginTimestamp + timePlayed) : -1}
        />}

    <Stack direction={"row"} spacing={5} paddingX={3} >




        <VideoPlayer
            onVideoUpload={(filename: string) => {
                const info =  new VideoInfo(filename);
                setVideoInfo(info);
            }}

            onPlaybackTimeUpdate={(currentTime) => {setTimePlayed(currentTime)}}
        />

         {videoInfo &&  <LabelingMachine
         videoInfo={videoInfo}
         timePlayed={timePlayed}
         />}

    </Stack>
    </>)
}

export default Page