const router = require('express').Router();
const InsuranceApi = require('../services/ApiHandler');

const insuranceApi = new InsuranceApi();

/* GET home page */
router.get('/clients', (req, res) => {
  insuranceApi.postLogin({ client_id: 'dare', client_secret: 's3cr3t' })
    .then((token) => {
      console.log(token.data);
      /* res.status(200).json(token.data); */
      insuranceApi.getClients(token.data)
        .then((clients) => {
          res.status(200).json(clients.data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/policies', (req, res) => {
  insuranceApi.postLogin({ client_id: 'dare', client_secret: 's3cr3t' })
    .then((token) => {
      console.log(token.data);
      /* res.status(200).json(token.data); */
      insuranceApi.getPolicies(token.data)
        .then((policies) => {
          res.status(200).json(policies.data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
