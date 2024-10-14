import { Client, ID, Storage } from "appwrite"
import { config } from "../config/config"

export class StorageService {
    client = new Client();
    storage;
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId)
        this.storage = new Storage(this.client)
    }

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.error(`Appwrite StorageService :: uploadFile :: error ${error}`);
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.error(`Appwrite StorageService :: deleteFile :: error ${error}`);
            return false
        }
    }

    async getFilePreview(fileId) {
        try {
            return this.storage.getFilePreview(
                config.appwriteBucketId,
                fileId,
            )
        } catch (error) {
            console.error(`Appwrite StorageService :: getFilePreview :: error ${error}`);
        }
    }

}
const storageService = new StorageService()
export default storageService;