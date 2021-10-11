const router = require('express').Router();
const { default: axios } = require('axios');
const InsuranceApi = require('../services/ApiHandler')
const insuranceApi = new InsuranceApi()


/* GET home page */
router.get('/', (req, res, next) => {
  insuranceApi.postLogin({client_id: 'dare',client_secret: 's3cr3t'})
  .then((result)=>{
  console.log(result.data)
  res.status(200).json(result.data);
  })
  .catch((err)=>{
  console.log(err)
  })

});

module.exports = router;
