import { IPIR, IPirsOfGroupRes } from "@/interfaces/PIR";
import axios from "axios";




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
}

export const APIs = new APIsClass();