from flask import render_template
from flask_classful import FlaskView

class View(FlaskView):
    def __init__(self):
        super(FlaskView, self).__init__()

    def render(self, title, body):
        return render_template('template.html', title=title, body=body)
