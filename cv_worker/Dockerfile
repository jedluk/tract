FROM python:3.7-slim

WORKDIR /opt

COPY requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY server.py /opt
COPY worker.py /opt

RUN ["python", "server.py"]