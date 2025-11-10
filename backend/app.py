from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from database import Database
from parser import LogParser
from detector import ThreatDetector
from report_generator import ReportGenerator

app = Flask(__name__)
CORS(app)

# Initialize components
db = Database()
parser = LogParser()
detector = ThreatDetector()
report_gen = ReportGenerator()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'version': '1.0.0'})

@app.route('/upload', methods=['POST'])
def upload_logs():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        content = file.read().decode('utf-8', errors='ignore')
        
        # Parse logs
        parsed_logs = parser.parse(content, file.filename)
        
        # Store in database
        db.insert_logs(parsed_logs)
        
        return jsonify({
            'status': 'success',
            'message': f'Processed {len(parsed_logs)} log entries',
            'count': len(parsed_logs)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['GET'])
def analyze_logs():
    try:
        # Get all logs from database
        logs = db.get_all_logs()
        
        # Run threat detection
        alerts = detector.detect(logs)
        
        # Get statistics
        stats = detector.get_statistics(alerts)
        
        return jsonify({
            'alerts': alerts,
            'stats': stats,
            'total_logs': len(logs)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        limit = request.args.get('limit', 100, type=int)
        severity = request.args.get('severity', None)
        
        logs = db.get_logs(limit=limit, severity=severity)
        return jsonify(logs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/timeline', methods=['GET'])
def get_timeline():
    try:
        logs = db.get_all_logs()
        alerts = detector.detect(logs)
        timeline = detector.generate_timeline(alerts)
        return jsonify(timeline)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/report', methods=['GET'])
def generate_report():
    try:
        logs = db.get_all_logs()
        alerts = detector.detect(logs)
        
        pdf_path = report_gen.generate_pdf(logs, alerts)
        return send_file(pdf_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clear', methods=['POST'])
def clear_data():
    try:
        db.clear_all()
        return jsonify({'status': 'success', 'message': 'All data cleared'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("LogWatch Sentinel Backend Starting...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)