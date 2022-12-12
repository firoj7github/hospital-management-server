const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterhospital.66shuij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
       await client.connect();
       console.log('database connected');
       const serviceCollection=client.db('hospital_management').collection('services');
       const bookingCollection=client.db('hospital_management').collection('bookings');

       app.get('/service', async(req,res)=>{
        const query={};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
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
      res.send(result);
  
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