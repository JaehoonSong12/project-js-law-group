from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
from .forms import AutoAccidentWizardForm
from .gmailproxy import GmailProxy
import os
import json
import csv
from datetime import datetime, date

app = Flask(__name__, static_folder='../static', template_folder='../templates')
# Load SECRET_KEY from environment variable, fallback to dev key if not set
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-prod')

@app.route('/', methods=['GET', 'POST'])
def index():
    form = AutoAccidentWizardForm()
    if form.validate_on_submit():
        save_submission(form.data, 'auto_accident_wizard')
        flash('Assessment complete! We are analyzing your case.', 'success')
        return redirect(url_for('index'))
    return render_template('index.html', form=form)

@app.route('/motor-vehicle-accident')
def motor_vehicle_accident():
    """Motor vehicle accident info page (nav: Motor Vehicles)."""
    return render_template('motor_vehicle_accident.html')

@app.route('/personal-injury')
def personal_injury():
    """Personal injury practice areas page (nav: Personal Injury)."""
    return render_template('personal_injury.html')

@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

def save_submission(form_data, form_type):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. Prepare Data
    # Filter out CSRF token and convert objects (like dates) to strings
    data_to_save = {}
    for k, v in form_data.items():
        if k == 'csrf_token':
            continue
        if isinstance(v, (datetime, date)):
            data_to_save[k] = v.isoformat()
        else:
            data_to_save[k] = str(v) if v is not None else ""
    
    # Ensure submissions directory exists
    if not os.path.exists('submissions'):
        os.makedirs('submissions')
        
    base_filename = f"submissions/{form_type}_{timestamp}"
    json_path = f"{base_filename}.json"
    csv_path = f"{base_filename}.csv"
    html_path = f"{base_filename}.html"

    # 2. Save JSON (Attachment)
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data_to_save, f, indent=4, ensure_ascii=False)
        print(f"Saved JSON to {json_path}")
    except Exception as e:
        print(f"Error saving JSON: {e}")

    # 3. Save CSV (Attachment)
    try:
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(data_to_save.keys())
            writer.writerow(data_to_save.values())
        print(f"Saved CSV to {csv_path}")
    except Exception as e:
        print(f"Error saving CSV: {e}")

    # 4. Generate & Save HTML (Email Body)
    html_content = ""
    try:
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ width: 100%; max-width: 600px; margin: 0 auto; }}
                .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #dc3545; }}
                h2 {{ margin: 0; color: #dc3545; }}
                .meta {{ color: #777; font-size: 0.9em; margin-bottom: 20px; text-align: center; }}
                table {{ border-collapse: collapse; width: 100%; margin-top: 20px; }}
                th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #f8f9fa; font-weight: bold; width: 35%; color: #555; }}
                tr:hover {{ background-color: #f1f1f1; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Submission: {form_type.replace('_', ' ').title()}</h2>
                </div>
                <div class="meta">
                    Received on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
                </div>
                <table>
        """
        for key, value in data_to_save.items():
            # Format key for display
            readable_key = key.replace('_', ' ').title()
            html_content += f"<tr><th>{readable_key}</th><td>{value}</td></tr>"

        html_content += """
                </table>
            </div>
        </body>
        </html>
        """
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"Saved HTML to {html_path}")
    except Exception as e:
        print(f"Error saving HTML: {e}")

    # 5. Send Email via GmailProxy
    try:
        email_service = GmailProxy()
        recipients = ["info@jslawgroup.net"]
        
        # Determine Client Name
        client_name = "Unknown Client"
        if 'full_name' in form_data and form_data['full_name']:
             client_name = form_data['full_name']
        elif 'first_name' in form_data and 'last_name' in form_data:
             client_name = f"{form_data.get('first_name', '')} {form_data.get('last_name', '')}".strip()
        
        date_str = datetime.now().strftime("%Y-%m-%d")
        readable_form_type = form_type.replace('_', ' ').title()
        subject = f"[{date_str}] {readable_form_type} - {client_name}"
        
        attachments = [json_path, csv_path]
        
        # Verify attachments exist before sending
        valid_attachments = [p for p in attachments if os.path.exists(p)]
        
        success, error = email_service.send_email(recipients, subject, html_content, valid_attachments)
        if success:
            print(f"Email sent successfully to {recipients}")
        else:
            print(f"Failed to send email: {error}")
    except Exception as e:
        print(f"Error in email sending block: {e}")
