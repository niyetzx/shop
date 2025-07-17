import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:5001/api/categories/';

class CategoryService {
    getAuthHeader() {
        const user = AuthService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('User not authenticated');
        }
        return {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        };
    }

    async getAllCategories() {
        return axios.get(API_URL); // публичный GET — можно без токена
    }

    async createCategory(categoryData) {
        return axios.post(API_URL, categoryData, {
            headers: this.getAuthHeader()
        });
    }

    async updateCategory(categoryId, categoryData) {
        return axios.put(`${API_URL}${categoryId}`, categoryData, {
            headers: this.getAuthHeader()
        });
    }

    async deleteCategory(categoryId) {
        return axios.delete(`${API_URL}${categoryId}`, {
            headers: this.getAuthHeader()
        });
    }
}

export default new CategoryService();
