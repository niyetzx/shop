import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:5001/api/auth/';

class UserService {
    getAuthHeader() {
        const user = AuthService.getCurrentUser();
        return { Authorization: `Bearer ${user.token}` };
    }

    async getAllUsers() {
        return axios.get(API_URL + 'users', {
            headers: this.getAuthHeader()
        });
    }

    async createUser(userData) {
        return axios.post(API_URL + 'users', userData, {
            headers: this.getAuthHeader()
        });
    }

    async deleteUser(userId) {
        return axios.delete(API_URL + `users/${userId}`, {
            headers: this.getAuthHeader()
        });
    }

    async updateUserRole(userId, role) {
        return axios.patch(API_URL + `users/${userId}/role`, { role }, {
            headers: this.getAuthHeader()
        });
    }
    async updateUser(userId, updatedData) {
        return axios.patch(API_URL + `users/${userId}`, updatedData, {
            headers: this.getAuthHeader()
        });
    }

}

export default new UserService();