const axios = require('axios');

class InsuranceApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api'
    });
    this.user = undefined

  }

  postLogin = (data) => this.api.post(`/login`, data);

  getClients = (token) => this.api.get(`/clients`);

  getPolicies = (token) => this.api.get(`/policies`);




}


module.exports = InsuranceApi