from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField

class BaseForm(FlaskForm):
    pass


class SignupForm(FlaskForm):
    handler_route = '/signup'
    first_name = StringField('First name')
    last_name = StringField('Last name')
    email = StringField('Email')
    password = PasswordField('Password')
    submit = SubmitField('Sign up')