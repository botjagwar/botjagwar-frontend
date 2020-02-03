from flask import render_template, redirect, url_for
from flask_classful import FlaskView, route

from ..form import SignupForm
from ..view import View


class SignupView(View):
    form_class = SignupForm

    @route(form_class.handler_route)
    def index(self):
        return "<br>".join(['yearn'])

    def post(self):
        print('post')
        form = render_template('form.html', form=self.form_class())
        return super(SignupView, self).render('Trytry', form)

    def get(self):
        print('geet')
        form = render_template('form.html', form=self.form_class())
        return super(SignupView, self).render('Entry', form)
