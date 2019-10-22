from flask import Flask
from flask_socketio import SocketIO, emit
from worker import process_image
from os import getenv
import logging
import sys

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

logger = logging.getLogger()
FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG, format=FORMAT)


@socketio.on('connect')
def handle_client_connect():
    logging.info(msg='client connected')


@socketio.on('disconnect')
def handle_client_dicconnect():
    logging.info(msg='client disconnected')


@socketio.on('process')
def handle_process_image(payload):
    logging.info(msg=f"requested params {payload}")
    try:
        process_image(**payload)
        emit('response', {'status': 'OK'})
    except AssertionError as e:
        logging.error(f'Missing incoming args {str(e)}')
        emit('response', {'status': 'ERROR', 'msg': 'Missing args'})
    except Exception as e:
        logging.error(f'Failed to process image {str(e)}')
        emit('response', {'status': 'ERROR', 'msg': 'Error while processing'})


if __name__ == '__main__':
    port = int(getenv('PORT', 6300))
    socketio.run(app, port=port)
