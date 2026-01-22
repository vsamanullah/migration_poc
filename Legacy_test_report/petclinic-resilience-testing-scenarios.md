# PetClinic Application - Simple Resilience Test Cases

## Test Environment
- **Application**: <URL>
- **Primary Database**: <IP>
- **Backup Database**: <IP>

## RPO/RTO Targets
- **Database Recovery**: RPO ≤ 2 minutes, RTO ≤ 15 minutes
- **Application Recovery**: RPO ≤ 5 minutes, RTO ≤ 10 minutes

---

## Test Cases

### **Test Case 1: Database Failover Test**

**Purpose**: Test if application switches to backup database when primary fails

**Steps**:
1. Open PetClinic app: <URL>
2. Add a new owner: "Test Owner" with phone "123-456-7890"
3. Stop primary database server: <IP>
4. Try to add another owner: "Test Owner 2" 
5. Check if app automatically connects to backup database
6. Verify both owners are saved
7. Restart primary database
8. Check data sync between primary and backup

**Expected Results**:
- App continues working during database failure
- New data goes to backup database
- Recovery time < 15 minutes
- No data loss

---

### **Test Case 2: Application Server Crash Test**

**Purpose**: Test application restart and data recovery

**Steps**:
1. Open PetClinic app and create 5 new pets
2. Kill the application process (simulate crash)
3. Record crash time
4. Monitor automatic restart
5. Access app again
6. Verify all 5 pets are still there
7. Try adding a new pet

**Expected Results**:
- Application restarts automatically
- All data intact after restart
- App functional within 10 minutes
- No data corruption

---

### **Test Case 3: Network Connection Lost Test**

**Purpose**: Test app behavior when database connection is lost

**Steps**:
1. Open PetClinic and browse owners list
2. Block network connection between app and database
3. Try to add new owner
4. Check error handling
5. Restore network connection
6. Retry adding the owner
7. Verify owner gets saved

**Expected Results**:
- App shows friendly error message
- No application crash
- Works normally after connection restored
- Data saved correctly after reconnection

---

### **Test Case 4: High Load During Failure Test**

**Purpose**: Test system under load when failure occurs

**Steps**:
1. Generate 50 users browsing PetClinic simultaneously
2. During peak load, shutdown primary database
3. Monitor response time and errors
4. Check if users can continue using app
5. Verify failover to backup database
6. Bring primary database back online

**Expected Results**:
- Less than 5% error rate during failover
- Response time increase less than 3x normal
- Users can continue working
- Automatic return to primary database

---

### **Test Case 5: Data Backup and Restore Test**

**Purpose**: Test backup system and data recovery

**Steps**:
1. Add 10 new owners with pets
2. Take manual database backup
3. Delete 5 owners from database
4. Restore from backup
5. Check if all 10 owners are back
6. Verify pets are linked correctly

**Expected Results**:
- Backup completes successfully
- Restore recovers all data
- No broken relationships
- Recovery time under 20 minutes

---

### **Test Case 6: Memory Full Test**

**Purpose**: Test app behavior when server runs out of memory

**Steps**:
1. Monitor current memory usage
2. Fill server memory to 95% capacity
3. Try to use PetClinic normally
4. Add new owners and pets
5. Check app performance
6. Free up memory
7. Verify app returns to normal

**Expected Results**:
- App slows down but doesn't crash
- Critical functions still work
- Graceful recovery when memory freed
- No data loss during memory pressure

---

## Quick Test Commands

### Check if app is running:
```bash
curl http://petclinic-legacy.ucgpoc.com:8080/petclinic/
```

### Check database connection:
```bash
psql -h 10.106.54.5 -p 5432 -U petclinic -d petclinic -c "SELECT COUNT(*) FROM owners;"
```

### Simulate database failure:
```bash
# Stop database service
sudo systemctl stop postgresql

# Or block database port
sudo iptables -A INPUT -p tcp --dport 5432 -j DROP
```

### Check app logs:
```bash
tail -f /var/log/petclinic/application.log
```

---

## Pass/Fail Criteria

| Test Case | Pass Criteria | Fail Criteria |
|-----------|---------------|---------------|
| Database Failover | App works, RTO < 15min, No data loss | App crashes, RTO > 15min, Data lost |
| App Server Crash | Auto restart, Data intact, RTO < 10min | Manual restart needed, Data corrupted |
| Network Lost | Graceful error, Auto recovery | App hangs, Requires restart |
| High Load + Failure | Error rate < 5%, Response time < 3x | Error rate > 5%, App unusable |
| Backup/Restore | All data recovered, RTO < 20min | Data missing, Relationships broken |
| Memory Full | App slows but works, Auto recovery | App crashes, Requires restart |

---

## Test Schedule

**Daily**: Test Case 1 (Database Failover)
**Weekly**: Test Cases 2, 3 (App Crash, Network Issues)  
**Monthly**: Test Cases 4, 5, 6 (Load Testing, Backup, Memory)