from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
from core.forms import GeneralContactForm, PersonalInjuryForm, CriminalCaseForm
from core.gmailproxy import GmailProxy
import os
import json
import csv
from datetime import datetime, date

app = Flask(__name__, static_folder='../static', template_folder='../templates')
# Load SECRET_KEY from environment variable, fallback to dev key if not set
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-prod')

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home', methods=['GET', 'POST'])
def home():
    form = GeneralContactForm()
    if form.validate_on_submit():
        save_submission(form.data, 'general_contact')
        flash('Thank you for your inquiry. We will contact you shortly.', 'success')
        return redirect(url_for('home'))
    elif form.errors:
        print("Form errors:", form.errors)
        flash('There was an error with your submission. Please check the form.', 'danger')
        
    return render_template('index_home.html', form=form)

@app.route('/247/demo1', methods=['GET', 'POST'])
def demo1():
    form = PersonalInjuryForm()
    if form.validate_on_submit():
        save_submission(form.data, 'personal_injury')
        flash('Case evaluation request submitted. We will review it immediately.', 'success')
        return redirect(url_for('demo1'))
    elif form.errors:
        print("Form errors:", form.errors)
        flash('There was an error with your submission. Please check the form.', 'danger')

    return render_template('index247_demo1.html', form=form)

@app.route('/247/demo2', methods=['GET', 'POST'])
def demo2():
    form = CriminalCaseForm()
    if form.validate_on_submit():
        save_submission(form.data, 'criminal_defense')
        flash('Criminal case intake submitted. We are reviewing your details.', 'success')
        return redirect(url_for('demo2'))
    elif form.errors:
        print("Form errors:", form.errors)
        flash('There was an error with your submission. Please check the form.', 'danger')

    return render_template('index247_demo2.html', form=form)

# ==========================================
# New Final Website Routes
# ==========================================

@app.route('/final')
def final():
    return render_template('final.html')

@app.route('/final/about')
def final_about():
    return render_template('final-about.html')

@app.route('/final/accident')
def final_accident():
    return render_template('final-accident.html')

@app.route('/final/personal-injury')
def final_personal_injury():
    return render_template('final-personal_injury.html')

@app.route('/final/criminal')
def final_criminal():
    return render_template('final-criminal.html')

@app.route('/final/contact')
def final_contact():
    return render_template('final-contact.html')

# ==========================================
# Form Fragment Routes (for Iframe)
# ==========================================

@app.route('/form/general', methods=['GET', 'POST'])
def form_general():
    form = GeneralContactForm()
    if form.validate_on_submit():
        save_submission(form.data, 'general_contact')
        flash('Message sent! We will contact you soon.', 'success')
        return redirect(url_for('form_general'))
    return render_template('form_general.html', form=form)

@app.route('/form/pi', methods=['GET', 'POST'])
def form_pi():
    form = PersonalInjuryForm()
    if form.validate_on_submit():
        save_submission(form.data, 'personal_injury')
        flash('Request submitted! Reviewing now.', 'success')
        return redirect(url_for('form_pi'))
    return render_template('form_pi.html', form=form)

@app.route('/form/cd', methods=['GET', 'POST'])
def form_cd():
    form = CriminalCaseForm()
    if form.validate_on_submit():
        save_submission(form.data, 'criminal_defense')
        flash('Intake received. Confidential review in progress.', 'success')
        return redirect(url_for('form_cd'))
    return render_template('form_cd.html', form=form)
