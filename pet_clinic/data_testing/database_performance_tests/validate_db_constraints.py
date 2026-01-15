#!/usr/bin/env python3
"""
Database Constraint Validation Script
Validates database constraints and cleans up orphaned data before running performance tests
"""

import json
import os
import sys
from pathlib import Path

import psycopg2
from psycopg2 import sql

# Load database configuration
def load_db_config():
    """Load database configuration from db_config.json"""
    config_path = Path(__file__).parent.parent.parent / "db_config.json"
    
    if not config_path.exists():
        print(f"❌ Database config file not found: {config_path}")
        return None
    
    with open(config_path, 'r') as f:
        return json.load(f)

def check_foreign_key_constraints(conn):
    """Check and report foreign key constraint violations"""
    issues = []
    
    with conn.cursor() as cur:
        # Check for pets with non-existent owners
        cur.execute("""
            SELECT COUNT(*) as orphaned_pets 
            FROM pets p 
            LEFT JOIN owners o ON p.owner_id = o.id 
            WHERE o.id IS NULL
        """)
        orphaned_pets = cur.fetchone()[0]
        
        if orphaned_pets > 0:
            issues.append(f"🔴 Found {orphaned_pets} pets with non-existent owners")
        
        # Check for visits with non-existent pets
        cur.execute("""
            SELECT COUNT(*) as orphaned_visits 
            FROM visits v 
            LEFT JOIN pets p ON v.pet_id = p.id 
            WHERE p.id IS NULL
        """)
        orphaned_visits = cur.fetchone()[0]
        
        if orphaned_visits > 0:
            issues.append(f"🔴 Found {orphaned_visits} visits with non-existent pets")
        
        # Check for pets with non-existent types
        cur.execute("""
            SELECT COUNT(*) as pets_invalid_types 
            FROM pets p 
            LEFT JOIN types t ON p.type_id = t.id 
            WHERE t.id IS NULL
        """)
        pets_invalid_types = cur.fetchone()[0]
        
        if pets_invalid_types > 0:
            issues.append(f"🔴 Found {pets_invalid_types} pets with non-existent types")
    
    return issues

def cleanup_test_data(conn):
    """Clean up test data from previous runs"""
    print("🧹 Cleaning up test data from previous runs...")
    
    with conn.cursor() as cur:
        # Clean up test pets first
        cur.execute("DELETE FROM pets WHERE name LIKE 'DelPet%'")
        deleted_pets = cur.rowcount
        
        # Clean up test visits for test pets
        cur.execute("""
            DELETE FROM visits 
            WHERE pet_id NOT IN (SELECT id FROM pets)
        """)
        deleted_visits = cur.rowcount
        
        # Clean up test owners
        cur.execute("DELETE FROM owners WHERE first_name LIKE 'Del%'")
        deleted_owners = cur.rowcount
        
        conn.commit()
        
        print(f"✅ Cleaned up {deleted_pets} test pets, {deleted_visits} orphaned visits, {deleted_owners} test owners")

def validate_database_health(conn):
    """Validate overall database health"""
    print("🔍 Validating database health...")
    
    with conn.cursor() as cur:
        # Check table counts
        tables = ['owners', 'pets', 'visits', 'vets', 'types', 'specialties']
        counts = {}
        
        for table in tables:
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            counts[table] = cur.fetchone()[0]
        
        print("\n📊 Table Statistics:")
        for table, count in counts.items():
            print(f"   {table}: {count:,} records")
        
        # Validate minimum data requirements
        if counts['owners'] < 10:
            print("⚠️  Warning: Less than 10 owners in database")
        if counts['pets'] < 5:
            print("⚠️  Warning: Less than 5 pets in database")
        if counts['types'] == 0:
            print("❌ Error: No pet types found - this will cause INSERT failures")
        if counts['vets'] == 0:
            print("⚠️  Warning: No veterinarians found")

def main():
    """Main validation function"""
    print("🔧 PetClinic Database Constraint Validator")
    print("=" * 50)
    
    # Load configuration
    config = load_db_config()
    if not config:
        sys.exit(1)
    
    # Connect to database
    try:
        conn = psycopg2.connect(
            host=config.get('host', 'localhost'),
            port=config.get('port', 5432),
            database=config.get('database', 'petclinic'),
            user=config.get('user', 'petclinic'),
            password=config.get('password', 'petclinic')
        )
        print(f"✅ Connected to database: {config.get('host', 'localhost')}:{config.get('port', 5432)}")
        
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        sys.exit(1)
    
    try:
        # Clean up test data
        cleanup_test_data(conn)
        
        # Check constraints
        issues = check_foreign_key_constraints(conn)
        
        if issues:
            print("\n🔴 Foreign Key Constraint Issues:")
            for issue in issues:
                print(f"   {issue}")
        else:
            print("\n✅ No foreign key constraint violations found")
        
        # Validate database health
        validate_database_health(conn)
        
        if not issues:
            print("\n🎉 Database is ready for performance testing!")
        else:
            print("\n⚠️  Database has issues that may affect performance tests")
            
    except Exception as e:
        print(f"❌ Error during validation: {e}")
    
    finally:
        conn.close()

if __name__ == "__main__":
    main()