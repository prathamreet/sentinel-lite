"""
Mock Server - Enhanced for Demonstration
Generates realistic system logs with FREQUENT attack patterns
Optimized to show CRITICAL, HIGH, and MEDIUM alerts quickly
"""

import random
import time
import threading
from datetime import datetime
import os

class MockServer:
    def __init__(self, log_dir='logs'):
        self.log_dir = log_dir
        os.makedirs(log_dir, exist_ok=True)
        
        self.auth_log = os.path.join(log_dir, 'auth.log')
        self.apache_log = os.path.join(log_dir, 'apache.log')
        self.windows_log = os.path.join(log_dir, 'windows.log')
        
        # Attack simulation state
        self.attack_active = False
        self.attack_stage = 0
        self.attack_counter = 0
        
        # IP pools
        self.normal_ips = ['192.168.1.' + str(i) for i in range(10, 50)]
        self.attacker_ips = [
            '203.0.113.66',   # Primary attacker
            '198.51.100.42',  # Secondary attacker
            '192.0.2.123',    # Botnet node
            '185.220.101.50'  # TOR exit node
        ]
        self.internal_ips = ['10.0.0.' + str(i) for i in range(100, 120)]
        
        # Usernames
        self.normal_users = ['john', 'alice', 'bob', 'sarah', 'mike', 'emma']
        self.admin_users = ['admin', 'root', 'administrator', 'sysadmin']
        
        # Attack pattern counters
        self.brute_force_count = 0
        self.sql_injection_count = 0
        self.port_scan_count = 0
    
    def write_log(self, filepath, message):
        """Append log message to file"""
        with open(filepath, 'a') as f:
            f.write(message + '\n')
        print(f"[LOG] {message[:100]}")
    
    # ==================== NORMAL ACTIVITY ====================
    
    def generate_normal_auth_logs(self):
        """Generate normal authentication logs"""
        timestamp = datetime.now().strftime('%b %d %H:%M:%S')
        user = random.choice(self.normal_users)
        ip = random.choice(self.normal_ips)
        
        events = [
            f"{timestamp} server1 sshd[{random.randint(10000, 99999)}]: Accepted password for {user} from {ip} port 22 ssh2",
            f"{timestamp} server1 sshd[{random.randint(10000, 99999)}]: session opened for user {user}",
            f"{timestamp} server2 su: {user} on pts/0",
        ]
        
        log = random.choice(events)
        self.write_log(self.auth_log, log)
    
    def generate_normal_web_logs(self):
        """Generate normal Apache access logs"""
        timestamp = datetime.now().strftime('%d/%b/%Y:%H:%M:%S +0000')
        ip = random.choice(self.normal_ips)
        
        pages = ['/index.html', '/about.php', '/contact.php', '/api/users', '/dashboard', '/products']
        methods = ['GET', 'POST']
        
        method = random.choice(methods)
        page = random.choice(pages)
        status = random.choice([200, 200, 200, 304])
        size = random.randint(500, 5000)
        
        log = f'{ip} - - [{timestamp}] "{method} {page} HTTP/1.1" {status} {size}'
        self.write_log(self.apache_log, log)
    
    def generate_normal_windows_logs(self):
        """Generate normal Windows event logs"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user = random.choice(self.normal_users)
        
        events = [
            f"{timestamp} INFO User login successful for user: {user}",
            f"{timestamp} INFO Application started: Microsoft Office",
            f"{timestamp} INFO System checkpoint created",
        ]
        
        log = random.choice(events)
        self.write_log(self.windows_log, log)
    
    # ==================== CRITICAL SEVERITY ATTACKS ====================
    
    def attack_ransomware(self):
        """CRITICAL: Ransomware activity"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        files = ['documents.docx', 'financial.xlsx', 'database.sql', 'backup.zip', 'customer_data.csv']
        
        print("\n💀 CRITICAL: RANSOMWARE ATTACK")
        for i in range(random.randint(3, 6)):
            file = random.choice(files)
            logs = [
                f"{timestamp} CRITICAL File encrypted: C:\\Users\\Documents\\{file}.locked",
                f"{timestamp} CRITICAL Ransomware signature detected: CRYPTOLOCKER variant",
                f"{timestamp} CRITICAL Multiple files being encrypted simultaneously",
            ]
            for log in logs:
                self.write_log(self.windows_log, log)
                time.sleep(0.3)
        
        time.sleep(0.5)
    
    def attack_data_exfiltration(self):
        """CRITICAL: Data exfiltration attempt"""
        timestamp = datetime.now().strftime('%d/%b/%Y:%H:%M:%S +0000')
        attacker_ip = random.choice(self.attacker_ips)
        
        print("\n💀 CRITICAL: DATA EXFILTRATION")
        logs = [
            f'{attacker_ip} - - [{timestamp}] "POST /api/download?file=database_backup.sql HTTP/1.1" 200 524288000',
            f'{attacker_ip} - - [{timestamp}] "POST /api/download?file=customers.csv HTTP/1.1" 200 157286400',
            f'{attacker_ip} - - [{timestamp}] "POST /api/download?file=financial_records.zip HTTP/1.1" 200 314572800',
        ]
        
        for log in logs:
            self.write_log(self.apache_log, log)
            time.sleep(0.5)
    
    def attack_privilege_escalation(self):
        """CRITICAL: Privilege escalation"""
        timestamp = datetime.now().strftime('%b %d %H:%M:%S')
        user = random.choice(['webuser', 'guest', 'backup'])
        
        print("\n💀 CRITICAL: PRIVILEGE ESCALATION")
        logs = [
            f"{timestamp} server1 sudo: {user} : TTY=pts/0 ; PWD=/tmp ; USER=root ; COMMAND=/bin/bash",
            f"{timestamp} server1 sudo: {user} : session opened for user root",
            f"{timestamp} server1 kernel: elevated privileges granted to {user}",
        ]
        
        for log in logs:
            self.write_log(self.auth_log, log)
            time.sleep(0.4)
    
    def attack_system_compromise(self):
        """CRITICAL: Full system compromise"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        print("\n💀 CRITICAL: SYSTEM COMPROMISE")
        logs = [
            f"{timestamp} CRITICAL Backdoor detected: /tmp/.hidden/shell.sh",
            f"{timestamp} CRITICAL Unauthorized root access detected",
            f"{timestamp} CRITICAL System integrity check failed",
            f"{timestamp} CRITICAL Malicious process detected: mining.exe",
        ]
        
        for log in logs:
            self.write_log(self.windows_log, log)
            time.sleep(0.4)
    
    # ==================== HIGH SEVERITY ATTACKS ====================
    
    def attack_brute_force(self):
        """HIGH: SSH brute force attack"""
        timestamp = datetime.now().strftime('%b %d %H:%M:%S')
        target_user = random.choice(self.admin_users)
        attacker_ip = random.choice(self.attacker_ips)
        
        # Generate 6-12 failed attempts
        attempts = random.randint(6, 12)
        
        print(f"\n⚠️ HIGH: BRUTE FORCE ATTACK ({attempts} attempts)")
        for i in range(attempts):
            log = f"{timestamp} server1 sshd[{random.randint(10000, 99999)}]: Failed password for {target_user} from {attacker_ip} port 22 ssh2"
            self.write_log(self.auth_log, log)
            time.sleep(0.2)
        
        self.brute_force_count += 1
        
        # Sometimes succeed to show full attack chain
        if self.brute_force_count % 3 == 0:
            time.sleep(0.5)
            log = f"{timestamp} server1 sshd[{random.randint(10000, 99999)}]: Accepted password for {target_user} from {attacker_ip} port 22 ssh2"
            self.write_log(self.auth_log, log)
            print("    ✓ Brute force SUCCEEDED")
            return True
        
        return False
    
    def attack_sql_injection(self):
        """HIGH: SQL injection attempts"""
        timestamp = datetime.now().strftime('%d/%b/%Y:%H:%M:%S +0000')
        attacker_ip = random.choice(self.attacker_ips)
        
        print("\n⚠️ HIGH: SQL INJECTION ATTACK")
        payloads = [
            "' OR '1'='1",
            "admin'--",
            "1; DROP TABLE users--",
            "' UNION SELECT * FROM passwords--",
            "1' AND 1=1--",
        ]
        
        for payload in payloads:
            log = f'{attacker_ip} - - [{timestamp}] "GET /login.php?user={payload} HTTP/1.1" 403 1234'
            self.write_log(self.apache_log, log)
            time.sleep(0.3)
        
        self.sql_injection_count += 1
    
    def attack_log_tampering(self):
        """HIGH: Log tampering/deletion"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        print("\n⚠️ HIGH: LOG TAMPERING")
        logs = [
            f"{timestamp} WARNING File deletion detected: /var/log/auth.log",
            f"{timestamp} WARNING File deletion detected: /var/log/apache2/access.log",
            f"{timestamp} ERROR Log file modified: /var/log/syslog",
            f"{timestamp} ERROR Event log cleared by administrator",
        ]
        
        for log in logs:
            self.write_log(self.windows_log, log)
            time.sleep(0.4)
    
    def attack_suspicious_commands(self):
        """HIGH: Suspicious system commands"""
        timestamp = datetime.now().strftime('%b %d %H:%M:%S')
        
        print("\n⚠️ HIGH: SUSPICIOUS COMMANDS")
        commands = [
            "sudo rm -rf /var/log/*",
            "sudo cat /etc/shadow",
            "sudo chmod 777 /etc/passwd",
            "sudo useradd -m backdoor",
        ]
        
        for cmd in commands:
            log = f"{timestamp} server1 bash: {cmd}"
            self.write_log(self.auth_log, log)
            time.sleep(0.4)
    
    # ==================== MEDIUM SEVERITY ATTACKS ====================
    
    def attack_port_scan(self):
        """MEDIUM: Port scanning activity"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        attacker_ip = random.choice(self.attacker_ips)
        
        print("\n📊 MEDIUM: PORT SCAN")
        ports = [22, 23, 80, 443, 3306, 8080, 3389, 5432, 27017, 6379]
        
        for port in random.sample(ports, random.randint(5, 8)):
            log = f"{timestamp} WARNING Connection attempt from {attacker_ip} on port {port} - SYN scan detected"
            self.write_log(self.windows_log, log)
            time.sleep(0.2)
        
        self.port_scan_count += 1
    
    def attack_after_hours_access(self):
        """MEDIUM: Suspicious after-hours access"""
        # Fake timestamp for 2-5 AM
        hour = random.randint(2, 5)
        minute = random.randint(0, 59)
        fake_time = datetime.now().replace(hour=hour, minute=minute)
        timestamp = fake_time.strftime('%b %d %H:%M:%S')
        
        user = random.choice(self.admin_users)
        ip = random.choice(self.attacker_ips)
        
        print(f"\n📊 MEDIUM: AFTER-HOURS ACCESS ({hour:02d}:{minute:02d})")
        log = f"{timestamp} server1 sshd[{random.randint(10000, 99999)}]: Accepted password for {user} from {ip} port 22 ssh2"
        self.write_log(self.auth_log, log)
    
    def attack_failed_sudo(self):
        """MEDIUM: Failed sudo attempts"""
        timestamp = datetime.now().strftime('%b %d %H:%M:%S')
        user = random.choice(self.normal_users)
        
        print("\n📊 MEDIUM: FAILED SUDO ATTEMPTS")
        for i in range(random.randint(3, 5)):
            log = f"{timestamp} server1 sudo: {user} : user NOT in sudoers ; TTY=pts/0 ; PWD=/home/{user} ; USER=root ; COMMAND=/bin/bash"
            self.write_log(self.auth_log, log)
            time.sleep(0.3)
    
    def attack_suspicious_network(self):
        """MEDIUM: Suspicious network connections"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        attacker_ip = random.choice(self.attacker_ips)
        
        print("\n📊 MEDIUM: SUSPICIOUS NETWORK ACTIVITY")
        logs = [
            f"{timestamp} WARNING Unusual outbound connection to {attacker_ip}:4444",
            f"{timestamp} WARNING Multiple connection timeouts detected",
            f"{timestamp} WARNING DNS query to suspicious domain: malware-c2.ru",
        ]
        
        for log in logs:
            self.write_log(self.windows_log, log)
            time.sleep(0.3)
    
    # ==================== DEMO MODE SCENARIOS ====================
    
    def demo_showcase_all_severities(self):
        """Quick demo showing all severity levels"""
        print("\n" + "="*70)
        print("🎬 DEMO MODE: SHOWCASE ALL SEVERITY LEVELS")
        print("="*70 + "\n")
        
        # Medium Severity Wave
        print("\n📊 === MEDIUM SEVERITY ATTACKS ===")
        self.attack_port_scan()
        time.sleep(2)
        self.attack_after_hours_access()
        time.sleep(2)
        self.attack_failed_sudo()
        time.sleep(2)
        self.attack_suspicious_network()
        time.sleep(3)
        
        # High Severity Wave
        print("\n⚠️ === HIGH SEVERITY ATTACKS ===")
        self.attack_brute_force()
        time.sleep(2)
        self.attack_sql_injection()
        time.sleep(2)
        self.attack_suspicious_commands()
        time.sleep(2)
        self.attack_log_tampering()
        time.sleep(3)
        
        # Critical Severity Wave
        print("\n💀 === CRITICAL SEVERITY ATTACKS ===")
        self.attack_privilege_escalation()
        time.sleep(2)
        self.attack_system_compromise()
        time.sleep(2)
        self.attack_data_exfiltration()
        time.sleep(2)
        self.attack_ransomware()
        
        print("\n" + "="*70)
        print("✅ DEMO COMPLETE - ALL SEVERITIES DEMONSTRATED")
        print("="*70 + "\n")
    
    def demo_realistic_apt_attack(self):
        """Realistic Advanced Persistent Threat scenario"""
        print("\n" + "="*70)
        print("🎯 REALISTIC APT ATTACK SCENARIO")
        print("="*70 + "\n")
        
        # Stage 1: Reconnaissance (MEDIUM)
        print("📡 Stage 1: Reconnaissance")
        self.attack_port_scan()
        time.sleep(3)
        
        # Stage 2: Initial Access Attempt (HIGH)
        print("\n🔨 Stage 2: Initial Access")
        success = self.attack_brute_force()
        time.sleep(3)
        
        if success:
            # Stage 3: Privilege Escalation (CRITICAL)
            print("\n⚠️ Stage 3: Privilege Escalation")
            self.attack_privilege_escalation()
            time.sleep(3)
            
            # Stage 4: Defense Evasion (HIGH)
            print("\n👻 Stage 4: Defense Evasion")
            self.attack_log_tampering()
            time.sleep(3)
            
            # Stage 5: Lateral Movement (MEDIUM)
            print("\n🔄 Stage 5: Lateral Movement")
            self.attack_suspicious_network()
            time.sleep(3)
            
            # Stage 6: Data Collection (CRITICAL)
            print("\n📤 Stage 6: Data Exfiltration")
            self.attack_data_exfiltration()
            time.sleep(3)
            
            # Stage 7: Impact (CRITICAL)
            print("\n💀 Stage 7: Impact - Ransomware")
            self.attack_ransomware()
        
        print("\n" + "="*70)
        print("✅ APT SCENARIO COMPLETE")
        print("="*70 + "\n")
    
    def demo_rapid_fire_attacks(self):
        """Rapid-fire attacks for impressive demo"""
        print("\n🔥 RAPID FIRE MODE - Multiple concurrent attacks\n")
        
        attacks = [
            self.attack_port_scan,
            self.attack_brute_force,
            self.attack_sql_injection,
            self.attack_after_hours_access,
            self.attack_failed_sudo,
            self.attack_privilege_escalation,
            self.attack_log_tampering,
            self.attack_system_compromise,
        ]
        
        for attack in attacks:
            attack()
            time.sleep(1.5)  # Quick succession
    
    # ==================== CONTINUOUS OPERATION MODES ====================
    
    def run_normal_operations(self):
        """Generate normal logs continuously"""
        while True:
            time.sleep(random.uniform(2, 5))
            
            activity_type = random.choice(['auth', 'web', 'windows'])
            
            if activity_type == 'auth':
                self.generate_normal_auth_logs()
            elif activity_type == 'web':
                self.generate_normal_web_logs()
            else:
                self.generate_normal_windows_logs()
    
    def run_frequent_attacks(self):
        """Continuous attacks with high frequency (DEMO OPTIMIZED)"""
        time.sleep(5)  # Initial delay
        
        attack_methods = {
            'CRITICAL': [
                self.attack_ransomware,
                self.attack_data_exfiltration,
                self.attack_privilege_escalation,
                self.attack_system_compromise,
            ],
            'HIGH': [
                self.attack_brute_force,
                self.attack_sql_injection,
                self.attack_log_tampering,
                self.attack_suspicious_commands,
            ],
            'MEDIUM': [
                self.attack_port_scan,
                self.attack_after_hours_access,
                self.attack_failed_sudo,
                self.attack_suspicious_network,
            ]
        }
        
        while True:
            # Random severity with weighted distribution
            # 20% CRITICAL, 40% HIGH, 40% MEDIUM
            severity = random.choices(
                ['CRITICAL', 'HIGH', 'MEDIUM'],
                weights=[20, 40, 40],
                k=1
            )[0]
            
            attack = random.choice(attack_methods[severity])
            attack()
            
            # Short delay between attacks (10-20 seconds)
            delay = random.randint(10, 20)
            print(f"\n⏰ Next attack in {delay} seconds...\n")
            time.sleep(delay)
    
    def start(self, mode='demo'):
        """Start the mock server"""
        # Clear old logs
        for log_file in [self.auth_log, self.apache_log, self.windows_log]:
            with open(log_file, 'w') as f:
                f.write(f"# LogWatch Sentinel - Mock Server Started at {datetime.now()}\n")
        
        print("\n" + "="*70)
        print("LOGWATCH SENTINEL - MOCK SERVER")
        print("="*70)
        print(f"Log Directory: {os.path.abspath(self.log_dir)}")
        print(f"Generating logs: auth.log, apache.log, windows.log")
        print("="*70 + "\n")
        
        if mode == 'demo':
            print("\nDEMO MODE: Showcasing all attack types\n")
            self.demo_showcase_all_severities()
            print("\n🔄 Switching to continuous attack mode...\n")
            
            # After showcase, run continuous attacks
            normal_thread = threading.Thread(target=self.run_normal_operations, daemon=True)
            normal_thread.start()
            self.run_frequent_attacks()
        
        elif mode == 'rapid':
            print("\n🔥 RAPID FIRE MODE: Fast-paced attacks\n")
            
            # Background normal traffic
            normal_thread = threading.Thread(target=self.run_normal_operations, daemon=True)
            normal_thread.start()
            
            # Foreground rapid attacks
            while True:
                self.demo_rapid_fire_attacks()
                time.sleep(30)
        
        elif mode == 'apt':
            print("\n🎯 APT MODE: Realistic attack scenario\n")
            
            normal_thread = threading.Thread(target=self.run_normal_operations, daemon=True)
            normal_thread.start()
            
            while True:
                self.demo_realistic_apt_attack()
                time.sleep(60)
                print("\n⏰ Starting new APT scenario...\n")
        
        elif mode == 'continuous':
            print("\n🔄 CONTINUOUS MODE: Frequent mixed attacks\n")
            
            normal_thread = threading.Thread(target=self.run_normal_operations, daemon=True)
            normal_thread.start()
            
            self.run_frequent_attacks()
        
        elif mode == 'normal':
            print("\n✅ NORMAL MODE: Only legitimate traffic\n")
            self.run_normal_operations()


