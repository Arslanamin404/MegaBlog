import { Client, Databases, Query, Storage } from "appwrite"
import { config } from "../config/config"

export class DatabaseService {
    client = new Client;
    databases;
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createPost({ title, slug, content, featuredImage, status, userId, createdAt }) {
        try {
            // we will use slug as document ID
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug, // documentId
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    createdAt
                })
        } catch (error) {
            console.error(`Appwrite DatabaseService :: createPost :: error ${error}`);
        }
    }

    // slug will be used as document ID
    async updatePost(slug, { title, content, featuredImage, status, createdAt }) {
        try {
            // we will use slug as document ID
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug, // documentId
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    createdAt
                });
        } catch (error) {
            console.error(`Appwrite DatabaseService :: updatePost :: error ${error}`);
        }
    }

    async deletePost(slug) {
        try {
            // we will use slug as document ID
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.error(`Appwrite DatabaseService :: deletePost :: error ${error}`);
            return false;
        }
    }

    async getPost(slug) {
        try {
            // we will use slug as document ID
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.error(`Appwrite DatabaseService :: getPost :: error ${error}`);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.error(`Appwrite DatabaseService :: getPosts :: error ${error}`);
            return false;
        }
    }

}
const databaseService = new DatabaseService();
export default databaseService;