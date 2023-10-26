import psycopg2
import base64
import os
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


port = 5432
host = "localhost"
user = "postgres"
password = "postgrespw"
database = 'eventastic'
event_img_dir = './test_img/event'
account_img_dir = './test_img/account'


con = psycopg2.connect(user=user, password=password, host=host, port=port)
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = con.cursor()
print('\nDropping Database ...')
cur.execute('DROP DATABASE IF EXISTS {}'.format(database))
print('\nCreating Database ...')
cur.execute('CREATE DATABASE {}'.format(database))
cur.close()
con.close()


con = psycopg2.connect(database=database, user=user,
                       password=password, host=host, port=port)
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = con.cursor()

print('\nDropping Tables ...')
cur.execute('drop TABLE IF EXISTS hosts cascade;')
cur.execute('drop TABLE IF EXISTS saved_cards cascade;')
cur.execute('drop TABLE IF EXISTS accounts cascade;')
cur.execute('drop TABLE IF EXISTS venues cascade;')
cur.execute('drop TABLE IF EXISTS venue_seating cascade;')
cur.execute('drop TABLE IF EXISTS events cascade;')
cur.execute('drop TABLE IF EXISTS bookings cascade;')
cur.execute('drop TABLE IF EXISTS tickets cascade;')
cur.execute('drop TABLE IF EXISTS groups cascade;')
cur.execute('drop TABLE IF EXISTS group_members cascade;')
cur.execute('drop TABLE IF EXISTS reviews cascade;')
cur.execute('drop TABLE IF EXISTS interactions cascade;')
cur.execute('drop TABLE IF EXISTS rewardpoints cascade;')

# Create Tables
print('\nCreating Tables ...')
cur.execute('CREATE TABLE accounts (\
            account_id SERIAL PRIMARY KEY,\
            email VARCHAR(50),\
            first_name VARCHAR(50),\
            last_name VARCHAR(50),\
            age INT,\
            mobile_no VARCHAR(20),\
            location VARCHAR(50),\
            password VARCHAR(50),\
            account_type VARCHAR(20),\
            profile_pic TEXT,\
            reward_points VARCHAR(30),\
            tags TEXT, \
            user_desc TEXT \
            );')

cur.execute('CREATE TABLE hosts(\
            id SERIAL PRIMARY KEY,\
            account_id INT NOT NULL,\
            FOREIGN KEY (account_id) REFERENCES accounts (account_id),\
            organisation_name VARCHAR(50),\
            organisation_desc TEXT,\
            host_contact_no VARCHAR(20),\
            job_title VARCHAR(30),\
            qualification VARCHAR(50),\
            is_verified BOOLEAN, \
            host_status VARCHAR(15), \
            org_email VARCHAR(30) \
            );')

cur.execute('CREATE TABLE saved_cards(id SERIAL PRIMARY KEY, \
            account_id INT NOT NULL,\
            FOREIGN KEY (account_id) REFERENCES accounts (account_id),\
            card_name VARCHAR(50),\
            card_number VARCHAR(16),\
            card_type VARCHAR(10),\
            card_expiry VARCHAR(4)\
            );')

cur.execute('CREATE TABLE venues (\
            venue_id SERIAL PRIMARY KEY, \
            venue_name TEXT, \
            venue_desc TEXT, \
            venue_img TEXT, \
            venue_location TEXT);')

cur.execute('CREATE TABLE venue_seating (\
            seating_id SERIAL PRIMARY KEY,\
            venue_id INT NOT NULL, \
            FOREIGN KEY (venue_id) REFERENCES venues (venue_id),\
            seating_type TEXT, \
            seating_number INT);')

# Events Status : UPCOMING, CANCELLED, COMPLETED
cur.execute('CREATE TABLE events (\
            event_id SERIAL PRIMARY KEY, \
            host_id INT NOT NULL,\
            FOREIGN KEY (host_id) REFERENCES hosts (id),\
            account_id INT NOT NULL,\
            FOREIGN KEY (account_id) REFERENCES accounts (account_id),\
            venue_id INT NOT NULL,\
            FOREIGN KEY (venue_id) REFERENCES venues (venue_id),\
            gen_seat_price float8,\
            front_seat_price float8,\
            mid_seat_price float8,\
            back_seat_price float8,\
            event_title TEXT,\
            event_category TEXT,\
            event_short_desc TEXT,\
            event_desc TEXT,\
            event_start_datetime TEXT,\
            event_end_datetime TEXT,\
            event_location TEXT,\
            event_img TEXT,\
            event_status TEXT,\
            tags TEXT);')

