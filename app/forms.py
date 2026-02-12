from flask_wtf import FlaskForm
from wtforms import StringField, TelField, EmailField, RadioField, DateField, TextAreaField, BooleanField, SelectField
from wtforms.validators import DataRequired, Email, Optional

class GeneralContactForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    phone = TelField('Phone', validators=[DataRequired()])
    inquiry_type = SelectField('Inquiry Type', choices=[
        ('default', 'Please select one...'),
        ('pi', 'Personal Injury'),
        ('cd', 'Criminal Defense'),
        ('fl', 'Family Law'),
        ('other', 'Other')
    ], validators=[DataRequired()])
    message = TextAreaField('Message', validators=[DataRequired()])

class CriminalCaseForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired()])
    phone_number = TelField('Phone Number', validators=[DataRequired()])
    email_address = EmailField('Email Address', validators=[DataRequired(), Email()])
    preferred_contact_method = RadioField('Preferred Method of Contact', choices=[
        ('Phone call', 'Phone call'),
        ('Text message', 'Text message'),
        ('Email', 'Email')
    ], validators=[Optional()])
    date_of_incident = DateField('Date of Incident', validators=[Optional()])
    county_of_incident = StringField('County Where Incident Occurred', validators=[Optional()])
    arrest_status = RadioField('Were You Arrested?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    custody_status = RadioField('Current Custody Status', choices=[
        ('In custody', 'In custody'),
        ('On bond', 'On bond'),
        ('Release without bond', 'Release without bond')
    ], validators=[Optional()])
    court_date_given = RadioField('Were You Given a Court Date?', choices=[('Yes', 'Yes'), ('No', 'No'), ('I don\'t know', 'I don\'t know')], validators=[Optional()])
    court_date = DateField('If Yes, What is the Date?', validators=[Optional()])
    incident_description = TextAreaField('Briefly describe what happened', validators=[Optional()])
    prior_convictions = RadioField('Have you ever been convicted of a crime before?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    probation_status = RadioField('Are you currently on probation?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    witnesses_present = RadioField('Were there any witnesses?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    witness_details = TextAreaField('Witness Details', validators=[Optional()])
    has_documents = RadioField('Do you have any documents related to the case?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    referral_source = RadioField('How did you hear about us?', choices=[
        ('Google', 'Google'),
        ('Social Media', 'Social Media'),
        ('Friend or Family', 'Friend or Family'),
        ('Other', 'Other')
    ], validators=[Optional()])
    additional_notes = TextAreaField('Anything else you\'d like us to know?', validators=[Optional()])

class PersonalInjuryForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired()])
    phone_number = TelField('Phone Number', validators=[DataRequired()])
    email_address = EmailField('Email Address', validators=[DataRequired(), Email()])
    preferred_contact_method = RadioField('Preferred Method of Contact', choices=[
        ('Phone call', 'Phone call'),
        ('Text message', 'Text message'),
        ('Email', 'Email')
    ], validators=[Optional()])
    date_of_incident = DateField('Date of Incident', validators=[DataRequired()])
    incident_type = RadioField('What type of incident was it?', choices=[
        ('Car accident', 'Car accident'),
        ('Slip and fall', 'Slip and fall'),
        ('Truck accident', 'Truck accident'),
        ('Dog bite', 'Dog bite'),
        ('Other', 'Other')
    ], validators=[Optional()])
    incident_description = TextAreaField('Briefly describe what happened', validators=[Optional()])
    medical_visit = RadioField('Did you go to a hospital or ER?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    medical_facility_name = StringField('Name of hospital or clinic visited', validators=[Optional()])
    injury_details = TextAreaField('What injuries did you sustain?', validators=[Optional()])
    ongoing_treatment = RadioField('Are you currently receiving treatment?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    has_auto_insurance = RadioField('Do you have auto insurance?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    auto_claim_number = StringField('Claim number', validators=[Optional()])
    police_responded = RadioField('Did police respond to the scene?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    police_report_number = StringField('Police report number', validators=[Optional()])
    fault_party_cited = RadioField('Was the at-fault party cited by police?', choices=[('Yes', 'Yes'), ('No', 'No'), ('I don\'t know', 'I don\'t know')], validators=[Optional()])
    vehicle_damaged = RadioField('Was your vehicle damaged?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    has_photos = RadioField('Do you have photos of the vehicle or scene?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    has_health_insurance = RadioField('Do you have health insurance?', choices=[('Yes', 'Yes'), ('No', 'No')], validators=[Optional()])
    health_insurance_provider = StringField('Health insurance provider name', validators=[Optional()])
    health_insurance_policy_number = StringField('Health insurance policy number', validators=[Optional()])
    additional_notes = TextAreaField('Anything else you\'d like us to know?', validators=[Optional()])
    legal_disclaimer_agreement = BooleanField('I understand that submitting this form does not create an attorney-client relationship.', validators=[DataRequired()])

class AutoAccidentWizardForm(FlaskForm):
    accident_type = StringField('Accident Type', validators=[DataRequired()])
    zip_code = StringField('Zip Code', validators=[DataRequired()])
    medical_treatment = StringField('Medical Treatment', validators=[DataRequired()])
    police_report = StringField('Police Report', validators=[DataRequired()])
    at_fault = StringField('At Fault', validators=[DataRequired()])
    has_lawyer = StringField('Has Lawyer', validators=[DataRequired()])
    accident_date = StringField('Accident Date', validators=[DataRequired()])
    primary_injury = StringField('Primary Injury', validators=[DataRequired()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    phone = TelField('Phone', validators=[DataRequired()])
