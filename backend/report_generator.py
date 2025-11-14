from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_RIGHT
from datetime import datetime
from collections import Counter
import os


class ReportGenerator:
    def __init__(self):
        self.output_dir = '../database/reports'
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_pdf(self, logs, alerts):
        """Generate comprehensive PDF security report"""
        filename = f"Sentinel_Security_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(
            filepath, 
            pagesize=letter,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )
        story = []
        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#1e293b'),
            spaceAfter=10,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        subtitle_style = ParagraphStyle(
            'SubTitle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#475569'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading2_style = ParagraphStyle(
            'CustomHeading2',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e293b'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold',
            borderWidth=1,
            borderColor=colors.HexColor('#cbd5e1'),
            borderPadding=5,
            backColor=colors.HexColor('#f1f5f9')
        )
        
        body_style = ParagraphStyle(
            'BodyText',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#334155'),
            alignment=TA_JUSTIFY,
            spaceAfter=8
        )
        
        # ==================== COVER PAGE ====================
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("SENTINEL-LM", title_style))
        story.append(Paragraph("Security Analysis & Threat Intelligence Report", subtitle_style))
        
        story.append(Spacer(1, 0.5*inch))
        story.append(Paragraph(f"<b>Report Classification:</b> CONFIDENTIAL", body_style))
        story.append(Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%B %d, %Y at %H:%M:%S UTC')}", body_style))
        story.append(Paragraph(f"<b>Report ID:</b> SLM-{datetime.now().strftime('%Y%m%d%H%M%S')}", body_style))
        story.append(Paragraph(f"<b>Analysis Period:</b> Real-time monitoring session", body_style))
        
        story.append(PageBreak())
        
        # ==================== EXECUTIVE SUMMARY ====================
        story.append(Paragraph("1. EXECUTIVE SUMMARY", heading2_style))
        
        critical_count = len([a for a in alerts if a['severity'] == 'CRITICAL'])
        high_count = len([a for a in alerts if a['severity'] == 'HIGH'])
        medium_count = len([a for a in alerts if a['severity'] == 'MEDIUM'])
        
        # Risk Level Calculation
        risk_score = (critical_count * 10) + (high_count * 5) + (medium_count * 2)
        if risk_score > 50:
            risk_level = "CRITICAL"
            risk_color = colors.HexColor('#dc2626')
        elif risk_score > 25:
            risk_level = "HIGH"
            risk_color = colors.HexColor('#f97316')
        elif risk_score > 10:
            risk_level = "MEDIUM"
            risk_color = colors.HexColor('#3b82f6')
        else:
            risk_level = "LOW"
            risk_color = colors.HexColor('#10b981')
        
        summary_text = f"""
        This report presents a comprehensive security analysis conducted by Sentinel-LM, 
        an advanced real-time log monitoring and threat detection system. During the analysis period, 
        the system processed <b>{len(logs):,}</b> log entries and identified <b>{len(alerts)}</b> security events 
        requiring attention.
        <br/><br/>
        <b>Overall Risk Assessment: <font color="{risk_color.hexval()}">{risk_level}</font></b> (Risk Score: {risk_score})
        <br/><br/>
        The threat landscape analysis reveals {critical_count} critical threats, {high_count} high-severity 
        incidents, and {medium_count} medium-priority events. Immediate action is recommended for all 
        critical and high-severity alerts to prevent potential system compromise.
        """
        story.append(Paragraph(summary_text, body_style))
        story.append(Spacer(1, 20))
        
        # ==================== KEY FINDINGS ====================
        story.append(Paragraph("2. KEY FINDINGS & METRICS", heading2_style))
        
        findings_data = [
            ['Metric', 'Value', 'Status'],
            ['Total Logs Analyzed', f'{len(logs):,}', 'Baseline'],
            ['Security Events Detected', f'{len(alerts)}', 'Active Threats'],
            ['Critical Severity Alerts', f'{critical_count}', 'IMMEDIATE ACTION'],
            ['High Severity Alerts', f'{high_count}', 'URGENT'],
            ['Medium Severity Alerts', f'{medium_count}', 'MONITOR'],
            ['Overall Risk Score', f'{risk_score}', risk_level],
        ]
        
        findings_table = Table(findings_data, colWidths=[3*inch, 1.5*inch, 2*inch])
        findings_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
        ]))
        story.append(findings_table)
        story.append(Spacer(1, 20))
        
        # ==================== THREAT ANALYSIS ====================
        story.append(Paragraph("3. THREAT LANDSCAPE ANALYSIS", heading2_style))
        
        # Attack Type Distribution
        attack_types = Counter([alert.get('type', 'Unknown') for alert in alerts])
        if attack_types:
            story.append(Paragraph("<b>3.1 Attack Vector Distribution</b>", styles['Heading3']))
            
            attack_data = [['Attack Type', 'Occurrences', 'Percentage', 'Risk Level']]
            total_attacks = sum(attack_types.values())
            
            for attack_type, count in attack_types.most_common():
                percentage = (count / total_attacks) * 100
                attack_name = attack_type.replace('_', ' ').title()
                
                # Determine risk level based on attack type
                if 'brute_force' in attack_type.lower() or 'sql_injection' in attack_type.lower():
                    risk = 'CRITICAL'
                elif 'escalation' in attack_type.lower() or 'exfiltration' in attack_type.lower():
                    risk = 'HIGH'
                else:
                    risk = 'MEDIUM'
                
                attack_data.append([attack_name, str(count), f'{percentage:.1f}%', risk])
            
            attack_table = Table(attack_data, colWidths=[2.5*inch, 1.2*inch, 1.2*inch, 1.5*inch])
            attack_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
            ]))
            story.append(attack_table)
            story.append(Spacer(1, 15))
        
        # ==================== SOURCE ANALYSIS ====================
        story.append(Paragraph("<b>3.2 Attack Source Analysis</b>", styles['Heading3']))
        
        sources = Counter([alert.get('source', 'Unknown') for alert in alerts])
        ip_addresses = Counter([alert.get('ip_address', 'N/A') for alert in alerts if alert.get('ip_address')])
        
        source_text = f"""
        Analysis of attack origins reveals activity from <b>{len(sources)}</b> distinct log sources 
        and <b>{len(ip_addresses)}</b> unique IP addresses. The primary attack vectors originate from 
        {sources.most_common(1)[0][0] if sources else 'various sources'}.
        """
        story.append(Paragraph(source_text, body_style))
        story.append(Spacer(1, 15))
        
        # Top IPs table
        if ip_addresses:
            ip_data = [['IP Address', 'Incident Count', 'Threat Level']]
            for ip, count in ip_addresses.most_common(10):
                if ip != 'N/A':
                    threat_level = 'CRITICAL' if count >= 5 else 'HIGH' if count >= 3 else 'MEDIUM'
                    ip_data.append([ip, str(count), threat_level])
            
            if len(ip_data) > 1:
                ip_table = Table(ip_data, colWidths=[3*inch, 1.5*inch, 1.5*inch])
                ip_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
                ]))
                story.append(ip_table)
        
        story.append(PageBreak())
        
        # ==================== DETAILED ALERTS ====================
        story.append(Paragraph("4. DETAILED SECURITY INCIDENTS", heading2_style))
        
        # Group alerts by severity
        critical_alerts = [a for a in alerts if a['severity'] == 'CRITICAL']
        high_alerts = [a for a in alerts if a['severity'] == 'HIGH']
        medium_alerts = [a for a in alerts if a['severity'] == 'MEDIUM']
        
        # Critical Alerts
        if critical_alerts:
            story.append(Paragraph(f"<b>4.1 CRITICAL SEVERITY INCIDENTS ({len(critical_alerts)})</b>", styles['Heading3']))
            for i, alert in enumerate(critical_alerts[:15], 1):
                alert_box = [
                    ['Field', 'Value'],
                    ['Incident #', f'CRIT-{i:03d}'],
                    ['Type', alert.get('type', 'Unknown').replace('_', ' ').title()],
                    ['Description', alert.get('description', 'N/A')],
                    ['Timestamp', alert.get('timestamp', 'N/A')],
                    ['Source', alert.get('source', 'N/A')],
                    ['IP Address', alert.get('ip_address', 'N/A')],
                    ['Username', alert.get('username', 'N/A')],
                ]
                
                alert_table = Table(alert_box, colWidths=[1.5*inch, 5*inch])
                alert_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#fee2e2')),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(alert_table)
                story.append(Spacer(1, 10))
        
        # High Alerts
        if high_alerts:
            story.append(Paragraph(f"<b>4.2 HIGH SEVERITY INCIDENTS ({len(high_alerts)})</b>", styles['Heading3']))
            for i, alert in enumerate(high_alerts[:10], 1):
                alert_summary = f"<b>HIGH-{i:03d}:</b> [{alert.get('type', 'Unknown').replace('_', ' ').title()}] {alert.get('description', 'N/A')} | {alert.get('timestamp', 'N/A')}"
                story.append(Paragraph(alert_summary, body_style))
                story.append(Spacer(1, 5))
        
        story.append(PageBreak())
        
        # ==================== RECOMMENDATIONS ====================
        story.append(Paragraph("5. RECOMMENDATIONS & MITIGATION STRATEGIES", heading2_style))
        
        recommendations = [
            "<b>Immediate Actions (0-24 hours):</b>",
            "• Investigate and contain all CRITICAL severity incidents immediately",
            "• Block or monitor suspicious IP addresses identified in the report",
            "• Reset credentials for all compromised user accounts",
            "• Apply emergency security patches if vulnerabilities are detected",
            "",
            "<b>Short-term Actions (1-7 days):</b>",
            "• Conduct thorough forensic analysis of all high-severity incidents",
            "• Implement additional logging for affected systems",
            "• Update firewall rules and intrusion detection signatures",
            "• Enhance monitoring for identified attack patterns",
            "",
            "<b>Long-term Security Improvements (1-3 months):</b>",
            "• Implement multi-factor authentication across all systems",
            "• Conduct security awareness training for all personnel",
            "• Perform comprehensive security audit and penetration testing",
            "• Review and update incident response procedures",
            "• Consider implementing additional security controls (WAF, SIEM, EDR)",
        ]
        
        for rec in recommendations:
            story.append(Paragraph(rec, body_style))
        
        story.append(Spacer(1, 20))
        
        # ==================== APPENDIX ====================
        story.append(Paragraph("6. TECHNICAL APPENDIX", heading2_style))
        
        story.append(Paragraph("<b>6.1 Methodology</b>", styles['Heading3']))
        methodology = """
        This report was generated using Sentinel-LM's real-time log monitoring and threat detection engine. 
        The system employs rule-based detection algorithms, pattern matching, and behavioral analysis to 
        identify security threats. All timestamps are in UTC unless otherwise specified.
        """
        story.append(Paragraph(methodology, body_style))
        
        story.append(Spacer(1, 15))
        story.append(Paragraph("<b>6.2 Glossary</b>", styles['Heading3']))
        glossary = [
            "<b>CRITICAL:</b> Incidents requiring immediate response; active exploitation or system compromise",
            "<b>HIGH:</b> Serious threats with high potential for damage; requires urgent investigation",
            "<b>MEDIUM:</b> Suspicious activities requiring monitoring and analysis",
            "<b>Brute Force:</b> Repeated authentication attempts to gain unauthorized access",
            "<b>SQL Injection:</b> Database manipulation attempts through malicious SQL queries",
            "<b>Privilege Escalation:</b> Attempts to gain elevated system privileges",
        ]
        for term in glossary:
            story.append(Paragraph(term, body_style))
        
        # ==================== FOOTER ====================
        story.append(Spacer(1, 40))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#64748b'),
            alignment=TA_CENTER
        )
        story.append(Paragraph("--- END OF REPORT ---", footer_style))
        story.append(Paragraph("This document contains sensitive security information. Handle according to your organization's data classification policy.", footer_style))
        
        # Build PDF
        doc.build(story)
        return filepath
