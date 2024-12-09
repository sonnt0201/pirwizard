import { ID } from "@/interfaces/ID";
import { IPirRecord } from "@/interfaces/IPirRecord";


export class PirRecord implements IPirRecord {
    private _recordId: string;
    private _pirId: string;
    private _vols: number[];
    private _time: number;

    constructor({ id, pir, vols, time }: {
        id: ID;
        pir: ID;
        vols: number[];
        time: number;
    }) {
        this._recordId = id;
        this._pirId = pir;
        this._vols = vols;
        this._time = time;
    }
    get recordId() {
        return this._recordId;
    };
    get pirId() {
        return this._pirId;
    }
    get vols() {
        return this._vols;
    }
    get time() {
        return this._time;
    }
    // set time(value: number) {
    //     this._time = value;
    // }

    // set recordId(value: ID) {
    //    this._recordId = value;
    // };
    // set pirId(value: ID) {
    //    this._pirId = value;
    // }
    // set vols(value: number[]) {
    //      this._vols = value;
    // }

    // Incominng timestamp is now in millisecs
    timeInMillisecs(): number[] {
        const times = [];
        const numberOfVols = this._vols.length;
        const step = Math.floor(1000 / numberOfVols)
        for (let i = 0; i < 1000; i+= step) {
            // times.push(this._time * 1000 + i);  // for old timestamp as seconds
            times.push(this._time + i);
        }
        return times;
    }


    serializedPairs(): {
        timestamp: number;
        vol: number;
    }[] {

        if (this._vols.length !== 100) {
            console.log("Record cannot be serialized")
            return [];
        }

        const out = [];

       
        const numberOfVols = this._vols.length;
        for (let i = 0; i < 1000; i+= Math.floor(1000 / numberOfVols)) {
            out.push({
                timestamp: (this._time * 1000 + i),
                vol: this._vols[Math.floor(i / 10)]
            });
        }

        return out;
    } 



}