CREATE TABLE Registers (
    id      serial PRIMARY KEY,
    name    varchar(64) NOT NULL,
    email   varchar(64) NOT NULL,
    ssn     VARCHAR(64) NOT NULL,
    amount  int CHECK (amount > 0),
    date timestamp with time zone not null default current_timestamp
);

