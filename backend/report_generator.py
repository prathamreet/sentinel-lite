from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime
import os

class ReportGenerator:
    def __init__(self):
        self.output_dir = '../database/reports'
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_pdf(self, logs, alerts):
        """Generate PDF report"""
        filename = f"LogWatch_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e3a8a'),
            spaceAfter=30
        )
        story.append(Paragraph(" LogWatch Sentinel - Security Analysis Report", title_style))
        story.append(Spacer(1, 12))
        
        # Summary
        story.append(Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        story.append(Paragraph(f"<b>Total Logs Analyzed:</b> {len(logs)}", styles['Normal']))
        story.append(Paragraph(f"<b>Threats Detected:</b> {len(alerts)}", styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Severity Summary
        critical = len([a for a in alerts if a['severity'] == 'CRITICAL'])
        high = len([a for a in alerts if a['severity'] == 'HIGH'])
        medium = len([a for a in alerts if a['severity'] == 'MEDIUM'])
        
        severity_data = [
            ['Severity Level', 'Count'],
            ['CRITICAL', str(critical)],
            ['HIGH', str(high)],
            ['MEDIUM', str(medium)]
        ]
        
        severity_table = Table(severity_data)
        severity_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(severity_table)
        story.append(Spacer(1, 20))
        
        # Top Alerts
        story.append(Paragraph("<b>Top Security Alerts</b>", styles['Heading2']))
        story.append(Spacer(1, 12))
        
        for i, alert in enumerate(alerts[:10], 1):
            alert_text = f"<b>{i}. [{alert['severity']}]</b> {alert['description']}<br/>"
            alert_text += f"   Time: {alert['timestamp']} | Source: {alert.get('source', 'N/A')}"
            story.append(Paragraph(alert_text, styles['Normal']))
            story.append(Spacer(1, 8))
        
        # Build PDF
        doc.build(story)
        return filepath