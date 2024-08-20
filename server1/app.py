from flask import Flask, request, render_template, jsonify
from utils.functions import predict_news

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    news = data.get("news", "")
    prediction = predict_news(news)
    return jsonify({"prediction": prediction})


if __name__ == "__main__":
    app.run(debug=True)
