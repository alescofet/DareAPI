const router = require('express').Router();
const axios = require('axios');
const InsuranceApi = require('../services/ApiHandler');
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require('../middleware/jwt.middleware');

let cache = {}

const getToken = (()=>{
  return jwt.decode(cache.token)
})



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
  }else if(error.response.data.statusCode === 200 && originalRequest.url !== "/api/clients"){
    console.log("INTERCEPTOR CLIENTS");
    
  }
  return Promise.reject(error);
});

router.post("/login", (req,res)=>{
  const {username, password} = req.body

  callApiLogin()
  try {
    
    setTimeout(() => {
      insuranceApi.getClients()
      .then((usersList)=>{
        let user = usersList.data.filter((user)=>{
          return user.email === username
        })
        user = user[0]
        
          if (!user) {
            // If the user is not found, send an error response
            res.status(401).json({ message: 'User not found.' })
            return
          }
    
          // Compare the provided password with the one saved in the database
          const passwordCorrect = user.id === password
    
          if (passwordCorrect) {
            // Deconstruct the user object to omit the password
            const { id, email, name, role } = user
    
            // Create an object that will be set as the token payload
            const payload = { id, email, name, role }
    
            // Create and sign the token
            const authToken = jwt.sign(
              payload,
              process.env.TOKEN_SECRET || 'capGemini',
              {
                //remember to create a .env and move the secret there
                algorithm: 'HS256',
                expiresIn: '6h',
              },
            )
    
            // Send the token as the response 
             
              cache.token = authToken
              const decodedToken = jwt.decode(cache.token)
             
              
  
            res.status(200).json({ token: cache.token, type: "Bearer", expires_in: (decodedToken.exp - decodedToken.iat) })
          } else {
            res.status(401).json({ message: 'Unable to authenticate the user' })
          }
      })
      .catch((err)=>{
        console.log(err);
        
        res.status(401).json(err)
      })
    }, 500);
  } catch (error) {
    console.log(error);
    
  }
  
  })




router.get("/policies", /* isAuthenticated, */ (req,res)=>{
  req.header.authorization = `Bearer: ${cache.token}`

  const user = getToken()
  
  let {limit} = req.query
  if (!limit){limit = 10}
  insuranceApi.getPolicies()
  .then((policies)=>{
    if(user.role === "admin"){
      const policyInfo=policies.data.slice(0,limit)
      policyInfo.forEach((policy)=>{
        delete policy.clientId
      })
     res.json(policyInfo)
      
    }else{
      const policyInfo = policies.data.filter((policy)=>{
       return policy.email === user.email
      })
      policyInfo.forEach((policy)=>{
        delete policy.clientId
      })
      res.json(policyInfo)
    }
  
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.get("/policies/:id", /* isAuthenticated, */ (req,res)=>{
  const {id} = req.params

  const user = getToken()

  insuranceApi.getClients()
  .then((clients)=>{
    if(user.role === "admin"){
      const userInfo = clients.data.filter((client)=>{
       return client.id === id
      })
      res.json(userInfo)
    } else{
      const userInfo = clients.data.filter((client)=>{
        return client.email === user.email
      })
      res.json(userInfo)
    }
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.get("/clients", /* isAuthenticated, */ (req,res)=>{
  let {limit,name} = req.query
 
  const user = getToken()
  
  if (!limit){limit = 10}
  insuranceApi.getClients()
  .then((clients)=>{
    insuranceApi.getPolicies()
    .then((policies)=>{
      if(user.role === "admin"){
        if(name){
          const filteredClients = clients.data.filter((client)=>{
            return client.name.toLowerCase() === name.toLowerCase()
           })
           filteredPolicies = policies.data.filter((policy)=>{
            return policy.clientId === filteredClients[0].id
           })
           filteredPolicies.forEach((policy)=>{
             delete policy.email
             delete policy.clientId
             delete policy.installmentPayment
           })
           filteredClients[0].policies = filteredPolicies
          res.json(filteredClients.slice(0,limit))
        }else{
          const clientList = clients.data
          clientList.forEach((client) => {
            filteredPolicies = policies.data.filter((policy)=>{
              return policy.clientId === client.id
             })
             filteredPolicies.forEach((policy)=>{
              delete policy.email
              delete policy.clientId
              delete policy.installmentPayment
            })
            client.policies = filteredPolicies
          });
          res.json(clientList.slice(0,limit))
        }
        
      }else{
        const userInfo = clients.data.filter((client)=>{
         return client.email === user.email
        })
        filteredPolicies = policies.data.filter((policy)=>{
          return policy.clientId === userInfo.id
         })
         filteredPolicies.forEach((policy)=>{
          delete policy.email
          delete policy.clientId
          delete policy.installmentPayment
        })
        console.log(userInfo);
        
        userInfo[0].policies = filteredPolicies

        res.json(userInfo)
      }
    
    })
    .catch((err)=>{
    console.log(err)
    })  
    })
    .catch((err)=>{
    console.log(err)
    })
    
})

router.get("/clients/:id", /* isAuthenticated, */ (req,res)=>{
  const {id} = req.params
  insuranceApi.getClients()
  .then((clients)=>{
    if(user.role === "admin"){
      const userInfo = clients.data.filter((client)=>{
       return client.id === id
      })
      res.json(userInfo)
    } else{
      const userInfo = clients.data.filter((client)=>{
        return client.id === user.id
      })
      res.json(userInfo)
    }
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

router.get("/clients/:id/policies", /* isAuthenticated, */ (req,res)=>{
  const {id} = req.params

  const user = getToken()

  insuranceApi.getPolicies()
  .then((policies)=>{
    if(user.role === "admin"){
      const policyInfo = policies.data.filter((policy)=>{
       return policy.clientId === id
      })
      res.json(policyInfo)
    } else{
      const policyInfo = policies.data.filter((policy)=>{
        return policy.clientId === user?.id
      })
      res.json(policyInfo)
    }
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

const apiLogin = (()=>{
  insuranceApi.postLogin(myCredentials)
  .then((response)=>{
    const decodedToken = (jwt.decode(response.data.token))
    console.log(decodedToken);
    console.log(decodedToken.exp);

    insuranceApi.api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    return(response.data.token)
    
  })
  .catch((err)=>{
  console.log(err)
  })
  
})

async function callApiLogin(){
  await apiLogin()
}


 router.get('/api/clients', (req, res) => {
   console.log("CLIENT");
   console.log("res inicial", res.statusCode);
   
    
      insuranceApi.getClients()
        .then((clients) => {        
          console.log("res final", res.statusCode)
          res.json(clients.data);
        })
        .catch((err) => {          
          if(err.response.data.statusCode === 401){
            res.json({error:"You must be logged in"})
          }else{
            console.log(err);
          }
        });
  })


router.get('/api/policies', (req, res) => {
      insuranceApi.getPolicies()
        .then((policies) => {
          res.status(200).json(policies.data);
        })
        .catch((err) => {
          console.log(err);
        });
});

module.exports = router;