# Bookings status :  [Booked, Cancelled, Completed].
cur.execute('CREATE TABLE bookings (\
            booking_id SERIAL PRIMARY KEY, \
            account_id INT NOT NULL,\
            FOREIGN KEY (account_id) REFERENCES accounts (account_id),\
            event_id INT NOT NULL,\
            FOREIGN KEY (event_id) REFERENCES events (event_id),\
            booking_status VARCHAR(15),\
            total_cost float8,\
            card_name VARCHAR(50),\
            card_number VARCHAR(16),\
            qr_code TEXT\
            );')

# Ticket type : General, Front, Middle, Back
cur.execute('CREATE TABLE tickets (\
            ticket_id SERIAL PRIMARY KEY, \
            venue_id INT NOT NULL,\
            FOREIGN KEY (venue_id) REFERENCES venues (venue_id),\
            event_id INT NOT NULL,\
            FOREIGN KEY (event_id) REFERENCES events (event_id),\
            booking_id INT,\
            ticket_ref TEXT,\
            ticket_status TEXT,\
            qr_code TEXT,\
            ticket_type TEXT,\
            ticket_price float8);')

# Groups Table
cur.execute('CREATE TABLE groups(id SERIAL PRIMARY KEY,\
    group_host_id INT NOT NULL,\
        event_id INT NOT NULL,\
            group_name VARCHAR(50),\
                group_desc TEXT,\
                    group_img TEXT);')

# Group Members Table
cur.execute('CREATE TABLE group_members(id SERIAL PRIMARY KEY,\
    account_id INT NOT NULL,\
        group_id INT NOT NULL,\
            join_status VARCHAR(20),\
                join_desc TEXT,\
                    interest_tags TEXT);')

# Reviews Table
# Review Status : Active, Removed
# Rating : User rating between 1 - 5
cur.execute('CREATE TABLE reviews(\
            review_id SERIAL PRIMARY KEY,\
            event_id INT NOT NULL,\
            FOREIGN KEY (event_id) REFERENCES events (event_id),\
            reviewer_account_id INT NOT NULL,\
            FOREIGN KEY (reviewer_account_id) REFERENCES accounts (account_id),\
            upvotes INT,\
            rating INT,\
            review_text TEXT,\
            review_timestamp TEXT,\
            flag_count INT,\
            review_status TEXT, \
            reply_text TEXT \
            );')

# Interactions Table
# interaction account id refers to the user currently logged in i.e.
# (user that is viewing the reviews)
# It refers accounts table as this user may not have left a review
# This table keeps a track of user interaction with reviews
cur.execute('CREATE TABLE interactions(\
            interaction_id SERIAL PRIMARY KEY,\
            review_id INT NOT NULL,\
            FOREIGN KEY (review_id) REFERENCES reviews (review_id),\
            interaction_account_id INT NOT NULL,\
            FOREIGN KEY (interaction_account_id) REFERENCES accounts (account_id),\
            review_upvoted BOOLEAN,\
            review_flagged BOOLEAN \
            );')

# Reward Points table
cur.execute('CREATE TABLE rewardpoints(\
            reward_points_id SERIAL PRIMARY KEY,\
            account_id INT NOT NULL,\
            FOREIGN KEY (account_id) REFERENCES accounts (account_id),\
            event_id INT NOT NULL,\
            FOREIGN KEY (event_id) REFERENCES events (event_id),\
            booking_id INT NOT NULL,\
            FOREIGN KEY (booking_id) REFERENCES bookings (booking_id),\
            reward_points_amount float8,\
            reward_points_status TEXT \
                );')

# Enter dummy data here
print('\nInserting dummy data ...')
cur.execute("INSERT INTO accounts values(default, 'vishalsingh6475@gmail.com', 'Vishal', 'Singh', 66, \
            '469717341', 'Sydney', 'Vish', 'Customer', 'uuid', '3000', 'Movies,Adventure,Sports', 'Doing MIT course at UNSW' \
            );")
