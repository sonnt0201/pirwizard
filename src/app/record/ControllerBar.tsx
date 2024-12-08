'use client'

import { IPIR } from "@/interfaces/PIR"
import { APIs } from "@/models/client/APIs"

import { Button, Divider, FormControlLabel, LinearProgress, Paper, Stack, Switch, TextField, Typography } from "@mui/material"

import { useEffect, useMemo, useRef, useState } from "react"
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import { CameraAltRounded, CancelRounded, SaveAltRounded } from "@mui/icons-material"
import { DEFAULT_PIR_GROUP_ID, DEFAULT_PIR_GROUP_NAME, DEFAULT_SERVER_ADDRESS } from "@/constants"

// constrollers for recording video and display label data
export const ControllerBar = ({
    onRecordControlClick,
    notiLoading,
    recordingTime,
    onPirsUpdate,
    controlChart

}: {
    onRecordControlClick?: (action: "start" | "stop" | "cancel") => void,
    notiLoading?: (target: string, action: "start" | "stop") => void,
    recordingTime?: {
        start: number,
        current: number
    }

    onPirsUpdate?: (values: IPIR[]) => void

    controlChart?: (lively: boolean) => void

}) => {


    const [serverAddr, setServerAddr] = useState<string>(DEFAULT_SERVER_ADDRESS)
    const [isConnected, setIsConnected] = useState<boolean>(false); // check if server is connected
    const [pirs, setPirs] = useState<IPIR[]>([])
    const [recording, setRecording] = useState<boolean>(false);
    const [livelyChart, setLivelyChart] = useState<boolean>(true) // if chart is running real time


    const updatePirsInfo = async () => {
        // update pirs info when connection status change 
        const result = await APIs.getPirsOfGroup(serverAddr, DEFAULT_PIR_GROUP_ID);
        setPirs(result)
    }
    useEffect(() => { updatePirsInfo() }, [isConnected])



    // run on first mount
    const initIntervals = () => {
        // init interval
        const connectionTestInterval = setInterval(() => {
            APIs.checkConnection(serverAddr).then((check) => {
                setIsConnected(check);
            });
        }, 1000)


        return () => {
            clearInterval(connectionTestInterval);
        }
    }
    // init intervals functions called on first mount
    useEffect(initIntervals, [])


    useEffect(() => {
        // noti pirs to parent
        if (onPirsUpdate) onPirsUpdate(pirs)
    }, [pirs])


    useEffect(() => {

        if (controlChart) controlChart(livelyChart)

        // console.log('livelyChart: ', livelyChart)
    }, [livelyChart])


    // see component id to figure out the role
    return (
        <>


            <Paper id="paper wrapper for elevation" elevation={2} sx={{ padding: 1, margin: 1 }}>
                <Stack id="stack-controller-wrapper" spacing={2} direction={"row"} alignItems={"center"} >

                    <TextField
                        id="input-target-server-address"
                        label="Server Address (HTTP)"
                        type="text"
                        variant="standard"
                        disabled={true}
                        value={serverAddr}
                        onChange={(e) => {
                            setServerAddr(e.target.value)
                        }}
                    />


                    {

                        (isConnected) ? <Typography id="connecting state success" component="p" color="success">
                            Đã kết nối
                        </Typography> : <Typography id="connecting state failed" component="p" color="error">
                            Lỗi kết nối
                        </Typography>
                    }

                    {isConnected && <Typography id="text fixed pir group" component="p" color="secondary"
                        sx={{
                            fontWeight: "bold",
                            marginX: 2
                        }}
                    >
                        {DEFAULT_PIR_GROUP_NAME + ": "}
                        {pirs.length + " PIRs"}
                    </Typography>}


                    <Divider orientation="vertical" flexItem />



                    {!recording && <Button id="button start record" color="secondary" onClick={() => {
                        setRecording(true);
                        if (onRecordControlClick) onRecordControlClick("start");
                    }}
                        // disabled={isLoading}
                        startIcon={<CameraAltRounded />}
                        variant="contained"

                    >Ghi hình</Button>}



                    {recording && <Button id="button stop record" color="error"
                        onClick={() => {
                            setRecording(false);
                            if (onRecordControlClick) onRecordControlClick("stop");

                        }}
                        // disabled={isLoading}

                        variant="contained"

                        startIcon={<SaveAltRounded />}
                    >Dừng và lưu</Button>}



                    {recording && <Button id="button cancel record" color="warning"
                        onClick={() => {
                            setRecording(false);
                            if (onRecordControlClick) onRecordControlClick("cancel");
                        }}
                        // disabled={isLoading}
                        startIcon={<CancelRounded />}
                        variant="contained"
                    >Hủy</Button>}

                    {
                        recording && <Stack direction={"column"}>
                            <Typography id="text: video time counter" component="p" color="success" sx={{ fontWeight: "bolder" }}>
                                Bắt đầu: {recordingTime?.start}.
                            </Typography>
                            <Typography id="text: video time counter" component="p" color="error" sx={{ fontWeight: "bolder" }}>
                                Đang ghi {recordingTime ? recordingTime.current / 1000 : ""} giây...
                            </Typography>
                        </Stack>
                    }

                    <Divider orientation="vertical" flexItem />

                    <FormControlLabel id="check: lively chart" control={<Switch checked={livelyChart}
                        onChange={(_, checked) => {
                            setLivelyChart(checked)
                        }}
                    />}
                        label="Chạy đồ thị" />

                </Stack>

            </Paper>

        </>
    )
}