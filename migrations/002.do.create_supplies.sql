CREATE TABLE supplies (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    supply_name VARCHAR(255) NOT NULL,
    details TEXT,
    quantity INTEGER NOT NULL
);

ALTER TABLE supplies
    ADD COLUMN
        user_id INTEGER REFERENCES users(id)
        ON DELETE CASCADE NOT NULL;

INSERT INTO supplies (supply_name, details, quantity, user_id)
    VALUES
        ('fabric - cotton - jersey knit', 'blue, yards', 3, 2),
        ('nails', '...', 50, 2),
        ('origami paper', 'multicolor, sheets', 30, 2),
        ('thread', 'green, spools', 1, 2);
