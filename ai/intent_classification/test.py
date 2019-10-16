import numpy as np
import nltk
import pandas as pd
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()


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


s = "Hello, are you coming to the management meeting?"
words = ["hello", "test", "asd", "ar"]
x = bow(s, words)
inputvar = pd.DataFrame([x], dtype=float, index=['input'])
print(inputvar)
