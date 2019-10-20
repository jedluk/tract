from flask import Flask
from flask_socketio import SocketIO, emit
from worker import process_image

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('process image')
def handle_process_image(payload):
    try:
        process_image(**payload)
        emit('response', {'status': 'OK'})
    except AssertionError:
        emit('response', {'status': 'ERROR', 'msg': 'Missing args'})
    except:
        emit('response', {'status': 'ERROR', 'msg': 'Error while processing'})


if __name__ == '__main__':
    socketio.run(app, host='localhost', port=6300)