cur.execute("INSERT INTO accounts values(default, 'James@bond.com', 'James', 'Bond', 77, \
            '777777777', 'Sydney', 'JB', 'Customer', 'uuid', '3000', 'Movies,Adventure,Sports', 'Actor for James Bond movies' \
            );")
cur.execute("INSERT INTO accounts values(default, 'vish@gmail.com', 'John', 'Robinson', 80, \
            '469077369', 'Sydney', 'Vish', 'Customer', 'uuid', '3000', 'Movies,Adventure,Sports,Beaches', 'Just studying' \
            );")
cur.execute("INSERT INTO accounts values(default, 'neo@matrix.com', 'Keanu', 'Reeves', 57, \
            '123456789', 'Zion', 'Neo', 'Admin', 'uuid', '9999', 'Killing,Machines', 'Savior of Zion' \
            );")


cur.execute("INSERT INTO hosts values(default, 1, 'Westpac', 'Westpac Banking Corp', '0469717341', \
            'Software Engineer', 'Masters', False, 'Approved', 'vish@westpac.com' \
            );")
cur.execute("INSERT INTO hosts values(default, 2, 'Matrix', 'The Truth', '999999999', \
            'Superhero', 'The One', False, 'Pending', 'anderson@mat.com' \
            );")
cur.execute("INSERT INTO hosts values(default, 3, 'UNSW', 'Sydney University', '000000000', \
            'Information Technology', 'Masters', False, 'Pending', 'vish@unsw.com' \
            );")


cur.execute(
    "INSERT INTO saved_cards values(default, 1, 'Vishal', '9999333366668888', 'Credit', '1228');")
cur.execute(
    "INSERT INTO saved_cards values(default, 2, 'Bond', '7777777777777777', 'Credit', '0426');")
cur.execute(
    "INSERT INTO saved_cards values(default, 4, 'Neo', '9999999999999999', 'Debit', '1030');")

cur.execute("INSERT INTO  venues values(default, 'Shark Hotel Sydney, NSW', 'Old-school mainstay featuring classic pub favourites & multiple bars, plus billiards.', '9913d5a2-f628-11ec-b939-0242ac120002.jpg', '127 Liverpool St, Sydney NSW 2000');")
cur.execute("INSERT INTO  venues values(default, 'Sydney Entertainment Centre', 'It is one of Sydneys larger concert venues, licensed to accommodate over 13,000 people as a conventional theatre or 8,000 as a theatre-in-the-round.', '9913d872-f628-11ec-b939-0242ac120002.jpg', '35 Harbour St; Sydney NSW 2000');")
cur.execute("INSERT INTO  venues values(default, 'Potts Point Hotel, Potts Point, NSW', 'Potts Point Hotel is a new oasis of delicious in-house smoked meats and seafood, nestled in the bustling metropolitan landscape that is Potts Point.', '9913d9a8-f628-11ec-b939-0242ac120002.jpg', '33-35 Darlinghurst Rd, Potts Point NSW 2011');")
cur.execute("INSERT INTO  venues values(default, 'Sydney Cove Passenger Terminal', 'The Overseas Passenger Terminal, known officially as the Sydney Cove Passenger Terminal, is a public passenger terminal servicing cruise ships and ocean liners located in Circular Quay, Sydney, Australia.', '9913de26-f628-11ec-b939-0242ac120002.jpg', '130 Argyle St, The Rocks NSW 2000');")
cur.execute("INSERT INTO  venues values(default, 'Centennial Park Brazilian Fields', 'The Brazilian Fields in Centennial Park feature a beautiful pine forest as their backdrop to the north and Lachlan Reserve to the south.', '9913df7a-f628-11ec-b939-0242ac120002.jpg', 'Centennial Park NSW 2021');")
cur.execute("INSERT INTO  venues values(default, 'The Venue Alexandria', 'Sydney Premium Major Event Venue! State of art warehouse conversion with industrial and modern design elements across three diverse event spaces.', '9913e0a6-f628-11ec-b939-0242ac120002.jpg', '55 Doody St, Alexandria NSW 2015');")

