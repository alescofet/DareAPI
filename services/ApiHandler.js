const axios = require('axios');

class InsuranceApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api'
    });
  }

  postLogin = (data) => this.api.post(`/login`, data);

}


module.exports = InsuranceApi