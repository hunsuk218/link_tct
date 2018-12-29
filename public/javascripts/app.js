import IconService from 'public/javascripts/IconService.js';

class DeployAndTransferTokenExample {
	constructor() {
		// HttpProvider is used to communicate with http.
		this.provider = new HttpProvider('http://127.0.0.1:9000/api/v3');
		
		// Create IconService instance
		this.iconService = new IconService(this.provider);
	}
}