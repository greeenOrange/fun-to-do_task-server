const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
// require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://fun-todo_task:GC2GXxouQqWdW9Gv@cluster0.jbgbo.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if(!authHeader){
//     return res.status(401).send({message: 'unAuthorized access'})
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
//     if(err){
//       return res.status(403).send({message: "Forbidden access"})
//     }
//     req.decoded = decoded;
//     next()
//   });
// }

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db("fun-to-do_task");
    const taskCollection = db.collection('tasks');

  app.post('/tasks', async(req,res)=>{
    const taskData = req.body;
    const result = await taskCollection.insertOne(taskData)
    res.send(result)
  });

  app.get('/tasks', async(req, res) =>{
    const cursor = taskCollection.find({});
    const tasks = await cursor.toArray();
    res.send(tasks);
    });

    app.get('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID' });
      }
      const query = { _id: new ObjectId(id) };
      const task = await taskCollection.findOne(query);
    
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    });

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const result = await taskCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
    
        if (result.deletedCount === 1) {
          res.json({ message: "Task deleted successfully" });
        } else {
          res.status(404).json({ message: "Task not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task" });
      }
    });
    

    app.put('/tasks/:id', async(req, res) =>{
      const id = req.params.id;
      const option = {
        upsert: true,
      };
      const query = { _id: new ObjectId(id) };
      const serviceData = {
        $set: {
          title: body.title,
          email: body.email,
          priority: body.priority,
        },
      };
      const result = await usersCollection.updateOne(query, serviceData, option);
      console.log(result);
      res.send(result);      
    })


  }
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
   finally{
    
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('welcome fun-to-do_task!')
  })
  
  app.listen(port, () => {
    console.log(`To Do Task Manager ${port}`)
  })