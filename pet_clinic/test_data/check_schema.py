"""
Check database schema structure
"""
import psycopg2
import json
import argparse
from pathlib import Path

def load_config(config_path="../db_config.json", env_name="target"):
    """Load database configuration from JSON file"""
    with open(config_path, 'r') as f:
        config = json.load(f)
    return config['environments'][env_name]

def get_connection(env_config):
    """Create PostgreSQL connection from environment config"""
    return psycopg2.connect(
        host=env_config['host'],
        port=env_config['port'],
        database=env_config['database'],
        user=env_config['username'],
        password=env_config['password']
    )

def check_schema(env_name="target", config_path="../db_config.json"):
    """Check database schema structure"""
    try:
        # Load configuration
        env_config = load_config(config_path, env_name)
        
        print(f"\n{'='*70}")
        print(f"Checking Schema - Environment: {env_name.upper()}")
        print(f"Database: {env_config['database']}")
        print(f"Host: {env_config['host']}")
        print(f"{'='*70}\n")
        
        conn = get_connection(env_config)
        cursor = conn.cursor()

        tables = ['types', 'specialties', 'owners', 'vets', 'vet_specialties', 'pets', 'visits']

        for table_name in tables:
            print(f"\n=== {table_name} Table Structure ===")
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, character_maximum_length
                FROM information_schema.columns
                WHERE table_schema = 'petclinic' AND table_name = %s
                ORDER BY ordinal_position
            """, (table_name,))
            
            rows = cursor.fetchall()
            if rows:
                print(f"  {'Column Name':<30} {'Data Type':<15} {'Nullable':<10} {'Max Length'}")
                print(f"  {'-'*30} {'-'*15} {'-'*10} {'-'*10}")
                for row in rows:
                    col_name = row[0]
                    data_type = row[1]
                    nullable = row[2]
                    max_len = row[3] if row[3] else "N/A"
                    print(f"  {col_name:<30} {data_type:<15} {nullable:<10} {max_len}")
            else:
                print(f"  ⚠ Table '{table_name}' not found or has no columns")

        conn.close()
        
        print(f"\n{'='*70}")
        print("Schema check completed successfully")
        print(f"{'='*70}\n")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Check database schema structure')
    parser.add_argument('--env', type=str, default='target',
                        choices=['source', 'target', 'local'],
                        help='Environment to use (default: target)')
    parser.add_argument('--config', type=str, default='../db_config.json',
                        help='Path to config file (default: ../db_config.json)')
    
    args = parser.parse_args()
    check_schema(args.env, args.config)

