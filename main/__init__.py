from flask import Flask, request, send_from_directory
from .view.signup import SignupView


app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'imqknysreaegmklscetxbeyl:gxsrdnmebdgresilmgbwkmlsxgejpbmklwsyyeiaprspbey90eygmd'


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)


SignupView.register(app)


if __name__ == '__main__':
    app.run(debug=True)