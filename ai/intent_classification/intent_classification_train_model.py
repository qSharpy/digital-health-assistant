import json
import random
import pickle
import pandas as pd
from keras.optimizers import SGD
from keras.layers import Dense, Activation, Dropout
from keras.models import Sequential
import numpy as np
import nltk
import json
from nltk.stem.lancaster import LancasterStemmer
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
print(len(documents), "documents")
print(len(classes), "classes", classes)
print(len(words), "unique stemmed words", words)
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
                if show_details:
                    print("found in bag: %s" % w)

    return(np.array(bag))


p = bow("Load blood pessure for patient", words)
print(p)
print(classes)
inputvar = pd.DataFrame([p], dtype=float, index=['input'])
print(model.predict(inputvar))
pickle.dump(model, open("data/assistant-model.pkl", "wb"))
pickle.dump({'words': words, 'classes': classes, 'train_x': train_x,
             'train_y': train_y}, open("data/assistant-data.pkl", "wb"))
model.save('data/assistant-keras-model.h5')
with open('data/words.json', 'w') as words_json:
    jsonFileContent = json.dumps(words)
    words_json.write(jsonFileContent)
    words_json.close()
