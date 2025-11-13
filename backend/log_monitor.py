"""
Log Monitor - Watches log files for changes and sends to backend
"""

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import os

class LogFileHandler(FileSystemEventHandler):
    def __init__(self, callback):
        self.callback = callback
        self.last_positions = {}
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        if event.src_path.endswith('.log'):
            self.read_new_lines(event.src_path)
    
    def read_new_lines(self, filepath):
        """Read only new lines from file"""
        try:
            # Get last known position
            last_pos = self.last_positions.get(filepath, 0)
            
            with open(filepath, 'r') as f:
                # Seek to last position
                f.seek(last_pos)
                
                # Read new lines
                new_lines = f.readlines()
                
                # Update position
                self.last_positions[filepath] = f.tell()
            
            # Process new lines
            if new_lines:
                filename = os.path.basename(filepath)
                self.callback(new_lines, filename)
        
        except Exception as e:
            print(f"Error reading {filepath}: {e}")


class LogMonitor:
    def __init__(self, log_dir, callback):
        self.log_dir = log_dir
        self.callback = callback
        self.observer = Observer()
        self.handler = LogFileHandler(callback)
    
    def start(self):
        """Start monitoring log directory"""
        self.observer.schedule(self.handler, self.log_dir, recursive=False)
        self.observer.start()
        print(f"👁️  Monitoring: {os.path.abspath(self.log_dir)}")
    
    def stop(self):
        """Stop monitoring"""
        self.observer.stop()
        self.observer.join()


if __name__ == '__main__':
    def print_callback(lines, filename):
        print(f"\n[{filename}] New lines: {len(lines)}")
        for line in lines:
            print(f"  {line.strip()}")
    
    monitor = LogMonitor('../log/logs', print_callback)
    monitor.start()
    
    try:
        print("Monitoring logs... Press Ctrl+C to stop")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        monitor.stop()
        print("\nMonitoring stopped")