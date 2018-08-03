from flask import Flask, request, jsonify
from waitress import serve
from model import load, predict
import base64
import io
from PIL import Image
import numpy as np

PORT = 4000

app = Flask(__name__)
sess, tensors = load()

@app.route('/')
def index():
    return 'Index'

@app.errorhandler(404)
def url_error(e):
    return """
    Wrong URL!
    <pre>{}</pre>""".format(e), 404

@app.errorhandler(500)
def server_error(e):
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500

@app.route('/api', methods=['POST'])
def api():
    print('processing')
    input_data = request.json
    image_gray = decode(input_data['gray'])
    image_color = decode(input_data['color'])
    output = predict(image_gray, image_color, sess, tensors)
    output_data = encode(output)
    response = jsonify({'img':output_data})
    return response

def decode(img):
    img = base64.b64decode(img)
    img = Image.open(io.BytesIO(img))
    img = np.asarray(img)
    return img

def encode(img):
    buffer = io.BytesIO()
    Image.fromarray(img).save(buffer, format='JPEG')
    im_data = buffer.getvalue()
    return str(base64.b64encode(im_data))[2:-1]

if __name__ == '__main__':
    print('tfserver starting')
    serve(app, port=PORT, host='0.0.0.0', threads=1)
