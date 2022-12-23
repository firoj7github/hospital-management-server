const express = require('express')
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterhospital.66shuij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
  const authHeader= req.headers.authorization;
  if(!authHeader){
    return res.status('401').send({message:'unauthorized access'});
  }
};

async function run(){
  try{
       await client.connect();
       console.log('database connected');
       const serviceCollection=client.db('hospital_management').collection('services');
       const bookingCollection=client.db('hospital_management').collection('bookings');
       const userCollection=client.db('hospital_management').collection('users');

       app.put('/user/:email', async(req,res)=>{
        const email= req.params.email;
        const user = req.body;
        const filter={email: email};
        const options ={upsert: true};
        const updateDoc={$set: user};
        const result= await userCollection.updateOne(filter, updateDoc, options);
        const token= jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRATE, { expiresIn: '1h' } )
        res.send({result, token}); 

       })

       app.get('/service', async(req,res)=>{
        const query={};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
       })

      //  get fixed email appionment

      app.get('/booking',verifyJWT, async(req,res)=>{
        // const patientEmail=req.query.patientEmail;
        // const query= {patientEmail: patientEmail};
        // const authorization= req.headers.authorization;
        console.log(authorization);
        const query={}
        const cursor = bookingCollection.find(query);
        const bookings = await cursor.toArray();
        res.send(bookings);
       
      })

    
     //  post
     app.post('/booking', async(req,res)=>{
      const booking = req.body;
      const query = {treatment: booking.treatment, date: booking.date, patientEmail: booking.patientEmail}
      const exist = await bookingCollection.findOne(query);
      if(exist){
        return res.send({success:false})
      }
      const result = await bookingCollection.insertOne(booking);
      res.send({success:true, result});
  
    })
  }
  finally{

  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Backend Setup!')
})

app.listen(port, () => {
  console.log(`Runnung ${port}`)
})