-- V10: Seed subscription plans
INSERT INTO plans (name, billing_cycle, price_inr, razorpay_plan_id, max_questions_per_topic, features, is_active)
VALUES
    ('Free',          'NONE',    0.00,    NULL, 10,   '{"allQuestions":false,"leaderboardRank":false,"badges":false,"analytics":false}', TRUE),
    ('Basic Monthly', 'MONTHLY', 99.00,   NULL, NULL, '{"allQuestions":true,"leaderboardRank":false,"badges":false,"analytics":false}', TRUE),
    ('Basic Yearly',  'YEARLY',  799.00,  NULL, NULL, '{"allQuestions":true,"leaderboardRank":false,"badges":false,"analytics":false}', TRUE),
    ('Pro Monthly',   'MONTHLY', 199.00,  NULL, NULL, '{"allQuestions":true,"leaderboardRank":true,"badges":true,"analytics":true}',   TRUE),
    ('Pro Yearly',    'YEARLY',  1599.00, NULL, NULL, '{"allQuestions":true,"leaderboardRank":true,"badges":true,"analytics":true}',   TRUE)
ON CONFLICT DO NOTHING;
