#!/usr/bin/env python3
"""
Dynamic CSV updater for JMeter performance tests
Updates CSV files with current database records before tests run
"""

import psycopg2
import json
import csv
import sys
from pathlib import Path

def load_config(config_path="../db_config.json", env_name="source"):
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

def update_multi_pet_owner_csv(env_name="source"):
    """Update multi_pet_owner_ids.csv with current owners who have multiple pets and visit history"""
    try:
        env_config = load_config("../db_config.json", env_name)
        conn = get_connection(env_config)
        cursor = conn.cursor()
        
        # Find owners with multiple pets AND visit history (prioritize for Visit History Review test)
        cursor.execute("""
            SELECT o.id, o.last_name, COUNT(DISTINCT p.id) as pet_count, COUNT(v.id) as visit_count
            FROM owners o 
            JOIN pets p ON o.id = p.owner_id 
            LEFT JOIN visits v ON p.id = v.pet_id 
            GROUP BY o.id, o.last_name 
            HAVING COUNT(DISTINCT p.id) >= 2 
            ORDER BY COUNT(v.id) DESC, COUNT(DISTINCT p.id) DESC, o.id 
            LIMIT 10
        """)
        
        multi_pet_owners = cursor.fetchall()
        
        if not multi_pet_owners:
            print("WARNING: No owners with multiple pets found!")
            # Create dummy data to prevent test failures
            multi_pet_owners = [(0, 'NoOwner', 0, 0)]
        
        # Update the CSV file
        csv_file = Path("multi_pet_owner_ids.csv")
        with open(csv_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['ownerId'])
            for owner in multi_pet_owners[:5]:  # Take top 5 for testing
                writer.writerow([owner[0]])
        
        print(f"✓ Updated {csv_file} with {len(multi_pet_owners[:5])} multi-pet owners (prioritized by visit history):")
        for owner in multi_pet_owners[:5]:
            print(f"  - ID: {owner[0]}, Last Name: {owner[1]}, Pets: {owner[2]}, Visits: {owner[3]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"ERROR updating multi_pet_owner_ids.csv: {e}")
        return False

def update_common_last_names_csv(env_name="source"):
    """Update common_last_names.csv with current last names from database"""
    try:
        env_config = load_config("../db_config.json", env_name)
        conn = get_connection(env_config)
        cursor = conn.cursor()
        
        # Get last names that have owners with pets (better for testing)
        cursor.execute("""
            SELECT DISTINCT o.last_name, COUNT(o.id) as owner_count
            FROM owners o 
            JOIN pets p ON o.id = p.owner_id 
            WHERE o.last_name IS NOT NULL 
            GROUP BY o.last_name 
            ORDER BY COUNT(o.id) DESC, o.last_name
            LIMIT 20
        """)
        
        last_names = cursor.fetchall()
        
        if not last_names:
            print("WARNING: No owners with pets found!")
            return False
        
        # Update the CSV file
        csv_file = Path("common_last_names.csv")
        with open(csv_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['searchLastName'])
            for name_data in last_names:
                writer.writerow([name_data[0]])
        
        print(f"✓ Updated {csv_file} with {len(last_names)} last names:")
        for name_data in last_names[:10]:  # Show first 10
            print(f"  - {name_data[0]} ({name_data[1]} owner(s))")
        if len(last_names) > 10:
            print(f"  ... and {len(last_names) - 10} more")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"ERROR updating common_last_names.csv: {e}")
        return False

def verify_test_data(env_name="source"):
    """Verify that the updated CSV data actually exists in the database"""
    try:
        env_config = load_config("../db_config.json", env_name)
        conn = get_connection(env_config)
        cursor = conn.cursor()
        
        print("\n" + "="*60)
        print("VERIFYING TEST DATA CONSISTENCY")
        print("="*60)
        
        success = True
        
        # 1. Verify multi-pet owner IDs exist
        print("\n1. Verifying multi-pet owner IDs...")
        with open('multi_pet_owner_ids.csv', 'r') as f:
            reader = csv.DictReader(f)
            owner_ids = [int(row['ownerId']) for row in reader]
        
        for owner_id in owner_ids:
            cursor.execute("SELECT last_name FROM owners WHERE id = %s", (owner_id,))
            result = cursor.fetchone()
            if result:
                print(f"  OK: Owner ID {owner_id} exists ({result[0]})")
            else:
                print(f"  ERROR: Owner ID {owner_id} NOT FOUND!")
                success = False
        
        # 2. Verify common last names exist
        print("\n2. Verifying common last names...")
        with open('common_last_names.csv', 'r') as f:
            reader = csv.DictReader(f)
            last_names = [row['searchLastName'] for row in reader]
        
        for last_name in last_names[:5]:  # Check first 5
            cursor.execute("SELECT COUNT(*) FROM owners WHERE last_name = %s", (last_name,))
            count = cursor.fetchone()[0]
            if count > 0:
                print(f"  OK: '{last_name}' - {count} owner(s)")
            else:
                print(f"  ERROR: '{last_name}' - NO OWNERS FOUND!")
                success = False
        
        # 3. Verify owners have pets
        print("\n3. Verifying owners have pets...")
        cursor.execute("""
            SELECT COUNT(*) FROM owners o 
            JOIN pets p ON o.id = p.owner_id
        """)
        owners_with_pets = cursor.fetchone()[0]
        print(f"  OK: {owners_with_pets} owner-pet relationships exist")
        
        if owners_with_pets == 0:
            print("  ERROR: NO OWNER-PET RELATIONSHIPS FOUND!")
            success = False
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        if success:
            print("SUCCESS: ALL DATA VERIFICATION PASSED")
        else:
            print("FAILED: DATA VERIFICATION FAILED - Tests will likely fail!")
        print("="*60)
        
        return success
        
    except Exception as e:
        print(f"ERROR during data verification: {e}")
        return False

def main():
    """Main function to update all CSV files"""
    if len(sys.argv) > 1:
        env_name = sys.argv[1]
    else:
        env_name = "source"
    
    print(f"Updating CSV files with current data from environment: {env_name}")
    print("=" * 60)
    
    success = True
    
    # Update multi-pet owner IDs
    print("\n1. Updating multi-pet owner IDs...")
    if not update_multi_pet_owner_csv(env_name):
        success = False
    
    # Update common last names
    print("\n2. Updating common last names...")
    if not update_common_last_names_csv(env_name):
        success = False
    
    # Verify the updated data
    if success:
        print("\n3. Verifying updated data...")
        if not verify_test_data(env_name):
            success = False
    
    print("\n" + "=" * 60)
    if success:
        print("SUCCESS: All CSV files updated and verified successfully!")
        sys.exit(0)
    else:
        print("FAILED: Some updates/verification failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()