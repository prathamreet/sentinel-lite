from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import threading
from database import Database
from parser import LogParser
from detector import ThreatDetector
from report_generator import ReportGenerator
from log_monitor import LogMonitor

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize components
db = Database()
parser = LogParser()
detector = ThreatDetector()
report_gen = ReportGenerator()

# Log monitoring
LOG_DIR = '../logs'
os.makedirs(LOG_DIR, exist_ok=True)

# Stats
live_stats = {
    'total_logs': 0,
    'total_alerts': 0,
    'alerts_by_severity': {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0}
}

def process_new_logs(lines, filename):
    """Process new log lines from monitor"""
    global live_stats
    
    # Parse new logs
    content = ''.join(lines)
    parsed_logs = parser.parse(content, filename)
    
    if not parsed_logs:
        return
    
    # Store in database
    db.insert_logs(parsed_logs)
    
    # Detect threats
    alerts = detector.detect(parsed_logs)
    
    # Update stats
    live_stats['total_logs'] += len(parsed_logs)
    live_stats['total_alerts'] += len(alerts)
    
    for alert in alerts:
        severity = alert['severity']
        if severity in live_stats['alerts_by_severity']:
            live_stats['alerts_by_severity'][severity] += 1
    
    # BUILD TYPE STATS
    alert_types = {}
    all_alerts = detector.detect(db.get_all_logs())  # Get all alerts for complete stats
    for alert in all_alerts:
        alert_type = alert['type']
        alert_types[alert_type] = alert_types.get(alert_type, 0) + 1
    
    # Update live_stats with type information
    live_stats['by_type'] = alert_types
    live_stats['by_severity'] = live_stats['alerts_by_severity']
    
    # Emit to frontend via WebSocket
    if alerts:
        socketio.emit('new_alerts', {
            'alerts': alerts,
            'count': len(alerts)
        })
    
    socketio.emit('new_logs', {
        'logs': parsed_logs,
        'count': len(parsed_logs)
    })
    
    # IMPORTANT: Send complete stats
    socketio.emit('stats_update', live_stats)
    
    print(f"📊 Processed {len(parsed_logs)} logs, {len(alerts)} alerts | Stats: {live_stats}")


# Start log monitoring in background
monitor = LogMonitor(LOG_DIR, process_new_logs)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'version': '1.0.0', 'mode': 'LIVE'})

@app.route('/upload', methods=['POST'])
def upload_logs():
    """Upload logs manually (backup method)"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        content = file.read().decode('utf-8', errors='ignore')
        
        parsed_logs = parser.parse(content, file.filename)
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
        logs = db.get_all_logs()
        alerts = detector.detect(logs)
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
        global live_stats
        live_stats = {
            'total_logs': 0,
            'total_alerts': 0,
            'alerts_by_severity': {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0}
        }
        return jsonify({'status': 'success', 'message': 'All data cleared'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get live statistics"""
    return jsonify(live_stats)

@socketio.on('connect')
def handle_connect():
    print('🔌 Client connected')
    emit('connection_response', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    print('🔌 Client disconnected')

if __name__ == '__main__':
    print("🛡️  LogWatch Sentinel Backend Starting...")
    print("📡 Server running on http://localhost:5000")
    print("🔄 WebSocket enabled for live updates")
    print("👁️  Starting log monitoring...")
    
    # Start log monitor
    monitor.start()
    
    try:
        socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")
        monitor.stop()