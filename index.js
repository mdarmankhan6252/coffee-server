const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

//
//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) =>{
   res.send('my server is running...')
})

async function run() {
  try {

   const coffeeCollection = client.db('coffeeDB').collection('coffees')

//get all coffee.
   app.get('/coffee', async(req, res) =>{
      const result = await coffeeCollection.find().toArray();
      res.send(result)
   })

//get a specific coffee.
   app.get('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
   })

//post a single coffee
   app.post('/coffee', async(req, res) =>{
      const coffee= req.body;
      const result = await coffeeCollection.insertOne(coffee)
      res.send(result)
   })

   
//delete a single coffee
   app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
   })

//update a single coffee
   app.put('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const coffee = req.body;
      const filter = {_id : new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = {
         $set : {
            name : coffee.name,
            chef : coffee.chef,
            price : coffee.price,
            img_url : coffee.img_url
         }
      }
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options)
      res.send(result)
      

   })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   //nothing
  }
}
run().catch(console.dir);




app.listen(port, () =>{
   console.log('server is running... on port : ', port);
})
