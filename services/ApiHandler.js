const axios = require('axios');

class InsuranceApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api'
    });
  }

  postLogin = (data) => this.api.post(`/login`, data);

  getClients = (token) => this.api.get(`/clients`, {headers:{Authorization: `${token.type} ${token.token}`}});

  getPolicies = (token) => this.api.get(`/policies`, {headers:{Authorization: `${token.type} ${token.token}`}});


}


module.exports = InsuranceApi