cur.execute("INSERT INTO venue_seating values (default, 1,'general',30);")
cur.execute("INSERT INTO venue_seating values (default, 1,'front',20);")
cur.execute("INSERT INTO venue_seating values (default, 1,'middle',20);")
cur.execute("INSERT INTO venue_seating values (default, 1,'back',20);")
cur.execute("INSERT INTO venue_seating values (default, 2,'general',30);")
cur.execute("INSERT INTO venue_seating values (default, 2,'front',20);")
cur.execute("INSERT INTO venue_seating values (default, 2,'middle',20);")
cur.execute("INSERT INTO venue_seating values (default, 2,'back',20);")
cur.execute("INSERT INTO venue_seating values (default, 3,'general',30);")
cur.execute("INSERT INTO venue_seating values (default, 3,'front',20);")
cur.execute("INSERT INTO venue_seating values (default, 3,'middle',20);")
cur.execute("INSERT INTO venue_seating values (default, 3,'back',20);")
cur.execute("INSERT INTO venue_seating values (default, 4,'general',30);")
cur.execute("INSERT INTO venue_seating values (default, 4,'front',20);")
cur.execute("INSERT INTO venue_seating values (default, 4,'middle',20);")
cur.execute("INSERT INTO venue_seating values (default, 4,'back',20);")
cur.execute("INSERT INTO venue_seating values (default, 5,'general',30);")
cur.execute("INSERT INTO venue_seating values (default, 5,'front',20);")
cur.execute("INSERT INTO venue_seating values (default, 5,'middle',20);")
cur.execute("INSERT INTO venue_seating values (default, 5,'back',20);")
cur.execute("INSERT INTO venue_seating values (default, 6,'general',30);")
cur.execute("INSERT INTO venue_seating values (default, 6,'front',20);")
cur.execute("INSERT INTO venue_seating values (default, 6,'middle',20);")
cur.execute("INSERT INTO venue_seating values (default, 6,'back',20);")

cur.execute("INSERT INTO  events values(default, 1, 1, 1, 20.00, 100.00, 80.00, 60.00, 'Sydney KPOP Party', 'Music','Sydney KPOP Party BTS Special!','STRICTLY KPOP & K-HIPHOP! KPOP ALBUM GIVEAWAYS! LIVE DJS!','2022-08-25T19:00:00+10:00','2022-08-25T21:00:00+10:00','Shark Hotel Sydney, NSW','1603dfd6-efb6-11ec-8ea0-0242ac120002.jpeg','UPCOMING','Pop');")
cur.execute("INSERT INTO  events values(default, 1, 1, 2, 20.00, 120.00, 70.00, 50.00, 'Red Hot Chili Peppers Live', 'Music','RHCP Live ! Don''t miss out !', 'Catch Red Hot Chili Peppers live for the tour of their new album Unlimited Love ...', '2022-08-03T20:00:00+10:00', '2022-08-03T21:00:00+10:00','Sydney Entertainment Centre','1603dfd6-efb6-11ec-8ea0-0242ac120003.jpeg','UPCOMING','Rock,Metal');")
cur.execute("INSERT INTO  events values(default, 2, 2, 3, 10.00, 100.00, 90.00, 80.00, 'Improv Comedy Night','Arts','Lots of laughs ! Don''t miss out !','Four of Sydney''s best improv comedy teams will battle for glory. You - the audience - will decide who wins on the night!','2022-10-10T20:00:00+10:00','2022-10-10T21:00:00+10:00','Potts Point Hotel, Potts Point, NSW','1603dfd6-efb6-11ec-8ea0-0242ac120004.jpeg','UPCOMING', 'Dance,Comedy');")
cur.execute("INSERT INTO  events values(default, 2, 2, 4, 15.00, 110.00, 85.00, 55.00, 'Whisky Live Sydney 2022','Food & Drink','Sydney''s Premier Whisky Event.','WHISKY LIVE is Sydney''s premiere whisky sampling event, featuring high quality whiskies and spirits, all open under one roof for your tasting pleasure. Come along and learn while you taste.','2022-09-11T20:00:00+10:00','2022-09-11T22:00:00+10:00','Sydney Cove Passenger Terminal','b51a5319-f9ae-4191-aa95-fdf9a808e0fb.jpeg','UPCOMING','Spirits');")
cur.execute("INSERT INTO  events values(default, 3, 3, 5, 20.00, 80.00, 70.00, 50.00, 'Jump for Joy','Family & Education','Australia''s biggest inflatable park!','Jump for Joy will be back in town at Centennial Park with Australia''s biggest inflatable play-park!','2022-11-01T20:00:00+10:00','2022-11-01T22:00:00+10:00','Centennial Park Brazilian Fields','50407a37-7fce-4a17-97ba-2dbc68446db6.jpeg','UPCOMING', 'Other Family & Education');")
cur.execute("INSERT INTO  events values(default, 3, 3, 6, 20.00, 12.00, 100.00, 90.00, 'Venture & Capital 2022','Business','Come and be bored!','Everything we do is about connecting ventures with capital—this is why Wholesale Investor exists. In line with this, our 2022 Venture & Capital Conference focuses on empowering innovation, ambition, and capital.','2022-12-02T20:00:00+10:00','2022-12-02T22:00:00+10:00', 'The Venue Alexandria','39061bdb-9ace-45ed-9ddf-8b40223fc1b2.jpeg','UPCOMING','Investment');")

