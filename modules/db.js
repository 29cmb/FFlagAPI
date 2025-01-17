
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DATABASEUSER}:${process.env.DATABASEPASS}@${process.env.DATABASEURI}/?retryWrites=true&w=majority&appName=${process.env.DATABASEAPPNAME}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = {
    client: client,
    databases: {},
    collections: {},
    async run() {
        try {
            await client.connect();

            // assign databases
            const db = client.db(process.env.DATABASENAME)
            this.databases.main = db
            this.collections.fflags = db.collection(process.env.FFlagsCollectionName)
            this.collections.logs = db.collection(process.env.LogsCollection)
            this.collections.webhooks = db.collection(process.env.WebhooksCollection)

            // ping
            await db.command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
            await client.close();
        }
    },
}
