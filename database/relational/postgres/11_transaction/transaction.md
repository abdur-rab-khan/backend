# Transaction in PostgreSQL

> A **transaction** in PostgreSQL is a sequence of one or more SQL operations that are executed as a single unit of work. Transactions ensure all-or-nothing execution, meaning that either all operations within the transaction are successfully completed, or none of them are applied to the database. This is crucial for maintaining data integrity and consistency.

## Overview

- In PostgresSQL, every time when any query is executed whether we use `BEGIN` or not, it is treated as a transaction, PostgresSQL automatically wraps each individual statement in its own transaction if no explicit transaction block is started.
- During the execution of a transaction, other transactions may not see the intermediate states of the data being modified until the transaction is committed.
- Transactions in PostgreSQL follow the ACID properties (Atomicity, Consistency, Isolation, Durability) to ensure reliable processing of database operations.
- Transactions can be nested using savepoints, allowing partial rollbacks within a transaction.
- We can lock rows or tables during a transaction to prevent concurrent modifications that could lead to data inconsistencies, by default PostgreSQL uses MVCC (Multi-Version Concurrency Control) to handle concurrent transactions.
  - In Postgres, if a lock is applied on a row, it does following things:
    - Prevents other transactions for modifying
    - Prevents other transactions for deleting
    - Allows other transactions to read the row

## Key Concepts

- **`BEGIN`**: This command starts a new transaction block, allowing you to group multiple SQL statements together.
- **`COMMIT`**: This command ends the transaction and makes all changes made during the transaction permanent in the database.
- **`ROLLBACK`**: This command ends the transaction and undoes all changes made during the transaction, reverting the database to its previous state.
- **Savepoints**: These allow you to set a point within a transaction that you can roll back to without affecting the entire transaction. Use the `SAVEPOINT` command to create a savepoint and `ROLLBACK TO SAVEPOINT` to revert to it.

## Example

- Example: Transferring money between two accounts within a transaction:

  ```sql
  BEGIN;  -- Start a new transaction

  UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

  COMMIT;  -- Commit the transaction
  ```

  - See we does not use `ROLLBACK` here, We have to understand that if any of the `UPDATE` statements fail:
    - The entire transaction remains in idle until the db connection is closed or a `ROLLBACK` command is issued.
    - No changes will be applied to the database until a `COMMIT` is executed.
    - So it is a good practice to handle errors in application code and issue a `ROLLBACK` if any operation within the transaction fails.

- Example: Using savepoints within a transaction:

  ```sql
  BEGIN;  -- Start a new transaction

  UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
  SAVEPOINT sp1;  -- Create a savepoint

  UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

  -- Suppose the second update fails, we can rollback to the savepoint
  ROLLBACK TO SAVEPOINT sp1;

  COMMIT;  -- Commit the transaction
  ```

  - In this example, if the second `UPDATE` fails, we roll back to the savepoint `sp1`, undoing only the changes made after that point, while keeping the first update intact.

- Example: Let's use postgres function for this.

  ```sql
  CREATE OR REPLACE FUNCTION transfer_funds(from_account INT, to_account INT, amount NUMERIC)
  RETURNS VOID AS $$
  BEGIN
      BEGIN;  -- Start a new transaction

      UPDATE accounts SET balance = balance - amount WHERE account_id = from_account;
      UPDATE accounts SET balance = balance + amount WHERE account_id = to_account;

      COMMIT;  -- Commit the transaction
  EXCEPTION
      WHEN OTHERS THEN
          ROLLBACK;  -- Rollback the transaction in case of error
          RAISE;  -- Re-raise the exception for further handling
  END;
  $$ LANGUAGE plpgsql;
  ```

  - In this function, we encapsulate the transfer logic within a transaction. If any error occurs during the updates, we roll back the entire transaction to maintain data integrity.

- Example: Let's use postgres function for this with savepoint.

  ```sql
  CREATE OR REPLACE FUNCTION transfer_funds_with_savepoint(from_account INT, to_account INT, amount NUMERIC)
  RETURNS VOID AS $$
  BEGIN
      BEGIN;  -- Start a new transaction

      UPDATE accounts SET balance = balance - amount WHERE account_id = from_account;
      SAVEPOINT sp1;  -- Create a savepoint

      UPDATE accounts SET balance = balance + amount WHERE account_id = to_account;

      COMMIT;  -- Commit the transaction
  EXCEPTION
      WHEN OTHERS THEN
          ROLLBACK TO SAVEPOINT sp1;  -- Rollback to savepoint in case of error
          COMMIT;  -- Commit the transaction after rolling back to savepoint
          RAISE;  -- Re-raise the exception for further handling
  END;
  $$ LANGUAGE plpgsql;
  ```

  - In this function, if the second update fails, we roll back to the savepoint `sp1`, undoing only the changes made after that point, while keeping the first update intact. Finally, we commit the transaction.

- Note: In real-world applications, it's essential to handle transactions carefully to avoid issues like deadlocks and ensure optimal performance.
