import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth/';

class AuthService {
    async login(email, password) {
        const response = await axios.post(API_URL + 'login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('user');
    }

    async register(username, email, password) {
        return axios.post(API_URL + 'register', {
            username,
            email,
            password,
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    async getUserProfile() {
        const user = this.getCurrentUser();
        return axios.get(API_URL + 'profile', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
    }

    async updateUserProfile(profileData) {
        const user = this.getCurrentUser();
        return axios.patch(API_URL + 'profile', profileData, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
    }

    async changePassword(currentPassword, newPassword) {
        const user = this.getCurrentUser();
        return axios.patch(API_URL + 'change-password',
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${user.token}` } }
        );
    }

    async getAllUsers() {
        const user = this.getCurrentUser();
        return axios.get(API_URL + 'users', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
    }

    async updateUserRole(userId, role) {
        const user = this.getCurrentUser();
        return axios.patch(API_URL + `users/${userId}/role`, { role }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
    }
}

export default new AuthService();