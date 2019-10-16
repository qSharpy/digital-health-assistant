# DHA

## Python setup:

Install https://www.python.org/ftp/python/3.6.5/python-3.6.5-amd64.exe
python -m pip install --upgrade pip  
pip install tensorflow keras nltk numpy pandas
sudo pip install tensorflowjs
convert h5 to tfjs format:
tensorflowjs_converter --input_format keras path/to/my_model.h5 path/to/tfjs_target_dir
