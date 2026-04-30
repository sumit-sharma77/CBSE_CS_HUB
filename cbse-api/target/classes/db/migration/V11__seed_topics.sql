-- V11: Seed topics
INSERT INTO topics (name, class_level, type) VALUES
    ('Class 12 Python',               12, 'PYTHON'),
    ('Class 12 SQL',                  12, 'SQL'),
    ('Class 11 Python',               11, 'PYTHON'),
    ('Class 11 Computer Fundamentals',11, 'MCQ'),
    ('SQL Aggregate Functions',       12, 'SQL'),
    ('SQL GROUP BY',                  12, 'SQL'),
    ('SQL Joins',                     12, 'SQL'),
    ('SQL Keys & Constraints',        12, 'SQL'),
    ('SQL ORDER BY',                  12, 'SQL'),
    ('SQL SELECT',                    12, 'SQL'),
    ('SQL WHERE',                     12, 'SQL'),
    ('Python Conditions',             12, 'PYTHON'),
    ('Python Dictionaries',           12, 'PYTHON'),
    ('Python Functions',              12, 'PYTHON'),
    ('Python Lists',                  12, 'PYTHON'),
    ('Python Loops',                  12, 'PYTHON'),
    ('Python Mixed',                  12, 'PYTHON'),
    ('Python Strings',                12, 'PYTHON'),
    ('Python Variables',              12, 'PYTHON')
ON CONFLICT DO NOTHING;

-- Verify row count
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM topics) < 19 THEN
        RAISE WARNING 'Expected 19 topics but found fewer — check V11 seed';
    END IF;
END $$;
