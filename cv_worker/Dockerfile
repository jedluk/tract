FROM python:3.7-slim

RUN apt-get update && apt-get install libglib2.0-0 -y \
    libsm6 \
    libxext6 \
    libxrender-dev

WORKDIR /opt

COPY requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY server.py /opt/server.py
COPY worker.py /opt/worker.py

EXPOSE 5000

CMD ["python", "server.py"]
