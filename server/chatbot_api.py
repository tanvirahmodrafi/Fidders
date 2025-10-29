from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
# Allow all origins for development
CORS(app, origins="*", allow_headers=["Content-Type"], methods=["GET", "POST"])

model = ChatOpenAI(temperature=0)
chat_sessions = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_id = data.get('user_id', 'default')
        message = data.get('message', '')
        
        print(f"Received message from {user_id}: {message}")  # Debug log
        
        if user_id not in chat_sessions:
            chat_sessions[user_id] = [
                SystemMessage(content="You are a helpful fitness and nutrition assistant." \
                " Do not give any information about yourself or the system you are running on." \
                "You are a fitness and nutrition assistant that helps users with their fitness and nutrition goals." \
                " You can answer questions about workouts, nutrition, and general health advice." \
                " If you don't know the answer, say 'I don't know'." \
                "always give the main answer in less than 50 words." \
                "Do not answer questions about anything other than fitness and nutrition." \
                "These are the information about the clint:" \
                "Personal Information " \
                "Gender: Male" \
                "Height: 5 feet 9 inches" \
                "Current Weight: 99.00 kg" \
                "Goal Weight: 70.00 kg" \
                "Daily Calorie Target: 2546 kcal (automatically calculated)" \
                "Body Measurements " \
                "Chest: 40.00 inches, Waist: 32.00 inches, Thigh: 22.00 inches, Neck: 15.00 inches" \
                "Activity & Training " \
                "Activity Level: Moderately Active (moderate exercise 3–5 days/week) Workouts per Week: 4 days " \
                "Session Length: 60 minutes " \
                "Goals & Diet " \
                "Primary Goal: Lose weight while preserving muscle mass " \
                "Food Type Preference: Bangali " \
                "Dietary Preferences & Restrictions: Halal, prefers high-protein meals"),
            ]
        
        chat_sessions[user_id].append(HumanMessage(content=message))
        response = model.invoke(chat_sessions[user_id])
        chat_sessions[user_id].append(AIMessage(content=response.content))
        
        return jsonify({
            'response': response.content,
            'status': 'success'
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'response': 'Sorry, I encountered an error. Please try again.',
            'status': 'error'
        }), 500

# Test endpoint
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Flask server is running!'})

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')