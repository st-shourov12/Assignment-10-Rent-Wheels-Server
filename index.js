const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vwvkzn8.mongodb.net/?appName=Cluster0`;

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

        const db = client.db('car_db');
        const carCollection = db.collection('cars');
        const userCollection = db.collection('users');
        const userCarBook = db.collection('myCarBoking');


        app.get('/latestCars', async(req, res)=>{
          const cursor = carCollection.find().sort({ _id: -1 }).limit(6);
          const result = await cursor.toArray();
          res.send(result)
        });

        

        

        app.get('/cars', async(req, res)=>{

          const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // app.get('/cars', async(req, res)=>{

        //   const email = req.query.email;
        //   console.log(email);
        //   const query = {};
        //   if (email) {
        //     query.providerEmail = email ;
        //   }
        //   const cursor = carCollection.find(query);
        //   const result = await cursor.toArray();
        //   res.send(result)
        // })

        // add cars
        app.post('/cars' , async(req,res)=>{
          const newCar = req.body.newCar;
          const result = await carCollection.insertOne(newCar);
          res.send(result)
        });

        app.get('/cars/:id' , async(req,res)=>{
          const id = req.params.id;
          const query = {_id : new ObjectId(id)};
          const result = await carCollection.findOne(query);
          res.send(result)

        })

        // /*updatedCar*/
        app.patch('/cars/:id', async(req,res)=>{
          const id = req.params.id;
          const updatedCar = req.body.updatedData || req.body ;
          delete updatedCar._id;
          const query ={_id: new ObjectId(id)};
          const update = {
            $set: updatedCar
            // {
            //   carName: updatedCar.carName,
            //   category: updatedCar.category,
            //   description: updatedCar.description,
            //   rentPrice: updatedCar.rentPrice,
            //   location: updatedCar.location,
            //   imageUrl: updatedCar.imageUrl,
            //   availability: updatedCar.availability
            // }
          };
          const result = await carCollection.updateOne(query, update);
          res.send(result)
        })

        // delete car
        app.delete('/cars/:id' , async(req, res)=>{
          const id = req.params.id;
          const query ={_id: new ObjectId(id)};
          const result = await carCollection.deleteOne(query);
          res.send(result)
        });

        app.post('/users' , async(req, res)=>{
          const newUser = req.body;

          const email = req.body.email;
          const query ={
            email: email
          };
          const existingUser = await userCollection.findOne(query);

          if (existingUser) {
            res.send({message: 'User already exist'})
          }else{
            const result = await userCollection.insertOne(newUser);
            res.send(result)
            
          }

          
          


          
        } )

        app.patch('/users/:id', async(req,res)=>{
          const id = req.params.id;
          const updateUser = req.body.updatedData || req.body ;
          delete updateUser._id;
          const query ={_id: new ObjectId(id)};
          const update = {
              $set: updateUser
          };
          const result = await userCollection.updateOne(query, update);
          res.send(result);
        })
          
          app.get('/users', async(req, res)=>{
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
          })


        // myCarslisting

          app.get('/myCars', async(req, res)=>{
            const cursor = userCarBook.find();
            const result = await cursor.toArray();
            res.send(result)
          })

          app.post('/myCars' , async(req,res)=>{
            const newCar = req.body.myCarBook || req.body;
            const result = await userCarBook.insertOne(newCar);
            res.send(result)
          });

          app.delete('/myCars/:id' , async(req, res)=>{
          const id = req.params.id;
          const query ={_id: new ObjectId(id)};
          const result = await userCarBook.deleteOne(query);
          res.send(result)
          });

          app.patch('/myCars/:id', async(req,res)=>{
          const id = req.params.id;
          const updatedCar = req.body.updatedData || req.body ;
          delete updatedCar._id;
          const query ={_id: new ObjectId(id)};
          const update = {
            $set: updatedCar
          };
          const result = await userCarBook.updateOne(query, update);
          res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment.");



    }
    finally{

    }
}
run().catch(console.dir);





app.listen(port , ()=>{
    console.log(`Car server running on ${port}`);
})




