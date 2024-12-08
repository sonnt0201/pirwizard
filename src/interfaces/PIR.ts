

export interface IPIR {
    id: string;
    description: string;
}

// * template of response data from server
export interface IPirsOfGroupRes {
    payload: Payload[];
}

interface Payload {
    group_id:        string;
    pir_description: string;
    pir_id:          string;
}
