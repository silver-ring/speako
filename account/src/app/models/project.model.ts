export const PROJECTS_COLLECTION_NAME = 'projects';

export interface Project {
    key?: string;
    uid: string;
    title: string;
    paragraphs: Paragraph[];
}

export interface Paragraph {
    key?: number;
    text: string;
    speaker: string;
    speed: number;
    duration: number;
    audioKey: string;
    pitch: number;
    profiles: string[];
    gainDb: number;
    isSsml: boolean;
}
