import os
from flask import Flask, render_template, redirect, url_for
from flask_classful import FlaskView, route
from flask_wtf import FlaskForm, RecaptchaField
from werkzeug.utils import secure_filename
from flask_wtf import Form
from wtforms import StringField, PasswordField, SubmitField

# we'll make a list to hold some quotes for our app
quotes = [
    "A noble spirit embiggens the smallest man! ~ Jebediah Springfield",
    "If there is a way to do it better... find it. ~ Thomas Edison",
    "No one knows what he can do till he tries. ~ Publilius Syrus"
]

app = Flask(__name__)
app.config['SECRET_KEY'] = 'apple pie'

class BaseForm(Form):
    pass

class SignupForm(Form):
    handler_route = '/signup'
    first_name = StringField('First name')
    last_name = StringField('Last name')
    email = StringField('Email')
    password = PasswordField('Password')
    submit = SubmitField('Sign up')


class View(FlaskView):
    def __init__(self):
        super(FlaskView, self).__init__()

    def render(self, title, body):
        return render_template('template.html', title=title, body=body)



class SignupView(View):
    form_class = SignupForm

    @route(form_class.handler_route)
    def index(self):
        return "<br>".join(quotes)

    def post(self):
        print('post')
        form = render_template('form.html', form=self.form_class())
        return super(SignupView, self).render('Trytry', form)

    def get(self):
        print('geet')
        form = render_template('form.html', form=self.form_class())
        return super(SignupView, self).render('Entry', form)


SignupView.register(app)


if __name__ == '__main__':
    app.run(debug=True)