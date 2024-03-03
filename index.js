
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5022;

app.use(express.json());
app.use(cors());
require('dotenv').config();


// ================================MONGODB================================


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frg7rqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database and collections ========================!
    const userCollection = client.db("LinkShareDB").collection("usersCollection");
    const linksCollection = client.db("LinkShareDB").collection("linksCollection");
    // database and collections ========================!


    // Get Api ===========================>>>>>
    app.get('/users', async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
    })

    // Post User Api =====================>>>>>
    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await userCollection.insertOne(data);
      res.send(result);
    })

    // Update User Role API ==============>>>>>
    app.patch('/users', async (req, res) => {
      const { uid, status } = req.body;
      const query = { _id: new ObjectId(uid) };
      const updatedDoc = {
        $set: {
          role: status
        }
      }
      const result = await userCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    // check Admin status API ============>>>>>
    app.get('/admin', async (req, res) => {
      const { email } = req.query;
      if (email) {
        const query = { email };
        const target = await userCollection.findOne(query);
        if (target.role === "admin") {
          res.send(true)
        } else {
          res.send(false)
        }
      }
    })

    // get all Links API ================>>>>>>
    app.get('/links', async (req, res) => {
      const result = await linksCollection.find({}).toArray();
      res.send(result);
    })

    // post new link API =================>>>>>
    app.post('/links', async (req, res) => {
      const data = req.body;
      const result = await linksCollection.insertOne(data);
      res.send(result);
    })

    // Delete link API ===================>>>>>
    app.delete('/links/:sid',async(req,res)=>{
      const sid = req.params.sid;
      const query = {_id : new ObjectId(sid)}
      const result = await linksCollection.deleteOne(query);
      res.send(result);
    })

    // get one link API =================>>>>>
    app.get('/one/:sid',async(req,res)=>{
      const sid = req.params.sid;
      const query = {_id : new ObjectId(sid)};
      const result = await linksCollection.findOne(query);
      res.send(result);
    })


    app.patch('/edit',async(req,res)=>{
      const data = req.body;
      const query = {_id : new ObjectId(data?.sid)}
      const updatedDoc = {
        $set : {
          text : data.text,
          url : data.url,
        }
      }
      const result = await linksCollection.updateOne(query,updatedDoc);
      res.send(result);
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// ================================MONGODB================================





app.get('/', (req, res) => {
  res.send("Server is Running !")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})