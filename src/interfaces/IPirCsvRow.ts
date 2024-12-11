/**
 * Only for pir group with 5 pir and DEFAULT configs (see in @/constants.ts)
 * 
 * 
 */
export interface IPirCsvRow {
    /**
     * milliseconds
     */
    timestamp: number;
    /**
     * one voltage
     */
    [index: string]: number | string;

    /** mapped label */
    label: string;
   
}