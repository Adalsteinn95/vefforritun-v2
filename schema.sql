CREATE TABLE distributors (
    name    varchar(64) NOT NULL,
    email   varchar(64) NOT NULL,
    ssn     VARCHAR(64) NOT NULL,
    number int CHECK (number > 0)
);