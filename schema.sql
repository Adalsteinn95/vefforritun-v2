CREATE TABLE Users (
    id      serial PRIMARY KEY,
    name    varchar(64) NOT NULL,
    email   varchar(64) NOT NULL,
    ssn     VARCHAR(64) NOT NULL,
    amount int CHECK (amount > 0),
    date date not null default CURRENT_DATE
);

/* example */

Insert Into Users(name,email,ssn,amount) Values ('alli','alli@hi.is','123123-023',12);