from flask import Flask, jsonify, request
from psycopg2.extras import RealDictCursor 
from database import db_init
from flask_cors import CORS
from routes.products import products

db_init()

app = Flask(__name__, static_folder = "dist", static_url_path="")
CORS(app, origins ="*")
app.register_blueprint(products, url_prefix = "/products")
@app.route("/")
@app.route("/<path:path>")
def serve_front_end(path=""):
    return app.send_static_file("index.html")

@app.route("/health")
def get_health():
    return jsonify({"message": "Server Online"}) , 200


if __name__ == "__main__":
    app.run(debug=True)