FROM python:3.6-slim
RUN apt-get update
RUN apt-get install build-essential -y
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app
RUN mkdir -p /app/data
ENTRYPOINT [ "python", "intent_classification_train_model.py" ]
