"""Export current database IDs to CSV files for JMeter tests"""
import pyodbc
import json
import csv

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

print("\nExporting Author IDs to author_ids.csv...")
cursor.execute("SELECT Id FROM Authors ORDER BY Id")
with open('../performance_tests/author_ids.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['author_id'])
    for row in cursor.fetchall():
        writer.writerow([row[0]])
print(f"✓ Exported {cursor.rowcount} author IDs")

print("\nExporting Book IDs to book_ids.csv...")
cursor.execute("SELECT Id FROM Books ORDER BY Id")
with open('../performance_tests/book_ids.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['book_id'])
    for row in cursor.fetchall():
        writer.writerow([row[0]])
print(f"✓ Exported {cursor.rowcount} book IDs")

print("\nExporting Author IDs for book creation (book_create_data.csv)...")
cursor.execute("SELECT Id, Name FROM Authors ORDER BY Id")
authors = cursor.fetchall()

with open('../performance_tests/book_create_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['title', 'year', 'price', 'genre', 'author_id'])
    
    titles = ['The Great Adventure', 'Mystery Night', 'Tech Guide', 'History of Art', 'Science Today',
              'Travel World', 'Business Strategy', 'Health & Wellness', 'Fantasy Realm', 'Coding Mastery']
    genres = ['Fiction', 'Mystery', 'Technology', 'History', 'Science', 'Travel', 'Business', 'Health', 'Fantasy', 'Technology']
    
    for i, (author_id, name) in enumerate(authors):
        title = titles[i % len(titles)]
        genre = genres[i % len(genres)]
        year = 2018 + (i % 5)
        price = round(24.99 + (i * 5), 2)
        writer.writerow([title, year, price, genre, author_id])

print(f"✓ Exported {len(authors)} rows to book_create_data.csv")

print("\nUpdating delete_author_ids.csv and delete_book_ids.csv...")
# Use last few IDs for delete operations
cursor.execute("SELECT TOP 5 Id FROM Authors ORDER BY Id DESC")
with open('../performance_tests/delete_author_ids.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['author_id'])
    for row in cursor.fetchall():
        writer.writerow([row[0]])

cursor.execute("SELECT TOP 10 Id FROM Books ORDER BY Id DESC")
with open('../performance_tests/delete_book_ids.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['book_id'])
    for row in cursor.fetchall():
        writer.writerow([row[0]])

print("✓ Exported delete IDs")

conn.close()

print("\n" + "="*70)
print("✓ All CSV files updated successfully!")
print("="*70)
print("\nYou can now run JMeter tests with the correct IDs.")
