import re
import json
from collections import Counter, defaultdict
from datetime import datetime

class ThreatDetector:
    def __init__(self):
        self.rules = self.load_rules()
    
    def load_rules(self):
        """Load detection rules"""
        return {
            'brute_force': {
                'pattern': r'Failed password|authentication failure|invalid user',
                'threshold': 5,
                'severity': 'HIGH',
                'description': 'Multiple failed login attempts detected'
            },
            'privilege_escalation': {
                'pattern': r'sudo|su root|elevated privileges|runas',
                'threshold': 1,
                'severity': 'CRITICAL',
                'description': 'Privilege escalation attempt detected'
            },
            'file_deletion': {
                'pattern': r'rm -rf|del /f|remove-item|deleted|file removed',
                'threshold': 1,
                'severity': 'MEDIUM',
                'description': 'Suspicious file deletion detected'
            },
            'port_scan': {
                'pattern': r'SYN.*multiple|port scan|scanning detected',
                'threshold': 1,
                'severity': 'HIGH',
                'description': 'Port scanning activity detected'
            },
            'suspicious_network': {
                'pattern': r'connection refused|connection timeout|dropped',
                'threshold': 10,
                'severity': 'MEDIUM',
                'description': 'Suspicious network activity'
            },
            'malware_indicator': {
                'pattern': r'malware|virus|trojan|ransomware|cryptolocker',
                'threshold': 1,
                'severity': 'CRITICAL',
                'description': 'Potential malware activity detected'
            },
            'data_exfiltration': {
                'pattern': r'large file transfer|upload.*GB|exfiltration',
                'threshold': 1,
                'severity': 'CRITICAL',
                'description': 'Possible data exfiltration'
            },
            'after_hours_access': {
                'pattern': r'0[0-5]:\d{2}:\d{2}|login.*2[2-3]:\d{2}',
                'threshold': 1,
                'severity': 'MEDIUM',
                'description': 'Access during unusual hours'
            }
        }
    
    def detect(self, logs):
        """Run threat detection on logs"""
        alerts = []
        ip_attempts = defaultdict(list)
        user_attempts = defaultdict(list)
        
        for log in logs:
            message = log.get('message', '')
            
            # Check each rule
            for rule_name, rule in self.rules.items():
                if re.search(rule['pattern'], message, re.IGNORECASE):
                    # Track by IP and username for brute force detection
                    if rule_name == 'brute_force':
                        ip = log.get('ip_address', 'unknown')
                        user = log.get('username', 'unknown')
                        ip_attempts[ip].append(log)
                        user_attempts[user].append(log)
                        
                        # Only alert if threshold exceeded
                        if len(ip_attempts[ip]) >= rule['threshold']:
                            alerts.append({
                                'id': len(alerts) + 1,
                                'type': rule_name,
                                'severity': rule['severity'],
                                'description': f"{rule['description']} - {len(ip_attempts[ip])} attempts from {ip}",
                                'timestamp': log.get('timestamp'),
                                'source': log.get('source'),
                                'ip_address': ip,
                                'username': user,
                                'details': message,
                                'log_id': log.get('id')
                            })
                    else:
                        alerts.append({
                            'id': len(alerts) + 1,
                            'type': rule_name,
                            'severity': rule['severity'],
                            'description': rule['description'],
                            'timestamp': log.get('timestamp'),
                            'source': log.get('source'),
                            'ip_address': log.get('ip_address', ''),
                            'username': log.get('username', ''),
                            'details': message,
                            'log_id': log.get('id')
                        })
        
        return alerts
    
    def get_statistics(self, alerts):
        """Generate statistics from alerts"""
        severity_count = Counter([a['severity'] for a in alerts])
        type_count = Counter([a['type'] for a in alerts])
        
        return {
            'total_alerts': len(alerts),
            'by_severity': dict(severity_count),
            'by_type': dict(type_count),
            'critical_count': severity_count.get('CRITICAL', 0),
            'high_count': severity_count.get('HIGH', 0),
            'medium_count': severity_count.get('MEDIUM', 0)
        }
    
    def generate_timeline(self, alerts):
        """Generate attack timeline/story"""
        if not alerts:
            return []
        
        # Sort by timestamp
        sorted_alerts = sorted(alerts, key=lambda x: x.get('timestamp', ''))
        
        timeline = []
        
        # Create narrative
        attack_stages = {
            'port_scan': '🔍 Reconnaissance: Attacker scanned the network for vulnerabilities',
            'brute_force': '🔨 Initial Access: Attempted to breach account security',
            'privilege_escalation': '⚠️ Privilege Escalation: Gained elevated system access',
            'file_deletion': '💀 Impact: Attempted to delete critical files',
            'data_exfiltration': '📤 Exfiltration: Attempted to steal data',
            'malware_indicator': '☣️ Malware: Malicious software detected'
        }
        
        for alert in sorted_alerts[:10]:  # Top 10 for timeline
            stage = attack_stages.get(alert['type'], f"⚡ {alert['type'].replace('_', ' ').title()}")
            timeline.append({
                'time': alert.get('timestamp'),
                'stage': stage,
                'description': alert.get('description'),
                'severity': alert.get('severity'),
                'details': alert.get('details', '')[:100]
            })
        
        return timeline