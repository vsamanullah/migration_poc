"""Quick script to check actual IDs in database"""
import pyodbc
import json
import sys

# Load config
with open('../db_config.json', 'r') as f:
    config = json.load(f)

env_config = config['environments']['source']
port = env_config.get('port', '')
server = f"{env_config['server']},{port}" if port else env_config['server']

conn_str = (
    f"DRIVER={{ODBC Driver 18 for SQL Server}};"
    f"SERVER={server};"
    f"DATABASE={env_config['database']};"
    f"UID={env_config['username']};"
    f"PWD={env_config['password']};"
    f"Encrypt=yes;"
    f"TrustServerCertificate=yes"
)

conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

print("\n" + "="*70)
print("AUTHOR IDs:")
print("="*70)
cursor.execute("SELECT Id, Name FROM Authors ORDER BY Id")
for row in cursor.fetchall():
    print(f"  ID: {row[0]:3d} - {row[1][:50]}")

print("\n" + "="*70)
print("BOOK IDs:")
print("="*70)
cursor.execute("SELECT Id, Title, AuthorId FROM Books ORDER BY Id")
for row in cursor.fetchall():
    print(f"  ID: {row[0]:3d} - {row[1][:50]} (Author: {row[2]})")

conn.close()
