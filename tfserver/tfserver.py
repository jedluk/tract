from flask import Flask, request
from flask_socketio import SocketIO, emit
import logging
from logging.handlers import RotatingFileHandler
from model import load, predict
import base64
import io
from PIL import Image
import numpy as np

PORT = 6000

app = Flask(__name__)
socketio = SocketIO(app)
clients = []

@socketio.on('connect')
def handle_connect():
    clients.append(request.sid)
    send_message(clients[0], "Connected")

@socketio.on('disconnect')
def handle_disconnect():
    clients.remove(request.sid)

@socketio.on('process')
def process(data_gray, data_color, socketID):
    image_gray = decode(data_gray)
    image_color = decode(data_color)
    output = predict(image_gray, image_color, sess, tensors)
    data_output = encode(output)

    emit('processed', {'image': str(data_output)[2:-1], 'socketID': socketID})

def send_message(client_id, message):
    if client_id is not None:
        socketio.emit('message', message, room=client_id)

def decode(img):
    img = base64.b64decode(img)
    img = Image.open(io.BytesIO(img))
    img = np.asarray(img)
    return img

def encode(img):
    buffer = io.BytesIO()
    Image.fromarray(img).save(buffer, format='JPEG')
    im_data = buffer.getvalue()
    return base64.b64encode(im_data)

if __name__ == '__main__':
    handler = RotatingFileHandler('output.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    sess, tensors = load()
    socketio.run(app, port=PORT)
    app.logger.info('tfserver started')
