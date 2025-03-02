from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import urllib.parse
from google import genai
from google.genai import types

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

username = urllib.parse.quote_plus("lucasloliva")
password = urllib.parse.quote_plus("R9oGgEun3IIY6DQ9")
uri = f"mongodb+srv://{username}:{password}@journal.lka8y.mongodb.net/?retryWrites=true&w=majority&appName=Journal&tls=true&tlsAllowInvalidCertificates=true"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["Journal"]
collection = db["entries"]

@app.route('/add_entry', methods=['POST'])
def add_entry():
    data = request.json
    document = {
        "content": data.get("content"),
        "date": data.get("date")
    }
    try:
        collection.insert_one(document)
        return jsonify({"message": "Inserted document successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_entries', methods=['GET'])
def get_entries():
    try:
        entries = list(collection.find({}, {"_id": 0}))  # Exclude the _id field
        return jsonify(entries), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate_content', methods=['POST'])
def generate_content():
    try:
        entries = list(collection.find({}, {"_id": 0, "content": 1}))  # Get only the content field
        prompt = " ".join(entry["content"] for entry in entries)  # Concatenate all content

        client = genai.Client(api_key="")
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt + " You are telling your patient about your observations about their mental health based on their previous journal entries.Just tell them your observations there will be no more contact with your patient. 350 words or less"],
            config=types.GenerateContentConfig(
                max_output_tokens=350,
                temperature=0.1
            )
        )
        return jsonify({"content": response.text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)