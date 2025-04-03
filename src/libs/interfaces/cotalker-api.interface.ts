import { CotalkerUser } from "./cotalker-user.interface";

export interface CotalkerApi {
	me(token: string): Promise<CotalkerUser>;
	getUserById(userId: string): Promise<COTUser>;
}
