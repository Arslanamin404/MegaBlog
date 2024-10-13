// visit official documentation for root code
import { config } from "../config/config"
import { Client, Account, ID } from "appwrite"

export class AuthService {
    client = new Client()
    account;
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.account = new Account(this.client);
    }
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // if account created successfully, make user logged in
                return this.login({ email, password })
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            return error
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            return error
        }
    }
}
const authService = new AuthService();

export default authService;