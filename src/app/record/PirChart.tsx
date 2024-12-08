
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useCallback, useEffect, useRef, useState } from "react";
import { ChartData, Point } from 'chart.js/auto';
import { EncodedPirRecord, IPir } from "@/interfaces"
import axios from 'axios';
// import { ID } from '@/interfaces/ID';
import { PirRecord } from '@/models/client/PirRecord';


// import { color } from 'chart.js/helpers';
import { IGroup } from '@/interfaces/IGroup';
import { DEFAULT_PIR_GROUP_ID, DEFAULT_SERVER_ADDRESS } from '@/constants';

const DEFAULT_PIR_NUMBER = 5;

interface Props {
    capturing: boolean;
    // serverAddress: string;
    pirs: IPir[]

}


/*
{
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0,
          },
        ],
      }
*/

const CHART_COLORS: string[] = ["red", 'green', "yellow", "blue", "purple"]

export const PirChart = ({capturing, pirs }: Props) => {

    const [chartData, setChartData] = useState<ChartData<"line", (number | Point | null)[], unknown>>({ labels: [], datasets: [] });
    const [pirRecords, setPirRecords] = useState<PirRecord[]>([]);
    const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);


   

    // fetch data from server
    useEffect(() => {

        console.log({
            target: 'fetchRecordsWhenCapturing',
            lively_capturing: capturing
        })

        fetchRecordsWhenCapturing();


        // return () =>  { 
        //     if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
        // }
    }, [capturing])

    // when pir records change
    // useEffect(() => {

    //     updateChart();

    // }, [pirRecords])




    const updateChart: () => ChartData<"line", (number | Point | null)[], unknown> = useCallback(() => {

        let labels: number[] = [];

        let valuesForYAxis: number[][] = Array(pirs?.length).fill([]);
        let labelsForYAxis: string[] = [];
        // console.log(pirGroup)



        pirs?.forEach((pir: IPir, index: number) => {
            // console.log(pir.id)
            labelsForYAxis.push(pir.description as string);
            // filt data
            pirRecords.filter(record => record.pirId == pir.id).forEach((record) => {

                if (index === 0) labels = [...labels, ...record.timeInMillisecs()];

                valuesForYAxis[index] = [...valuesForYAxis[index], ...record.vols];

                // console.log(labels)

            })
        })


        return {
            labels,
            datasets:
                [...valuesForYAxis.map((datum, index) =>

                ({
                    label: labelsForYAxis[index],
                    data: datum,
                    fill: false,
                    borderColor: CHART_COLORS[index % CHART_COLORS.length],
                    // tension: 0.1,
                    pointRadius: 1
                })


                ),

                {
                    label: "Min",
                    data: labels.map(_ => 0),
                    fill: false,
                    borderColor: "black",
                    // tension: 0.1,
                    pointRadius: 1

                },

                {
                    label: "Max",
                    data: labels.map(_ => 3000),
                    fill: false,
                    borderColor: "black",
                    // tension: 0.1,
                    pointRadius: 1

                },


                ],
            options: {
                animations: false,

                scales: {
                    y: {
                        type: 'linear',
                        min: 0,
                        max: 3000
                    }
                }
            }
        }
        // setChartData(() => ());
    },[pirRecords])

    const fetchRecordsWhenCapturing = () => {
       
        if (!capturing) {
            if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
            return;
        }
        recordIntervalRef.current = setInterval(async () => {

            try {
                var response = await axios.get(`http://${DEFAULT_SERVER_ADDRESS}/api/records/latest?group=${DEFAULT_PIR_GROUP_ID}&number=6`,)


                // console.log(response.data.payload)

                let data = response.data.payload.sort((a: EncodedPirRecord, b: EncodedPirRecord) => (a["timestamp"] - b["timestamp"]));



                data = [...data,]

                setPirRecords(() =>
                  
                    data.map((datum: EncodedPirRecord) => new PirRecord({
                        id: datum["record_id"],
                        pir: datum["pir_id"],
                        time: datum["timestamp"],
                        vols: datum["voltages"],
                    }))
                )

            } catch (err: any) {
                console.log(err);
                // log(LogType.ERROR, "Something went wrong !", err.message)
            }
        }, 1000)

    }

    return <>

        <Chart type='line' data={updateChart()} />
    </>
}