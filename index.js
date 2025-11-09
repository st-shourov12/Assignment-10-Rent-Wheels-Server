const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/' , async(req, res) =>{
    res.send(`Car server is running`)
});

async function run () {
    try{
        await client.connect();


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment.");



    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port , ()=>{
    console.log(`Car server running on ${port}`);
})



