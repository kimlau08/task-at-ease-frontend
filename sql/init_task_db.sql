\c task_db;

TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE workerSkills CASCADE;
TRUNCATE TABLE taskPhoto CASCADE;
TRUNCATE TABLE skills CASCADE;

INSERT INTO users (id, name, email, password, free, street, city, st, zip, photo, rate) VALUES (1, 'u1 Motif', 'u1@gmail.com', '111', 'Y', '150 Town Center Blvd', 'Garland', 'TX', '75040', '/u1.jpg', 60);
INSERT INTO users (id, name, email, password, free, street, city, st, zip, photo, rate) VALUES (2, 'u2 Foreman', 'u2@gmail.com', '111', 'Y', '190 E. Stacy Rd', 'Allen', 'TX', '75002', '/u2.jpg', 50);
INSERT INTO users (id, name, email, password, free, street, city, st, zip, photo, rate) VALUES (3, 'u3 Newsome', 'u3@gmail.com', '111', 'Y', '2740 N. Central Exwy.', 'Plano', 'TX', '75074', '/u3.jpg', 30);
INSERT INTO users (id, name, email, password, free, street, city, st, zip, photo, rate) VALUES (4, 'u4 Carpenter', 'u4@gmail.com', '111', 'Y', '7909 Lyndon B Johnson', 'Dallas', 'TX', '75251', '/u4.png', 50);
INSERT INTO users (id, name, email, password, free, street, city, st, zip, photo, rate) VALUES (5, 'u5 Rancher', 'u5@gmail.com', '111', 'N', '1106 E. I-30', 'Rockwall', 'TX', '75087', '/u5.png', 0);


INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (1, 5, 'u5 Rancher', 'u5@gmail.com', 'carpentry', 'closed', 'Need skillful person to create custom cabinet', 'carpentry', 'painting', 'restoring', 40, 1);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (2, 5, 'u5 Rancher', 'u5@gmail.com', 'cleaning', 'closed', 'Immediate need for a dependable person to clean up after flood', 'cleaning', 'sanitizing', 'restoring', 40, 1);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (3, 5, 'u5 Rancher', 'u5@gmail.com', 'carpentry', 'closed', 'Craft a gift for granny before the birthday', 'carpentry', 'painting', 'restoring', 16, 4);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (4, 5, 'u5 Rancher', 'u5@gmail.com', 'painting', 'closed', 'Maintenance paint job on house interior', 'painting', 'restoring', 'N/A', 16, 2);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (5, 5, 'u5 Rancher', 'u5@gmail.com', 'installing', 'closed', 'Install new electric switches', 'installing', 'N/A', 'N/A', 2, 2);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (6, 5, 'u5 Rancher', 'u5@gmail.com', 'painting', 'closed', 'Re-paint fence', 'painting', 'N/A', 'N/A', 4, 1);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (7, 5, 'u5 Rancher', 'u5@gmail.com', 'delivery', 'accepted', 'Pickup at pharmacy the coming Friday', 'delivery', 'N/A', 'N/A', 16, 3);
INSERT INTO tasks (id, owner, ownername, owneremail, kind, status, details, skill1, skill2, skill3, hours, worker) VALUES (8, 5, 'u5 Rancher', 'u5@gmail.com', 'moving', 'open', 'Moving to 10 miles away next month', 'packing', 'moving', 'N/A', 16, 0);


INSERT INTO workerSkills (id, worker, skill) VALUES (1, 1, 'carpentry');
INSERT INTO workerSkills (id, worker, skill) VALUES (2, 1, 'painting');
INSERT INTO workerSkills (id, worker, skill) VALUES (3, 1, 'moving');
INSERT INTO workerSkills (id, worker, skill) VALUES (4, 1, 'delivery');
INSERT INTO workerSkills (id, worker, skill) VALUES (5, 2, 'installing');
INSERT INTO workerSkills (id, worker, skill) VALUES (6, 2, 'painting');
INSERT INTO workerSkills (id, worker, skill) VALUES (7, 2, 'cleaning');
INSERT INTO workerSkills (id, worker, skill) VALUES (8, 3, 'sanitizing');
INSERT INTO workerSkills (id, worker, skill) VALUES (9, 3, 'cleaning');
INSERT INTO workerSkills (id, worker, skill) VALUES (10, 4, 'carpentry');
INSERT INTO workerSkills (id, worker, skill) VALUES (11, 4, 'delivery');

INSERT INTO taskPhoto (id, worker, task, photo) VALUES (1, 1, 1, '/u1Woodwork1.jfif');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (2, 1, 1, '/u1Woodwork2.jpg');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (3, 1, 6, '/u1Painting.jpg');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (4, 2, 4, '/u2Painting.jpg');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (5, 2, 5, '/u2Install.jpg');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (6, 3, 2, '/u3beforeClean.png');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (7, 3, 2, '/u3afterClean.png');
INSERT INTO taskPhoto (id, worker, task, photo) VALUES (8, 4, 3, '/u4Woodwork.jpg');

INSERT INTO skills (id, skill) VALUES (1, 'N/A');
INSERT INTO skills (id, skill) VALUES (2, 'delivery');
INSERT INTO skills (id, skill) VALUES (3, 'cleaning');
INSERT INTO skills (id, skill) VALUES (4, 'sanitizing');
INSERT INTO skills (id, skill) VALUES (5, 'installing');
INSERT INTO skills (id, skill) VALUES (6, 'carpentry');
INSERT INTO skills (id, skill) VALUES (7, 'painting');
INSERT INTO skills (id, skill) VALUES (8, 'restoring');
INSERT INTO skills (id, skill) VALUES (9, 'packing');
INSERT INTO skills (id, skill) VALUES (10, 'moving');
