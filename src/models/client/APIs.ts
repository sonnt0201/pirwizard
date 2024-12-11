import { EncodedPirRecord } from '@/interfaces';
import { IVideoInfo } from './../../interfaces/IVideoInfo';
import { IPIR, IPirsOfGroupRes } from "@/interfaces/PIR";
import axios from "axios";
import { PirRecord } from './PirRecord';
import { DEFAULT_PIR_GROUP_ID } from '@/constants';




class APIsClass {

    // * check connection with server, return true if connection is oke
    async checkConnection(serverAddr: string): Promise<boolean> {
        
        const url = serverAddr.startsWith("http://") ? serverAddr : ("http://" + serverAddr);

        try {
            const res = await axios.get(url);
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (e)  {
            console.error({
                target: "APIs.checkConnection",
                error: e
            });
            return false;
        }

        
    }


    async getPirsOfGroup(serverAddr: string, groupId: string): Promise<IPIR[]> {
        
        let url = serverAddr.startsWith("http://") ? serverAddr : ("http://" + serverAddr);

        url += `/api/pirs/group?group_id=${groupId}`;

        try {
            const res = await axios.get(url);
            const data = res.data as IPirsOfGroupRes;
            const payload = data.payload
            return payload.map(val => {
               return  {
                    id: val.pir_id,
                    description: val.pir_description
                }
            })

        } catch (e) {
            
            return [];
        }
    }

    async getRecordsMatchingWithVideo(videoInfo: IVideoInfo): Promise<PirRecord[]> {
        const res = await axios.get(`http://localhost:8080/api/records?group=${DEFAULT_PIR_GROUP_ID}&begin=${Math.floor(videoInfo.beginTimestamp)}&end=${Math.floor(videoInfo.endTimestamp)}`);
        const data = res.data.payload.sort((a: EncodedPirRecord, b: EncodedPirRecord) => (a["timestamp"] - b["timestamp"]));

       
           return data.map((datum: EncodedPirRecord) => new PirRecord({
                id: datum["record_id"],
                pir: datum["pir_id"],
                time: datum["timestamp"],
                vols: datum["voltages"],
            }))
       

    }
}

export const APIs = new APIsClass();