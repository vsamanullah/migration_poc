# BookStore Application - Simple Resilience Test Cases

## Test Environment
- **Application**: `bookstore-legacy.ucgpoc.com:8080`
- **Primary Database**: SQL Server `10.8.196.7:1433`
- **Backup Database**: `bookstore-replica.cloud.com:1433`

## RPO/RTO Targets
- **Database Recovery**: RPO ≤ 1 minute, RTO ≤ 10 minutes
- **Application Recovery**: RPO ≤ 5 minutes, RTO ≤ 15 minutes

---

## Test Cases

### **Test Case 1: SQL Server Database Failover Test**

**Purpose**: Test if BookStore app switches to backup database when primary fails

**Steps**:
1. Open BookStore app: `http://bookstore-legacy.ucgpoc.com:8080`
2. Add a new author: "Test Author" with email "test@example.com"
3. Add a new book: "Test Book" by the author
4. Stop primary SQL Server: `10.8.196.7:1433`
5. Try to add another author: "Test Author 2"
6. Check if app automatically connects to backup database
7. Verify both authors and books are saved
8. Restart primary database
9. Check data sync between primary and backup

**Expected Results**:
- App continues working during database failure
- New data goes to backup database
- Recovery time < 10 minutes
- No data loss

---

### **Test Case 2: BookStore Application Crash Test**

**Purpose**: Test application restart and data recovery

**Steps**:
1. Open BookStore app and create 5 new books with different authors
2. Stop IIS or kill the application process
3. Record crash time
4. Monitor automatic restart
5. Access app again
6. Verify all 5 books are still there
7. Try adding a new book

**Expected Results**:
- Application restarts automatically
- All data intact after restart
- App functional within 15 minutes
- No data corruption

---

### **Test Case 3: Database Connection Pool Exhaustion Test**

**Purpose**: Test app behavior when database connections are exhausted

**Steps**:
1. Open BookStore and browse books list
2. Create 100 simultaneous database connections (exceed pool limit)
3. Try to add new author while connections are maxed out
4. Check error handling and app response
5. Release some connections
6. Retry adding the author
7. Verify author gets saved

**Expected Results**:
- App shows friendly error message, doesn't crash
- Graceful degradation during connection issues
- Works normally after connections available
- Data saved correctly after recovery

---

### **Test Case 4: High Load During Database Failure Test**

**Purpose**: Test system under load when database fails

**Steps**:
1. Generate 25 users browsing BookStore simultaneously
2. Users adding books and authors during test
3. During peak load, shutdown primary SQL Server
4. Monitor response time and errors
5. Check if users can continue using app
6. Verify failover to backup database
7. Bring primary database back online

**Expected Results**:
- Less than 10% error rate during failover
- Response time increase less than 2x normal
- Users can continue working
- Automatic return to primary database

---

### **Test Case 5: SQL Server Backup and Restore Test**

**Purpose**: Test backup system and data recovery

**Steps**:
1. Add 10 new authors and 20 new books
2. Take manual SQL Server backup
3. Delete 5 authors and their books from database
4. Restore from backup
5. Check if all 10 authors are back
6. Verify books are linked correctly to authors

**Expected Results**:
- Backup completes successfully
- Restore recovers all data
- No broken foreign key relationships
- Recovery time under 20 minutes

---

### **Test Case 6: IIS Memory Exhaustion Test**

**Purpose**: Test app behavior when server runs out of memory

**Steps**:
1. Monitor current IIS memory usage
2. Fill server memory to 90% capacity
3. Try to use BookStore normally
4. Add new authors and books
5. Check app performance and responsiveness
6. Free up memory
7. Verify app returns to normal performance

**Expected Results**:
- App slows down but doesn't crash
- Critical functions still work
- Graceful recovery when memory freed
- No data loss during memory pressure

---

### **Test Case 7: Network Connectivity Lost Test**

**Purpose**: Test app behavior when database network connection is lost

**Steps**:
1. Open BookStore and browse authors list
2. Block network connection between app server and database
3. Try to add new book
4. Check error handling
5. Restore network connection
6. Retry adding the book
7. Verify book gets saved

**Expected Results**:
- App shows user-friendly error message
- No application crash or hang
- Works normally after connection restored
- Data saved correctly after reconnection

---

## Quick Test Commands

### Check if BookStore app is running:
```bash
curl http://bookstore-legacy.ucgpoc.com:8080/
curl http://bookstore-legacy.ucgpoc.com:8080/api/Authors
```

### Check SQL Server database connection:
```sql
-- Connect to SQL Server
sqlcmd -S 10.8.196.7,1433 -U testuser -P "TestDb@26#!"
SELECT COUNT(*) FROM Authors;
SELECT COUNT(*) FROM Books;
```

### Simulate database failure:
```bash
# Stop SQL Server service (on database server)
net stop MSSQLSERVER

# Or block database port
netsh advfirewall firewall add rule name="Block SQL Server" dir=in action=block protocol=TCP localport=1433
```

### Check application logs:
```bash
# IIS logs location
type C:\inetpub\logs\LogFiles\W3SVC1\*.log

# Application Event Logs
eventvwr.msc
```

### Monitor SQL Server connections:
```sql
SELECT 
    DB_NAME(dbid) as DatabaseName,
    COUNT(dbid) as NumberOfConnections
FROM sys.sysprocesses 
WHERE dbid > 0 
GROUP BY dbid, DB_NAME(dbid);
```

---

## Pass/Fail Criteria

| Test Case | Pass Criteria | Fail Criteria |
|-----------|---------------|---------------|
| SQL Server Failover | App works, RTO < 10min, No data loss | App crashes, RTO > 10min, Data lost |
| App Crash | Auto restart, Data intact, RTO < 15min | Manual restart needed, Data corrupted |
| Connection Pool | Graceful error, Auto recovery | App hangs, Requires restart |
| High Load + Failure | Error rate < 10%, Response time < 2x | Error rate > 10%, App unusable |
| Backup/Restore | All data recovered, RTO < 20min | Data missing, Foreign keys broken |
| Memory Full | App slows but works, Auto recovery | App crashes, Requires restart |
| Network Lost | Friendly error, Auto recovery | App hangs, Requires restart |

---

## Test Schedule

**Daily**: Test Case 1 (SQL Server Failover)
**Weekly**: Test Cases 2, 3, 7 (App Crash, Connection Pool, Network Issues)
**Monthly**: Test Cases 4, 5, 6 (Load Testing, Backup, Memory)

---

## Test Data Setup

### Create Test Authors:
```sql
INSERT INTO Authors (Name, Email, CreatedDate) VALUES 
('Test Author 1', 'test1@example.com', GETDATE()),
('Test Author 2', 'test2@example.com', GETDATE()),
('Test Author 3', 'test3@example.com', GETDATE());
```

### Create Test Books:
```sql
INSERT INTO Books (Title, AuthorId, ISBN, PublishedDate, CreatedDate) VALUES
('Test Book 1', 1, '978-0000000001', '2024-01-01', GETDATE()),
('Test Book 2', 1, '978-0000000002', '2024-01-02', GETDATE()),
('Test Book 3', 2, '978-0000000003', '2024-01-03', GETDATE());
```

### Cleanup Test Data:
```sql
DELETE FROM Books WHERE Title LIKE 'Test Book%';
DELETE FROM Authors WHERE Name LIKE 'Test Author%';
```