import express, { Express, Request, Response } from "express";
import { Collection, MongoClient, ServerApiVersion, Db } from "mongodb";

/* ---------- Interfaces ---------- */

interface Comment {
    writtenBy: string;
    content: string;
}

interface Story {
    name: string;
    likes: number;
    comments: Comment[];
}

/* ---------- MongoDB ---------- */

let db: Db;
let dbcollection: Collection<Story>;

async function dbConnection() {
    const uri = "mongodb://127.0.0.1:27017";

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    await client.connect();
    db = client.db("mern-stories-app");
    dbcollection = db.collection<Story>("stories");

    console.log("MongoDB conectado com sucesso");
}

/* ---------- Mock de dados ---------- */

const stories: Story[] = [
    { name: "echo", likes: 0, comments: [] },
    { name: "photograp", likes: 10, comments: [] },
    { name: "stell", likes: 0, comments: [] },
    { name: "visitor", likes: 0, comments: [] },
    { name: "song", likes: 0, comments: [] },
];

/* ---------- Express ---------- */

const app: Express = express();
app.use(express.json());

/* ---------- Rotas ---------- */

app.get("/stories/:name", (req: Request, res: Response) => {
    const { name } = req.params;
    res.send(`Story Name: ${name}`);
});

app.post("/api/stories/:name/like", (req: Request, res: Response) => {
    const story = stories.find(story => story.name === req.params.name);

    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    story.likes += 1;
    res.json(story);
});

app.post("/api/stories/:name/comments", (req: Request, res: Response) => {
    const { writtenBy, content } = req.body;

    const story = stories.find(story => story.name === req.params.name);

    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }

    story.comments.push({ writtenBy, content });
    res.json(story);
});

/* ---------- Inicialização ---------- */

async function initialize() {
    await dbConnection();

    app.listen(3000, () => {
        console.log("Server up & running on port 3000");
    });
}

initialize();
