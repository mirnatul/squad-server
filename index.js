const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dudbtcu.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();


        const boardCollection = client.db('squad').collection('board')
        const taskCollection = client.db('squad').collection('task')


        // board
        app.get('/boards', async (req, res) => {
            const result = await boardCollection.find().toArray()
            res.send(result)
        })

        app.post('/boards', async (req, res) => {
            const createBoard = req.body;
            const result = await boardCollection.insertOne(createBoard)
            res.send(result)
        })

        app.get('/boards/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await boardCollection.findOne(query)
            res.send(result)
        })

        app.put('/boards/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateBoard = req.body
            const board = {
                $set: {
                    boardName: updateBoard.boardName,
                    companyName: updateBoard.companyName,
                    description: updateBoard.description,
                    visibility: updateBoard.visibility,
                    owner: updateBoard.owner,
                    creator: updateBoard.creator,
                    time: updateBoard.time,
                    mentioned: updateBoard.mentioned
                }
            }
            const result = await boardCollection.updateOne(filter, board, options)
            res.send(result)
        })

        app.delete('/boards/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await boardCollection.deleteOne(query);
            res.send(result);
        })

        // task
        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray()
            res.send(result)
        })

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { boardId: id }
            const result = await taskCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/tasks', async (req, res) => {
            const createTask = req.body;
            const result = await taskCollection.insertOne(createTask)
            res.send(result)
        })

        // single task operation
        app.get('/single-task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query)
            res.send(result)
        })

        app.get('/single-task-description/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query)
            res.send(result)
        })

        app.put('/single-task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateTask = req.body
            const task = {
                $set: {
                    title: updateTask.title
                }
            }
            const result = await taskCollection.updateOne(filter, task, options)
            res.send(result)
        })

        app.put('/single-task-description/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateTask = req.body
            const task = {
                $set: {
                    description: updateTask.description
                }
            }
            const result = await taskCollection.updateOne(filter, task, options)
            res.send(result)
        })

        app.patch('/single-task/:id', async (req, res) => {
            const id = req.params.id;;
            const filter = { _id: new ObjectId(id) }
            // const options = { upsert: true }
            const updateRole = req.body
            const roleChange = {
                $set: {
                    role: updateRole.role
                }
            }
            const result = await taskCollection.updateOne(filter, roleChange)
            res.send(result)
        })

        app.delete('/single-task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        // update role




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('squad server is running')
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