# Update the event table with base64 images
for filename in os.listdir(event_img_dir):
    f = os.path.join(event_img_dir, filename)

    with open(f, "rb") as image_file:
        encoded_string = 'data:image/jpeg;base64,' + \
            base64.b64encode(image_file.read()).decode()
        sql = "UPDATE events SET event_img = '{}' where event_id = {}".format(
            encoded_string, int(filename.split('.')[0]))
        cur.execute(sql)

# Update the account table with base64 images
for filename in os.listdir(account_img_dir):
    f = os.path.join(account_img_dir, filename)

    with open(f, "rb") as image_file:
        encoded_string = 'data:image/jpeg;base64,' + \
            base64.b64encode(image_file.read()).decode()
        sql = "UPDATE accounts SET profile_pic = '{}' where account_id = {}".format(
            encoded_string, int(filename.split('.')[0]))
        cur.execute(sql)


cur.execute("INSERT INTO bookings values (default, 1, 2, 'Booked', 500.0, 'Vishal', '9999333366668888', '1_1_230722011820');")
cur.execute("INSERT INTO bookings values (default, 1, 2, 'Booked', 200.0, 'Vishal', '9999333366668888', '1_1_230722011846');")

# QR-code : (Venueid-Eventid-accountid-type&number)
for t_id in range(1, 31):
    cur.execute(
        f"INSERT INTO tickets values (default, 1, 1, -1, 'G_{t_id}', 'Available', '1-1-1-G_{t_id}', 'General', 100.0);")

cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 1, 'F_1', 'Purchased', '1-1-1-F_1', 'Front', 100.0);")
cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 1, 'F_2', 'Purchased', '1-1-1-F_2', 'Front', 100.0);")
cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 1, 'F_3', 'Purchased', '1-1-1-F_3', 'Front', 100.0);")
cur.execute(
    "INSERT INTO tickets values (default, 1, 1, -1, 'F_4', 'Available', '1-1-1-F_4', 'Front', 100.0);")
for t_id in range(5, 21):
    cur.execute(
        f"INSERT INTO tickets values (default, 1, 1, -1, 'F_{t_id}', 'Available', '1-1-1-F_{t_id}', 'Front', 100.0);")

cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 1, 'M_1', 'Purchased', '1-1-1-M_1', 'Middle', 100.0);")
cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 1, 'M_2', 'Purchased', '1-1-1-M_2', 'Middle', 100.0);")
cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 2, 'M_3', 'Purchased', '1-1-1-M_3', 'Middle', 100.0);")
cur.execute(
    "INSERT INTO tickets values (default, 1, 1, 2, 'M_4', 'Purchased', '1-1-1-M_4', 'Middle', 100.0);")
for t_id in range(5, 21):
    cur.execute(
        f"INSERT INTO tickets values (default, 1, 1, -1, 'M_{t_id}', 'Available', '1-1-1-M_{t_id}', 'Middle', 100.0);")


for t_id in range(1, 21):
    cur.execute(
        f"INSERT INTO tickets values (default, 1, 1, -1, 'B_{t_id}', 'Available', '1-1-1-B_{t_id}', 'Back', 100.0);")

