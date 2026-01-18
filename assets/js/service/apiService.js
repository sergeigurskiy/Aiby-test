export class ApiService {
    constructor(url) {
        this.api_url = url;
    }

    async changeLang() {
        try {
            let response = await fetch(this.api_url);
            if (!response.ok) {
                throw new Error(`error! - ${response.status}`);
            }
            let data = await response.json();
            return data;
        } catch (error) {
            console.error('error data!', error);
        }
    }
}