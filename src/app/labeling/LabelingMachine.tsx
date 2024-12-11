'use client'

import { ILabel } from "@/interfaces/ILabel"
import { IPirCsvRow } from "@/interfaces/IPirCsvRow"
import { APIs } from "@/models/client/APIs"
import { PirRecord } from "@/models/client/PirRecord"
import { VideoInfo } from "@/models/client/VideoInfo"
import { Button, ButtonGroup, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"

export const LabelingMachine = ({
    videoInfo,
    timePlayed
}: {
    videoInfo: VideoInfo,
    timePlayed: number // current time played of current video
}) => {

    const [current, setCurrent] = useState(0);

    const records = useRef<PirRecord[]>()

    const [labelsList, setLabelsList] = useState<ILabel[]>([
        {
            timestamp: 0,
            content: "id0"
        },
        {
            timestamp: Date.now(),
            content: "id0"
        }
    ]);

    /**
     * second step, create each label with timestamp
     * @param label 
     */
    const appendLabel = (label: ILabel) => {

        if (labelsList.findIndex(element => element.timestamp === label.timestamp) >= 0) {

            setLabelsList(prev => prev.map(element => {
                if (element.timestamp === label.timestamp) return label;
                return element;
            }).sort((a, b) => (a.timestamp - b.timestamp)) // sort by timestamp increasing anyway
            )

        } else {

            // sort by timestamp increasing anyway
            setLabelsList(prev => [...prev, label].sort((a, b) => (a.timestamp - b.timestamp)))
        }


    }


    const removeLabel = (timestamp: number) => {
        setLabelsList(prev => prev.filter(element => element.timestamp !== timestamp))
    }

    // fetch record mapping with video
    const fetchRecords = async () => {

        const ret = await APIs.getRecordsMatchingWithVideo(videoInfo)

        records.current = ret;

    }

    // first step to do when labeling: fetch the mapped record
    useEffect(() => {
        fetchRecords();
    }, [videoInfo])

    /**
     * After fetching records and create label list, start to create csv
     * 
     * Last step to do
     */
    const createCSV = () => {

        if (!records.current) return;

        let csvRows: IPirCsvRow[] = [];

        // set up timestamp and vols, didnt touch the labels yet
        for (const record of records.current) {
            const pairs = record.serializedPairs();

            for (const pair of pairs) {

                // not timestamp didnt exist, create one
                if (!csvRows.find(row => row.timestamp === pair.timestamp)) {

                    const newRow: IPirCsvRow = {
                        timestamp: pair.timestamp,

                        label: ""
                    }

                    newRow[record.pirId as string] = pair.vol

                    csvRows.push(newRow)
                } else {

                    csvRows.forEach(row => { // row is the csv row

                        // find the mapped row
                        if (row.timestamp !== pair.timestamp) return;

                        row[record.pirId] = pair.vol

                    })

                }

            }

        }


        // now make another loop to labeling
        csvRows.forEach(row => {
            let labelIndex = 0;

            // find the label
            const label = labelsList.find(
                (_, i, arr) =>
                (arr[i].timestamp <= row.timestamp
                    && arr[i + 1].timestamp > row.timestamp)
            )


            // assign to destination csv row
            if (label) {
                row.label = label.content
            }


        })

        // sort
        csvRows.sort((a, b) => a.timestamp - b.timestamp)

        /** 
         *  now create csv file and export as <a/> link
         *  */
        // Convert CSV rows to a CSV string
        const csvHeader = ["timestamp", ...Array(5).fill(null).map((_, i) => i.toString()), "label"];
        const csvContent = [
            csvHeader.join(","),
            ...csvRows.map(row => {
                const line = csvHeader.map(header => row[header] || "").join(",");
                return line;
            }),
        ].join("\n");

        // Create a Blob and an <a> link for download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${videoInfo.beginTimestamp}-${videoInfo.endTimestamp}.csv`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the object URL





    }

    return (
        <Paper elevation={2} sx={{ margin: 2, padding: 1 }}>
            <LabelsSelector

                current={current}

                onCurrentLabelChanged={(val) => setCurrent(val)}

                onSubmit={(currentLabel) => {


                    const timepoint = videoInfo.beginTimestamp + timePlayed
                    const content = "id" + currentLabel
                    appendLabel({
                        timestamp: timepoint,
                        content: content
                    });

                    console.log({
                        target: "appendLabel",
                        timestamp: timepoint,
                        label: content
                    }

                    )
                }}
            />

            {/* display label list */}
            <TableContainer component={Paper}>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">

                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp &nbsp;(ms)</TableCell>
                            <TableCell align="right">Nhãn</TableCell>
                            <TableCell align="right">Thao tác</TableCell>

                        </TableRow>
                    </TableHead>


                    <TableBody>

                        {
                            labelsList.map((label, index) =>


                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell id="cell: timestamp" component="th" scope="row">
                                        {label.timestamp}
                                    </TableCell>

                                    <TableCell id="cell: label content" align="right">{label.content}</TableCell>

                                    <TableCell id="actions" align="right">
                                        <Button id={`btn: delete` + index.toString()}

                                            // delete when clicked
                                            onClick={() => removeLabel(label.timestamp)}

                                            disabled={index === 0 || index === (labelsList.length - 1)}
                                        >
                                            Xóa
                                        </Button>

                                    </TableCell>
                                </TableRow>


                            )
                        }

                    </TableBody>

                </Table>
            </TableContainer>
            <Button color={"success"} variant="contained"

                onClick={createCSV}

                sx={{
                    marginY: 1
                }}
            >
                Xuất CSV
            </Button>
        </Paper>


    )
}







const LabelsSelector = ({
    current,
    onCurrentLabelChanged,
    onSubmit,
}: {
    current: number,
    onCurrentLabelChanged: (value: number) => void,
    onSubmit: (value: number) => void
}) => {

    const PositionMatrix: Array<Array<number>> = [
        [11, 12, 21, 22, 31, 32],
        [13, 14, 23, 24, 33, 34],
        [41, 42, 51, 52, 61, 62],
        [43, 44, 53, 54, 63, 64],
        [71, 72, 81, 82, 91, 92],
        [73, 74, 83, 84, 93, 94]
    ]


    return (
        <>
            {
                PositionMatrix.map((row: Array<number>, rowIndex) =>
                (
                    <Stack direction="row" key={`row: ${rowIndex}`} >
                        {
                            row.map((id: number) =>
                                <Button
                                    key={id.toString()}
                                    color={(current === id) ? "secondary" : undefined}
                                    variant={(current === id) ? "contained" : "text"}
                                    onClick={() => onCurrentLabelChanged(id)}

                                    sx={{
                                        marginX: 1
                                    }}
                                >

                                    {
                                        id
                                    }
                                </Button>
                            )
                        }
                    </Stack>




                )
                )
            }

            {/* <Paper > */}

            <Button color={(current === 0) ? "error" : "info"}
                variant={(current === 0) ? "contained" : "text"}
                onClick={() => onCurrentLabelChanged(0)}
                sx={{
                    marginX: 1
                }}
            >
                0
            </Button>

            <Button color={"success"} variant="contained" onClick={() => onSubmit(current)}
                sx={{
                    marginX: 1
                }}
            >
                Thêm
            </Button>


            {/* </Paper> */}

        </>

    )

}