if __name__ == '__main__':
    import sys
    
    mode = sys.argv[1] if len(sys.argv) > 1 else 'demo'
    
    print("""
    ================================================================
    =          LogWatch Sentinel - Mock Server                    =
    ================================================================
    
    Available Modes:
    
      python mockserver.py demo        - Showcase ALL severities then continuous
                                         (BEST FOR PRESENTATIONS)
      
      python mockserver.py rapid       - Rapid-fire attacks every 1-2 seconds
                                         (MOST IMPRESSIVE FOR JUDGES)
      
      python mockserver.py apt         - Realistic APT attack scenario
                                         (SHOWS ATTACK PROGRESSION)
      
      python mockserver.py continuous  - Mixed attacks every 10-20 seconds
                                         (BALANCED DEMO)
      
      python mockserver.py normal      - Only normal operations (no attacks)
    
    Severity Distribution:
      CRITICAL: Ransomware, Data Theft, Root Access, System Compromise
      HIGH:     Brute Force, SQL Injection, Log Tampering, Suspicious Commands
      MEDIUM:   Port Scans, After-Hours Access, Failed Sudo, Network Anomalies
    
    Press Ctrl+C to stop
    """)
    
    server = MockServer()
    
    try:
        server.start(mode=mode)
    except KeyboardInterrupt:
        print("\n\nMock Server Stopped")
        print("="*70)