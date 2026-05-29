import psycopg2
import os 
from dotenv import load_dotenv

load_dotenv()
def get_connection():
    conn=psycopg2.connect(
        host = os.getenv("DB_HOST"),
        port = os.getenv ("DB_PORT"),
        dbname= os.getenv ("DB_NAME"),
        user = os.getenv ("DB_USER"),
        password = os.getenv ("DB_PASS"),
        sslmode= os.getenv ("DB_SSLMODE")

    )

    return conn

def db_init():
    conn = get_connection()
    cur= conn.cursor()
    cur.execute("""
                 create table if not exists products
                 (
                 product_id serial primary key,
                 product_name varchar (50),
                 price int,
                 quantity int
                 )
               """)
    # Add color and size columns if they don't exist yet
    cur.execute("""
        alter table products
        add column if not exists color varchar(50)
    """)
    cur.execute("""
        alter table products
        add column if not exists size int
    """)
    conn.commit() 
    cur.close()
    conn.close()
    print("Database Ready")
