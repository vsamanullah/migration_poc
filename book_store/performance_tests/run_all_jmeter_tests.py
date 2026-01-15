"""
JMeter Performance Test Runner

This script:
1. Discovers all .jmx files in the current directory
2. Before each test, resets database data using populate_test_data.py (count=5)
3. Runs each test using run_with_profiling.py

Usage:
    python run_all_jmeter_tests.py --env source
    python run_all_jmeter_tests.py --env target
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime
import glob

print(f"\n{'='*70}")
print(f"JMeter Performance Test Runner")
print(f"{'='*70}\n")
def get_jmx_files():
    """Get all .jmx files in the current directory"""
    jmx_pattern = str(Path(__file__).parent / "*.jmx")
    jmx_files = sorted(glob.glob(jmx_pattern))
    
    if not jmx_files:
        print("ERROR: No .jmx files found in the current directory")
        sys.exit(1)
    
    return jmx_files


def reset_test_data(env_name):
    """Reset database using populate_test_data.py script and export IDs to CSV"""
    test_data_script = Path(__file__).parent.parent / "test_data" / "populate_test_data.py"
    export_ids_script = Path(__file__).parent.parent / "test_data" / "export_ids_to_csv.py"
    
    print(f"\n{'='*70}")
    print(f"Step 1: Resetting test data (10 records)...")
    print(f"{'='*70}")
    
    # Step 1: Populate database
    cmd = [
        sys.executable,
        str(test_data_script),
        '--env', env_name,
        '--count', '10'
    ]
    
    result = subprocess.run(cmd, cwd=test_data_script.parent)
    
    if result.returncode != 0:
        print(f"WARNING: Test data reset failed, but continuing...")
        return False
    else:
        print(f"✓ Test data populated successfully\n")
    
    # Step 2: Export IDs to CSV files
    print(f"\n{'='*70}")
    print(f"Step 2: Exporting IDs to CSV files...")
    print(f"{'='*70}")
    
    cmd = [
        sys.executable,
        str(export_ids_script)
    ]
    
    result = subprocess.run(cmd, cwd=export_ids_script.parent)
    
    if result.returncode != 0:
        print(f"WARNING: CSV export failed, but continuing...")
        return False
    else:
        print(f"✓ CSV files updated successfully\n")
    
    return True


def run_jmeter_test(jmx_file, env_name):
    """Run a single JMeter test using run_with_profiling.py"""
    profiling_script = Path(__file__).parent / "run_with_profiling.py"
    test_name = Path(jmx_file).name
    
    print(f"\n{'='*70}")
    print(f"Running: {test_name}")
    print(f"{'='*70}\n")
    
    start_time = datetime.now()
    
    cmd = [
        sys.executable,
        str(profiling_script),
        test_name,
        '--env', env_name
    ]
    
    result = subprocess.run(cmd)
    
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    if result.returncode == 0:
        print(f"\n✓ Test completed successfully in {duration:.2f}s")
    else:
        print(f"\n✗ Test failed with return code {result.returncode}")
    
    return result.returncode == 0


def main():
    """Main entry point"""
    if len(sys.argv) != 3 or sys.argv[1] != '--env':
        print("Usage: python run_all_jmeter_tests.py --env {source|target|local}")
        print("\nExamples:")
        print("  python run_all_jmeter_tests.py --env source")
        print("  python run_all_jmeter_tests.py --env target")
        sys.exit(1)
    
    env_name = sys.argv[2]
    
    if env_name not in ['source', 'target', 'local']:
        print(f"ERROR: Invalid environment '{env_name}'")
        print("Must be one of: source, target, local")
        sys.exit(1)
    
    try:
        overall_start = datetime.now()
        
        print(f"Environment: {env_name.upper()}")
        print(f"Start Time: {overall_start.strftime('%a %b %d %I:%M:%S %p')}")
        print(f"{'='*70}\n")
        
        # Get all JMX files
        jmx_files = get_jmx_files()
        
        print(f"Found {len(jmx_files)} JMeter test files:")
        for jmx in jmx_files:
            print(f"  - {Path(jmx).name}")
        
        # Reset test data ONCE before running all tests
        print(f"\n\n{'#'*70}")
        print(f"# PREPARING TEST DATA")
        print(f"{'#'*70}")
        reset_test_data(env_name)
        
        # Run each test
        passed = 0
        failed = 0
        
        for idx, jmx_file in enumerate(jmx_files, 1):
            print(f"\n\n{'#'*70}")
            print(f"# Test {idx}/{len(jmx_files)}: {Path(jmx_file).name}")
            print(f"{'#'*70}")
            
            # Run the test
            if run_jmeter_test(jmx_file, env_name):
                passed += 1
            else:
                failed += 1
        
        overall_end = datetime.now()
        duration = (overall_end - overall_start).total_seconds()
        
        # Print summary
        print(f"\n\n{'#'*70}")
        print(f"# TEST EXECUTION SUMMARY")
        print(f"{'#'*70}\n")
        print(f"Start Time: {overall_start.strftime('%a %b %d %I:%M:%S %p')}")
        print(f"End Time: {overall_end.strftime('%a %b %d %I:%M:%S %p')}")
        print(f"Total Duration: {duration:.2f}s ({duration/60:.2f} minutes)")
        print(f"")
        print(f"Total Tests: {len(jmx_files)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed/len(jmx_files)*100):.1f}%")
        print(f"{'='*70}\n")
        
        sys.exit(0 if failed == 0 else 1)
        
    except KeyboardInterrupt:
        print("\n\nTest execution interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
