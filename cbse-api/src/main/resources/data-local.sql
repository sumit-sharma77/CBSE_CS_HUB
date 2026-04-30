-- Local dev seed data (H2 in-memory) — runs after Hibernate creates schema
-- Plans
INSERT INTO plans (name, billing_cycle, price_inr, razorpay_plan_id, max_questions_per_topic, features, is_active, created_at, updated_at)
VALUES
    ('Free',          'NONE',    0.00,    NULL, 10,   '{"allQuestions":false,"leaderboardRank":false,"badges":false,"analytics":false}', TRUE, NOW(), NOW()),
    ('Basic Monthly', 'MONTHLY', 99.00,   NULL, NULL, '{"allQuestions":true,"leaderboardRank":false,"badges":false,"analytics":false}',  TRUE, NOW(), NOW()),
    ('Basic Yearly',  'YEARLY',  799.00,  NULL, NULL, '{"allQuestions":true,"leaderboardRank":false,"badges":false,"analytics":false}',  TRUE, NOW(), NOW()),
    ('Pro Monthly',   'MONTHLY', 199.00,  NULL, NULL, '{"allQuestions":true,"leaderboardRank":true,"badges":true,"analytics":true}',    TRUE, NOW(), NOW()),
    ('Pro Yearly',    'YEARLY',  1599.00, NULL, NULL, '{"allQuestions":true,"leaderboardRank":true,"badges":true,"analytics":true}',    TRUE, NOW(), NOW());
