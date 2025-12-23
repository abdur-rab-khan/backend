DROP TABLE IF EXISTS order;
DROP TYPE IF EXISTS order_status;

-- CREATING ENUM TYPE FOR ORDER_STATUS USING ENUM
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'canceled');

-- USING THE ENUM TYPE IN A TABLE
CREATE TABLE IF NOT EXISTS order (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    status order_status
);