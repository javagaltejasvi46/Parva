import urllib.request
import json
import sqlite3
import os
from contextlib import closing
# Let's write a python script that checks the DB manually to see if the user's balance is 0
import psycopg2
conn = psycopg2.connect("postgresql://postgres:Youcandoit%3C3@localhost:5432/student_launchpad")
cursor = conn.cursor()
cursor.execute("SELECT id, email, wallet_address FROM users ORDER BY id DESC LIMIT 1;")
user = cursor.fetchone()
if not user:
    print("NO USER")
else:
    uid = user[0]
    cursor.execute("SELECT SUM(tokens_requested) FROM cashout_requests WHERE user_id=%s AND status != 'rejected';", (uid,))
    used = cursor.fetchone()[0] or 0
    print(f"User {user[1]} wallet_address: {user[2]}")
    print(f"Used cashout tokens: {used}")
    print(f"Calculated balance should be: {50 - used}")
conn.close()
