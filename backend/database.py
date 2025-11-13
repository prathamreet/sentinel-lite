import sqlite3
import json
from datetime import datetime

class Database:
    def __init__(self, db_path='../database/logwatch.db'):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                source TEXT,
                severity TEXT,
                message TEXT,
                raw_log TEXT,
                log_type TEXT,
                ip_address TEXT,
                username TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def insert_logs(self, logs):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for log in logs:
            cursor.execute('''
                INSERT INTO logs (timestamp, source, severity, message, raw_log, log_type, ip_address, username)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                log.get('timestamp', ''),
                log.get('source', ''),
                log.get('severity', 'INFO'),
                log.get('message', ''),
                log.get('raw_log', ''),
                log.get('log_type', 'unknown'),
                log.get('ip_address', ''),
                log.get('username', '')
            ))
        
        conn.commit()
        conn.close()
    
    def get_all_logs(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM logs ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        
        logs = [dict(row) for row in rows]
        conn.close()
        return logs
    
    def get_logs(self, limit=100, severity=None):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if severity:
            cursor.execute('SELECT * FROM logs WHERE severity = ? ORDER BY timestamp DESC LIMIT ?', (severity, limit))
        else:
            cursor.execute('SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?', (limit,))
        
        rows = cursor.fetchall()
        logs = [dict(row) for row in rows]
        conn.close()
        return logs
    
    def clear_all(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM logs')
        conn.commit()
        conn.close()