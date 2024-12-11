'use client'

import { LinearProgress, Paper, Stack } from "@mui/material";
import { ControllerBar } from "./ControllerBar"
import { useEffect, useState } from "react";
import VideoRecorder from "./VideoRecorder"
import { PirChart } from "./PirChart";
import { DEFAULT_SERVER_ADDRESS } from "@/constants";
import { IPir } from "@/interfaces";

export default function Page() {


    const [loadingQueue, setLoadingQueue] = useState<Set<string>>(new Set([]))

    const [recordAction, setRecordAction] = useState<"start" | "stop" | "cancel">()

    const [recordingTime, setRecordingTime] = useState<{ start: number, current: number }>()

    const [pirs, setPirs] = useState<IPir[]>([])

    const [livelyChart, setLivelyChart] = useState<boolean>(true)

    // run once
    useEffect(() => {
        console.clear()
    }, [])

    const addToLoadingQueue = (target: string) => {
        setLoadingQueue(prev => {
            const set = prev
            set.add(target);
            return set;
        });
    }

    const removeFromLoadingQueue = (target: string) => {
        setLoadingQueue(prev => {
            prev.delete(target);
            return prev;
        })
    }

    useEffect(() => {
        console.log('livelyChart: ', livelyChart)
    },[ livelyChart])

    return <>
        {loadingQueue.size !== 0 && <LinearProgress />}


        <ControllerBar
            onRecordControlClick={(action) => {
                setRecordAction(action);
            }}

            recordingTime={recordingTime}

            onPirsUpdate={values => setPirs(values)}

            controlChart={(val) => {
                // console.log({
                //     target: "call: controlChart",
                //     lively: val
                // })
                setLivelyChart(val)
            }}
        />


        <Stack direction="row" spacing={1}>
            <Paper 
            id="wrapper for video recorder"
            sx={{width: "40%"}}>

                <VideoRecorder

                    recordAction={recordAction}
                    onRecordingTimestampUpdate={(start, current) => {
                        // console.log({
                        //     target: "recordingTime",
                        //     start,
                        //     current
                        // })

                        if (start !== null && current !== null) setRecordingTime({
                            start: start,
                            current: current
                        })
                    }}



                />
            </Paper>

            <Paper id="wrapper for chart" sx={{flex: 1}}>
                <PirChart
                     capturing = {livelyChart}
                    // serverAddress={DEFAULT_SERVER_ADDRESS}
                    pirs={pirs}

                    onError={() => {
                        // when error, force to cancel

                        setRecordAction("cancel");
                    }}
                />
            </Paper>

        </Stack>


    </>
}