const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');

const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER1}:${process.env.DB_PASS}@cluster0.ib20y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tourism");
        const ticketCollection = database.collection("ticket");
        const orderCollection = database.collection('order');

        // GET API 
        app.get('/service', async(req,res) => {
            const cursor = ticketCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET API For Single Service 
        app.get('/service/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ticketCollection.findOne(query);
            res.json(result);

        });

        // GET API For myOrders 
        app.get('/Orders', async(req,res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // POST API For Service
        app.post('/service', async(req,res) => {
            const query = req.body;
            console.log('hitted');
            const result = await ticketCollection.insertOne(query);
            res.json(result);
        });

        // POST API for Orders 
        app.post('/orders', async(req,res) => {
            const query = req.body;
            const result = await orderCollection.insertOne(query);
            res.json(result);
        })
        

        // DELETE API 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })
        
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server connected');
});



app.listen(port, () => {
    console.log('connected on port', port);
})
