from flask import Flask, jsonify, Blueprint, request
from psycopg2.extras import RealDictCursor
from database import get_connection

products = Blueprint("products", __name__ )

@products.route("/")
def get_products():
    try:
        conn= get_connection()
        cur = conn.cursor(cursor_factory = RealDictCursor)
        cur.execute (
            'select * from "products"'
            )
                       
            
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
    except Exception as e :
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500
    else:
        return jsonify(rows)
    
        
@products.route("/", methods=["POST"])
def create_product():
    try:
        conn= get_connection()
        cur = conn.cursor()
        data = request.get_json()
        cur.execute("""
                    insert into products
                    (product_id, product_name, price, quantity)
                    values 
                    (%s, %s, %s, %s)
            """, (data["product_id"], data["product_name"] , data["price"], data["quantity"]))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e :
       return jsonify({"message": f"An unexpected error occurred: {e}"}), 500
    else:
        return jsonify({"message": "Object Created"}), 201
    
@products.route("/<int:id>", methods=["PUT"])
def update_product(id):
    try:
        conn= get_connection()
        cur = conn.cursor()
        data = request.get_json()
        print(data)
        cur.execute("""
                    update products
                    set 
                        product_id = %s,
                        product_name = %s,
                        price = %s,
                        quantity = %s
                    where product_id = %s
            """, (data["product_id"], data["product_name"], data["price"], data["quantity"], id))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e :
        return jsonify({"message": f"{e}"}), 500
    else:
        return jsonify({"message": "Object Updated"}), 201
    
@products.route("/<int:id>", methods=["DELETE"])
def delete_product(id):
    try:
        conn= get_connection()
        cur = conn.cursor()
        cur.execute("""
                    delete from products
                    where product_id = %s
            """, (id, ))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e :
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500
    else:
        return jsonify({"message": "Object Deleted"}), 201