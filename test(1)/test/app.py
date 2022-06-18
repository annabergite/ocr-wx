import json

from flask import Flask, request, jsonify
import requests

from identify import get_img_content

app = Flask(__name__)

class save(object):

    # 保存图片
    def savefile(self, data, filepath, filename):
        file = filepath + '\\' + filename
        with open(file, 'wb') as f:
            f.write(data)
        return "success"

def identify(path):
    password='8907'
    url = "http://www.iinside.cn:7001/api_req"
    data={
        'password':password,
        'reqmode':'ocr_pp'
    }
    files=[('image_ocr_pp',('wx.PNG',open(path,'rb'),'application/octet-stream'))]
    headers = {}
    response = requests.post(url, headers=headers, data=data, files=files)
    return response.json()

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    print("========================")
    if request.method == "POST":
        print(request.files['file'])
        data = request.files['file'].stream.read()
        result = save().savefile(data, 'static', 'predict_img.png')
        # identify('static/predict_img.png')
        # result = list(identify('static/predict_img.png')['data'])
        result = get_img_content('static/predict_img.png')
        dic = {
            'content':result,
        }
        print(dic)
        return json.dumps(dic, ensure_ascii=False)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
