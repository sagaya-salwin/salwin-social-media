import express from "express";
import { google } from "googleapis";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SHEET_ID = "1bEIF8hUyep9i0I4L1Wm3ZuWRdjOpbYbKHWxJ2s6zLUw"; // Replace with actual Sheet ID

// Load client credentials
const auth = new google.auth.GoogleAuth({
  keyFile: "refined-gist-444507-p8-57288790678f.json",
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

// **GET Data from Google Sheets**
app.get("/api/data", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1:H10", // Adjust range
    });
    console.log("Getting Data is Sucess")
    res.json(response.data.values);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// **POST Data to Google Sheets**
app.post("/api/data", async (req, res) => {
  const { values } = req.body;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: { values },
    });
    res.send("Data added successfully");
    console.log("Data Sucessfully Added.")
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send("Error adding data");
  }
});


// **PUT Data to Google Sheets by ID**
app.put("/api/data/:id", async (req, res) => {
    const id = req.params.id; // ID from request URL
    const { values } = req.body; // Updated data
  
    try {
      // Step 1: Fetch all data to find the row index
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:H", // Adjust range based on your sheet structure
      });
  
      const rows = response.data.values;
      if (!rows) return res.status(404).send("No data found");
  
      // Step 2: Find the row index of the given ID
      const rowIndex = rows.findIndex((row) => row[0] === id);
      if (rowIndex === -1) return res.status(404).send("ID not found");
  
      // Step 3: Update the found row
      const range = `Sheet1!A${rowIndex + 1}:H${rowIndex + 1}`; // Convert index to range
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range,
        valueInputOption: "RAW",
        resource: { values: [values] },
      });
  
      console.log('sucees')
      res.send("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).send("Error updating data");
    }
  });
  
app.delete("/api/data/:id", async (req, res) => {
  const idToDelete = req.params.id;

  try {
    // Fetch all rows from Sheet1
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1",
    });

    let rows = result.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).send("No data found");
    }

    // Find the row index with the matching ID
    const rowIndex = rows.findIndex((row) => row[0] === idToDelete);
    if (rowIndex === -1) {
      return res.status(404).send("ID not found");
    }

    // Use batchUpdate to delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Default is first sheet (change if needed)
                dimension: "ROWS",
                startIndex: rowIndex, // Row index to delete
                endIndex: rowIndex + 1, // Delete only this row
              },
            },
          },
        ],
      },
    });

    res.send("Row deleted successfully");
  } catch (error) {
    console.error("Error deleting row:", error);
    res.status(500).send("Error deleting row");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
