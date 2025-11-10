import re
from datetime import datetime

class LogParser:
    def __init__(self):
        self.patterns = {
            'syslog': r'(\w+\s+\d+\s+\d+:\d+:\d+)\s+(\S+)\s+(.+)',
            'apache': r'(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d+)',
            'windows': r'(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(\w+)\s+(.+)',
            'auth': r'(\w+\s+\d+\s+\d+:\d+:\d+).*(Failed|Accepted|Invalid)\s+password\s+for\s+(\S+)\s+from\s+(\S+)'
        }
    
    def parse(self, content, filename=''):
        """Parse logs from raw content"""
        logs = []
        lines = content.strip().split('\n')
        
        for line in lines:
            if not line.strip():
                continue
            
            parsed = self.parse_line(line, filename)
            if parsed:
                logs.append(parsed)
        
        return logs
    
    def parse_line(self, line, filename=''):
        """Parse individual log line"""
        log_entry = {
            'raw_log': line,
            'timestamp': self.extract_timestamp(line),
            'source': self.extract_source(line, filename),
            'severity': self.extract_severity(line),
            'message': line,
            'log_type': self.detect_log_type(line),
            'ip_address': self.extract_ip(line),
            'username': self.extract_username(line)
        }
        
        return log_entry
    
    def detect_log_type(self, line):
        """Detect log format type"""
        if 'Failed password' in line or 'Accepted password' in line:
            return 'auth'
        elif re.search(r'GET|POST|PUT|DELETE', line):
            return 'apache'
        elif re.search(r'\d{4}-\d{2}-\d{2}', line):
            return 'windows'
        else:
            return 'syslog'
    
    def extract_timestamp(self, line):
        """Extract timestamp from log line"""
        # Try different timestamp formats
        patterns = [
            r'\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}',  # Windows: 2024-01-15 14:30:45
            r'\w+\s+\d+\s+\d+:\d+:\d+',                 # Syslog: Jan 15 14:30:45
            r'\d{2}/\w+/\d{4}:\d{2}:\d{2}:\d{2}'       # Apache: 15/Jan/2024:14:30:45
        ]
        
        for pattern in patterns:
            match = re.search(pattern, line)
            if match:
                return match.group(0)
        
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    def extract_source(self, line, filename):
        """Extract source/hostname"""
        match = re.search(r'\b([a-zA-Z0-9\-]+)\b', line)
        return match.group(1) if match else filename
    
    def extract_severity(self, line):
        """Extract severity level"""
        line_lower = line.lower()
        if any(word in line_lower for word in ['critical', 'fatal', 'emergency']):
            return 'CRITICAL'
        elif any(word in line_lower for word in ['error', 'err', 'failed', 'failure']):
            return 'ERROR'
        elif any(word in line_lower for word in ['warning', 'warn']):
            return 'WARNING'
        else:
            return 'INFO'
    
    def extract_ip(self, line):
        """Extract IP address"""
        match = re.search(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', line)
        return match.group(0) if match else ''
    
    def extract_username(self, line):
        """Extract username"""
        patterns = [
            r'user[:\s]+(\S+)',
            r'for\s+(\S+)\s+from',
            r'login:\s+(\S+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return ''