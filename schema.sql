CREATE TABLE distributors (
    id      serial,
    name    varchar(64) NOT NULL,
    email   varchar(64) NOT NULL,
    ssn     VARCHAR(64) NOT NULL,
    amount int CHECK (amount > 0),
    date current_date
);