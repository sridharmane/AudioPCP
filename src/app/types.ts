export interface ITrial {
    timestamp: number;
    mode: number;
    trialNo: number;
    reactionTime: number;
}
export interface IAudio {
    count: number;
    sounds: string[];
}
export interface ICategory {
    id: number;
    name: string;
    imgSrc: string;
    useCount: number;
    sounds: string[];
}
export interface IOption {
    imageSrc: string;
    reactionTime?: number;
    status: 'untouched' | 'correct' | 'wrong';
    mode?: number;
    trialNumber?: number;
    timeStamp?: number;
    htmlElement?: HTMLElement;
    style?: {
        top: number;
        left: number;
    };
}
export interface IPlaybackOptions {
    isMuted?: boolean;
    audioSrc: string;
}

export interface ITickEventData {
    counter: number;
    completed: boolean;
}
