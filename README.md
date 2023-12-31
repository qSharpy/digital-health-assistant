# DHA

Flow sketch and PDF presentation are present in the docs folder.

## Technologies, frameworks and libraries

- Angular 8
  - Angular Material
  - Angular Flex Layout
  - Bootstrap
  - ng-chat
- NodeJS w/ Typescript
  - tensorflowjs
  - rxjs
  - nodemailer
  - tslint
- Firebase
- Twilio Flows and Functions
- Python
  - numpy
  - tensorflow
  - tensorflowjs
  - pandas
  - keras
  - nltk
  - see requirements.txt

We don't have a custom backend implementation - everything is cloud functions and cloud storage.  
For now, we have trained the model with some initial data, but we still have to call .predict() and interpret the result.

## Project structure

./.github - CI/CD with GitHub Actions  
./.vscode - VSCode configs  
./ai - ML scripts & models  
./functions - Firebase functions  
./src, ./e2e - Angular 8 app source  
./ssl - dev env self signed certificate  
./twilio - Twilio Flows and Functions

## Most important files too look at

ai/intent_classification/intent_classification_train_model.py  
functions/process.ts  
functions/services/tensorflow.service.ts  
functions/services/storage.iohandler.ts

## Flows

User -> types -> Chat window -> Firebase function -> TF Model -> Response text  
User -> call from -> Chat window -> STT -> Firebase function -> TF Model -> Response text -> TTS  
User -> types call phone no -> Twilio Function -> starts -> Twilio Flow -> calls User on phone -> record voice loop -> Firebase function -> TF Model -> Response text -> is spoken to user  
User -> calls Twilio no. -> record voice loop -> Firebase function -> TF Model -> Response text -> is spoken to user  
User -> sends SMS to Twilio no. -> Firebase function -> TF Model -> Response text -> is texted to user

## Dev setup

This is a Angular 8 CLI-generated project, with Firebase integration: Functions, Firestore, Auth

cd to this dir  
npm install  
cd functions  
npm install  
cd ..  
npm start (will start Firebase emulators and ng serve)

If building the app in production mode, all URLs will point to PROD, else they will point to the emulators.

## Python setup for training the ML model (Training set -> Keras H5 Model -> TFJS json model)

Install https://www.python.org/ftp/python/3.6.5/python-3.6.5-amd64.exe  
python -m pip install --upgrade pip  
pip install -r requirements.txt  
All Python scripts will upload models to Firebase Storage  

## Use Docker for training  
### Intent classification:  
* Build image: cd ai/intent_classification && docker build -t imageclassification .
* Run: docker run --rm --name intent_classification --mount type=bind,source=./path/to/json/file.json,target=/app/data/intents.json intent_classification
