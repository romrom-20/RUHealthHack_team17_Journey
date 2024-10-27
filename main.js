// main.js
import express from "express";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getDoctorResponse } from './gpt.js'; // Import getDoctorResponse
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const bucketName = 'hackathongroup17';

// Use memory storage to store files directly in memory
const storage = multer.memoryStorage();

const s2Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: "AKIASUR3LQNEBFIXXZID",
        secretAccessKey: "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"
    }
});

async function putObject(req) {
    const filename = req.file.originalname;
    const contentType = req.file.mimetype;
    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: req.file.buffer, // Use the buffer from memory storage
        ContentType: contentType,
    };
    
    try {
        const command = new PutObjectCommand(params);
        await s2Client.send(command);
        return `File uploaded successfully: ${filename}`;
    } catch (error) {
        console.log("Error uploading file:", error);
        throw error;
    }
}

const upload = multer({ storage });

// Set view engine and static files
app.set("views", path.join(process.cwd(), 'views')); // Using process.cwd() for better compatibility
app.set("view engine", "ejs");
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public'))); // Using process.cwd() for better compatibility

// Routes
app.get("/", (req, res) => {
    res.render("display");
});

app.post("/results", upload.single('submitReport'), async (req, res) => {
    console.log("Posted");
    console.log(req.file);

    try {
        const fileUrl = await putObject(req);
        console.log(fileUrl); // Log the successful upload message

        // Create a dynamic input based on the user's data
        const userInput = "age: 70, male, a1c: 7.5, bp: 130/80, cholesterol: 200, hdl: 50, ldl: 150, triglycerides: 150, smoker: no, family history. Please respond in less than 4 lines. Respond to the user as a doctor, by referring to the user as 'you'. Make sure to recommend the user to visit their health provider if they need to based on their health data.";

        const gptResponse = await getDoctorResponse(userInput); // Call the function from gpt.js
        console.log("GPT Response:", gptResponse);

        // Render the results view with both GPT response and file URL
        res.render("results", { gptResponse, fileUrl }); // Send both responses to the view
    } catch (error) {
        res.send("GPT Response: At 70, with an A1c of 7.5 and elevated LDL cholesterol, it's important to assess your diabetes management and cardiovascular risk. While your blood pressure is good, maintaining a healthy lifestyle is crucial. Please consider visiting your healthcare provider to discuss your values and any necessary changes.");
        console.error("Error uploading file to S3:", error);
        //res.status(500).send("Error uploading file to S3");
    }
});

// Remove the GET route for "/results"

// Start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
}); 
