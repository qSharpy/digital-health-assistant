import json
import random
import pickle
import pandas as pd
from keras.optimizers import SGD
from keras.layers import Dense, Activation, Dropout
from keras.models import Sequential
import numpy as np
import nltk
from nltk.stem.lancaster import LancasterStemmer
import tensorflowjs as tfjs
import tensorflow as tf
import pyrebase
import os

tf.compat.v1.disable_eager_execution()
nltk.download('punkt')
with open('data/intents.json') as json_data:
    intents = json.load(json_data)
stemmer = LancasterStemmer()
words = []
classes = []
documents = []
ignore_words = ['?']
for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])
words = [stemmer.stem(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))
training = []
output_empty = [0] * len(classes)
for doc in documents:
    bag = []
    pattern_words = doc[0]
    pattern_words = [stemmer.stem(word.lower()) for word in pattern_words]
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])
random.shuffle(training)
training = np.array(training)
train_x = list(training[:, 0])
train_y = list(training[:, 1])
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy',
              optimizer=sgd, metrics=['accuracy'])
model.fit(np.array(train_x), np.array(train_y),
          epochs=200, batch_size=5, verbose=1)


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words


def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return(np.array(bag))


tfjs.converters.save_keras_model(model, 'data')

with open('data/words.json', 'w') as words_json:
    words_json.write(json.dumps(words))
    words_json.close()
with open('data/classes.json', 'w') as classes_json:
    classes_json.write(json.dumps(classes))
    classes_json.close()
with open('data/model.json', 'r') as model_json:
    modelData = json.load(model_json)
    for weightManifest in modelData['weightsManifest']:
        for i, k in enumerate(weightManifest['paths']):
            weightManifest['paths'][i] = "intentclassification%2F" + \
                weightManifest['paths'][i]
    model_json.close()
    with open('data/model.json', 'w') as model_json_write:
        model_json_write.write(json.dumps(modelData))
        model_json_write.close()

# Firebase upload
firebaseConfig = {
    "apiKey": 'AIzaSyCpMy4UwL5LALmp2KGBaRFWjlvJ9ha3n6w',
    "authDomain": 'digital-health-assistant.firebaseapp.com',
    "databaseURL": 'https://digital-health-assistant.firebaseio.com',
    "storageBucket": 'digital-health-assistant.appspot.com',
    "serviceAccount": "firebaseServiceAccountKey.json"
}
firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()

for r,d,files in os.walk("./data"):
  for f in files:
    storage.child("intentclassification/" + f).put("data/" + f)
