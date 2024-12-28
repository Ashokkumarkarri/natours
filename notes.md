# 020 Importing Review and User Data

delete all the fake or test: users, review, tours data
and update the real data

### Importing Development Data in Node.js

1. **Objective**: Import users and reviews data in addition to tours for API development.
   - Users: ~20 test users.
   - Reviews: ~60 entries for testing.
2. **Steps to Modify Import Script**:
   - Update the script to handle `users` and `reviews`.
   - Import corresponding models: `User` and `Review`.
   - Duplicate existing code for tours to process users and reviews.
3. **Clearing Existing Data**:
   - Use terminal commands to delete test users and reviews along with tours.
   - Verify deletions in MongoDB Compass.
4. **Handling Validation Issues**:
   - Turn off validation for specific operations:
     ```jsx
     validateBeforeSave: false;
     ```
   - Temporarily disable password encryption as provided users already have encrypted passwords.
5. **Testing the Changes**:
   - Re-import data after clearing duplicates.
   - Confirm data is imported correctly for users, tours, and reviews in Compass.
   - Verify that passwords remain unencrypted as intended.
6. **Validation**:
   - Compare imported data with the original JSON file to ensure accuracy.

### Key Notes:

- Disable validations and encryption selectively when working with pre-existing data.
- Always clear old data before importing to avoid duplicates.
- Use MongoDB Compass to verify database state after operations.
