import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:5001/api/';

class ProductService {
    getAuthHeader(isFormData = false) {
        const user = AuthService.getCurrentUser();
        const headers = {
            Authorization: `Bearer ${user.token}`,
        };
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    async getAllProducts() {
        return axios.get(API_URL + 'products', {
            headers: this.getAuthHeader(),
        });
    }

    async addProduct(productData) {
        // productData — это FormData, не JSON
        return axios.post(API_URL + 'products', productData, {
            headers: this.getAuthHeader(true), // multipart
        });
    }

    async deleteProduct(productId) {
        return axios.delete(API_URL + `products/${productId}`, {
            headers: this.getAuthHeader(),
        });
    }

    async updateProduct(productId, productData) {
        return axios.put(API_URL + `products/${productId}`, productData, {
            headers: this.getAuthHeader(true), // для FormData
        });
    }

    async getAggregateData() {
        return axios.get(API_URL + 'products/aggregate', {  // добавлен products/
            headers: this.getAuthHeader(),
        });
    }


}


export default new ProductService();
