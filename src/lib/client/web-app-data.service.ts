import type { WebAppUser } from "telegram-web-app";
import { verifyInitData } from "../../routes/(app)/init-data.remote";
import WebApp from "@twa-dev/sdk";

let isValidPromise: Promise<void>;

class WebAppDataService {
    async getUser(): Promise<WebAppUser> {
        await this.verfiyUserData();
        return WebApp.initDataUnsafe.user as WebAppUser;
    }

    private async verfiyUserData() {
        try {
            if (!isValidPromise) {
                isValidPromise = verifyInitData(WebApp.initData);
            }

            await isValidPromise;
        } catch (err) {
            try {

                WebApp.showAlert('Invalid or outdated init data');
                WebApp.close();
            } catch (err2) {
                throw new Error('Invalid or outdated init data');
            }
        }
    }
}

export default new WebAppDataService();