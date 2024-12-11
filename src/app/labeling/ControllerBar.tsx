'use client'

import { IPIR } from "@/interfaces/PIR"
import { APIs } from "@/models/client/APIs"

import { Divider,   Paper, Stack, Typography } from "@mui/material"

import { useEffect } from "react"

import { VideoInfo } from "@/models/client/VideoInfo"
import dayjs from "dayjs";


// constrollers for Labeling
export const ControllerBar = ({
    videoInfo,
    timePlayed, // time played when playing the video (millisecond)
    // current, // start time + time played (millisecond)

}: {
    videoInfo?: VideoInfo,
    timePlayed?: number,
    // current?: number

}) => {

    useEffect(() => {
        console.log(videoInfo);
    }, [videoInfo])

    return (
        <>

            <Stack id="controller: wrapper" spacing={2} direction={"row"} alignItems={"center"} sx={{ margin: 1 }}>

                <Paper id=" time info: elevator" elevation={2} sx={{padding: 1 }} >

                    <Stack id="time info: millisec" spacing={2} direction={"row"} alignItems={"center"} >

                        <Typography
                            color="primary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>
                            Milliseconds

                        </Typography>


                        <Typography
                            color="secondary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>
                            Bắt đầu: {videoInfo?.beginTimestamp}

                        </Typography>

                        <Divider orientation="vertical" flexItem />

                        <Typography
                            color="secondary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>
                            Thời lượng: {videoInfo?.duration}

                        </Typography>

                        <Divider orientation="vertical" flexItem />

                        <Typography
                            color="secondary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>

                            Đã phát: {timePlayed}

                        </Typography>

                       

                    </Stack>

                </Paper>


                <Paper id="" elevation={2}  sx={{padding: 1 }}>
                    <Stack id="time info: readable" spacing={2} direction={"row"} alignItems={"center"} >

                        <Typography
                            color="primary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>
                            Thời gian

                        </Typography>


                        <Typography
                            color="secondary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>
                            Bắt đầu: {dayjs(videoInfo?.beginTimestamp).format("YYYY-MM-DD HH:mm:ss")}

                        </Typography>

                        <Divider orientation="vertical" flexItem />

                        <Typography
                            color="secondary"
                            component={"p"}
                            sx={{
                                fontWeight: "bold"
                            }}>
                            Thời lượng: {videoInfo && videoInfo?.duration / 1000} giây

                        </Typography>

                        <Divider orientation="vertical" flexItem />


                    </Stack>
                </Paper>


            </Stack>
        </>
    )
}