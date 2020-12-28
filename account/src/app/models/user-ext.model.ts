export const USER_EXT_COLLECTION_NAME = 'user_ext';

export interface UserExt {
    key?: string;
    uid: string;
    newsSubscription: boolean;
    tellUs: string;
}