for v_id, e_id in [(2, 2), (3, 3), (4, 4), (5, 5), (6, 6)]:
    for t_id in range(1, 31):
        cur.execute(
            f"INSERT INTO tickets values (default, {v_id}, {e_id}, -1, 'G_{t_id}', 'Available', '1-1-1-G_{t_id}', 'General', 100.0);")

    for t_id in range(1, 21):
        cur.execute(
            f"INSERT INTO tickets values (default, {v_id}, {e_id}, -1, 'F_{t_id}', 'Available', '1-1-1-F_{t_id}', 'Front', 100.0);")

    for t_id in range(1, 21):
        cur.execute(
            f"INSERT INTO tickets values (default, {v_id}, {e_id}, -1, 'M_{t_id}', 'Available', '1-1-1-M_{t_id}', 'Middle', 100.0);")

    for t_id in range(1, 21):
        cur.execute(
            f"INSERT INTO tickets values (default, {v_id}, {e_id}, -1, 'B_{t_id}', 'Available', '1-1-1-B_{t_id}', 'Back', 100.0);")


cur.execute("INSERT INTO reviews values (default, 1, 3, 0, 4, 'Amazing Event. Highly Recommend it', '2022-08-25T21:00:00+10:00', 0, 'Active', 'Thanks for the feedback!');")
cur.execute("INSERT INTO reviews values (default, 2, 2, 0, 1, 'Poorly organised', '2022-08-26T21:00:00+10:00', 0, 'Active', '');")
cur.execute("INSERT INTO reviews values (default, 3, 3, 3, 5, 'Best event ever.', '2022-08-26T21:00:00+10:00', 0, 'Active', 'Thanks for the feedback!');")

cur.execute("INSERT INTO reviews values (default, 1, 2, 12, 4, 'Amazing Event. Highly Recommend it. I loved the event from start to finish. \
            It was a very captivating event and all the people gave their best performances.\
                It deserves many awards and recognition for its quality', '2022-08-25T21:00:00+10:00', 1, 'Active', '');")
cur.execute("INSERT INTO reviews values (default, 2, 3, 6, 1, 'Very poorly organised event. No one in the event knew what they were doing and they just kept doing nothing.\
            The management were not even a little bit concerned about the direction or quality of the event.\
                They just wanted to earn money from the people.', '2022-08-26T21:00:00+10:00', 4, 'Active', '');")
cur.execute("INSERT INTO reviews values (default, 3, 1, 2, 5, 'What a fucking disgrace of an event.', '2022-08-26T21:00:00+10:00', 2, 'Active', 'Thanks for the feedback!');")
cur.execute("INSERT INTO reviews values (default, 4, 3, 28, 2, 'This event was a total disaster. It felt like I wasted \
            the precious hours of my life. I want my money back.', '2022-08-26T21:00:00+10:00', 8, 'Active', 'Thanks for the feedback!');")
cur.execute("INSERT INTO reviews values (default, 5, 1, 10, 3, 'Best event ever.', '2022-08-26T21:00:00+10:00', 3, 'Active', 'Thanks for the feedback!');")
cur.execute("INSERT INTO reviews values (default, 6, 2, 6, 4, 'Best event ever. I really enjoyed the event. Me and my friends had a great time and we laughed a lot.\
            These were the most entertaining performances I have ever seen in my life. Everyone in the event were totally engaged in it.\
                It was money well spent.', '2022-08-26T21:00:00+10:00', 10, 'Active', 'Thanks for the feedback!');")


cur.execute("INSERT INTO interactions values (default, 1, 1, True, False);")
cur.execute("INSERT INTO interactions values (default, 2, 1, False, True);")
cur.execute("INSERT INTO interactions values (default, 2, 2, True, True);")
cur.execute("INSERT INTO interactions values (default, 3, 2, False, True);")
cur.execute("INSERT INTO interactions values (default, 3, 3, False, True);")

"""
cur.execute('SELECT account_id, email, first_name, last_name, age, mobile_no, location, \
            password, account_type, reward_points, tags, user_desc   FROM accounts')
records = cur.fetchall()
print("\nAccount details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()


cur.execute('SELECT * FROM hosts')
records = cur.fetchall()
print("\nHost details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM saved_cards')
records = cur.fetchall()
print("\nSaved card details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM venues')
records = cur.fetchall()
print("\nSaved venue details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM events')
records = cur.fetchall()
print("\nSaved event details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM venue_seating')
records = cur.fetchall()
print("\nVenue_seating details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM reviews')
records = cur.fetchall()
print("\nReview details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM interactions')
records = cur.fetchall()
print("\nInteraction details")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()
"""
print("Database has been initialized.")

cur.close()
con.close()
