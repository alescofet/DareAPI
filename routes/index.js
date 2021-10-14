const router = require('express').Router();
const axios = require('axios');
const InsuranceApi = require('../services/ApiHandler');


const insuranceApi = new InsuranceApi();
const myCredentials = { client_id: 'dare', client_secret: 's3cr3t' };


insuranceApi.api.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.data.statusCode === 401 && !originalRequest._retry && originalRequest.url !== "/api/login" && originalRequest.headers.Authorization) {
    console.log("INTERCEPTOR");

    originalRequest._retry = true;
   
    const response = await insuranceApi.postLogin(myCredentials);

    insuranceApi.api.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
    originalRequest.headers.Authorization = 'Bearer ' + response.data.token
  
    return insuranceApi.api(originalRequest);
  }
  return Promise.reject(error);
});

router.post("/login", (req,res)=>{
  const {username, password} = req.body
  
  insuranceApi.getClients()
  .then((result)=>{
  const loggedUser = result.data.find((user)=>{return user.email === username})
  insuranceApi.user = loggedUser
  res.status(200).json(loggedUser)
  })
  .catch((err)=>{
  res.status(401).json(err)
  })


})

router.get("/policies", (req,res)=>{
  let {limit} = req.query
  if (!limit){limit = 10}
  insuranceApi.getPolicies()
  .then((policies)=>{
    if(insuranceApi.user?.role === "admin"){
      const policyInfo=policies.data.slice(0,limit)
     res.json(policyInfo)
      
    }else{
      const policyInfo = policies.data.filter((policy)=>{
       return policy.email === insuranceApi.user.email
      })
      res.json(policyInfo.slice(0,limit))
    }
  
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.get("/policies/:id", (req,res)=>{
  const {id} = req.params
  insuranceApi.getClients()
  .then((clients)=>{
    if(insuranceApi.user?.role === "admin"){
      const userInfo = clients.data.filter((client)=>{
       return client.id === id
      })
      res.json(userInfo)
    } else{
      const userInfo = clients.data.filter((client)=>{
        return client.id === insuranceApi.user?.id
      })
      res.json(userInfo)
    }
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.get("/clients", (req,res)=>{
  let {limit,name} = req.query
  if (!limit){limit = 10}
  insuranceApi.getClients()
  .then((clients)=>{
    if(insuranceApi.user?.role === "admin"){
      if(name){
        const filteredClients = clients.data.filter((client)=>{
          return client.name.toLowerCase() === name.toLowerCase()
         })
        res.json(filteredClients.slice(0,limit))
      }else{
        res.json(clients.data.slice(0,limit))
      }
      
    }else{
      const userInfo = clients.data.filter((client)=>{
       return client.email === insuranceApi.user.email
      })
      res.json(userInfo)
    }
  
  })
  .catch((err)=>{
  console.log(err)
  })  
})

router.get("/clients/:id", (req,res)=>{
  const {id} = req.params
  insuranceApi.getClients()
  .then((clients)=>{
    if(insuranceApi.user?.role === "admin"){
      const userInfo = clients.data.filter((client)=>{
       return client.id === id
      })
      res.json(userInfo)
    } else{
      const userInfo = clients.data.filter((client)=>{
        return client.id === insuranceApi.user?.id
      })
      res.json(userInfo)
    }
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.get("/clients/:id/policies", (req,res)=>{
  const {id} = req.params
  insuranceApi.getPolicies()
  .then((policies)=>{
    if(insuranceApi.user?.role === "admin"){
      const policyInfo = policies.data.filter((policy)=>{
       return policy.clientId === id
      })
      res.json(policyInfo)
    } else{
      const policyInfo = policies.data.filter((policy)=>{
        return policy.clientId === insuranceApi.user?.id
      })
      res.json(policyInfo)
    }
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.post("/api/login", (req,res)=>{
  insuranceApi.postLogin(myCredentials)
  .then((response)=>{
    insuranceApi.api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    res.status(200).json(response.data)
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

 router.get('/api/clients', (req, res) => {
   console.log("CLIENT");
   
      insuranceApi.getClients(insuranceApi.token)
        .then((clients) => {
          res.status(200).json(clients.data);
        })
        .catch((err) => {
          if(err.status === 401){
            res.json("You must be logged in")
          }
          res.json(err);
        });
  })


router.get('/api/policies', (req, res) => {
      insuranceApi.getPolicies(insuranceApi.token)
        .then((policies) => {
          res.status(200).json(policies.data);
        })
        .catch((err) => {
          console.log(err);
        });
});

module.exports = router;
