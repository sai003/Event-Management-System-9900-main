import psycopg2
import base64
import os
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import datetime


port = 5432
host = "localhost"
user = "postgres"
password = "postgrespw"
database = 'eventastic'
event_img_dir = './test_img/event'
account_img_dir = './test_img/account'

con = psycopg2.connect(database=database, user=user,
                       password=password, host=host, port=port)
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = con.cursor()

cur.execute("SELECT * FROM events where event_status='UPCOMING';")
CurrentDate = datetime.datetime.now()
CurrentDate = CurrentDate.replace(year=CurrentDate.year + 1)
records = cur.fetchall()
for row in records:
    end_time = row[13][:-6]
    end_time = datetime.datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S')
    event_id = row[0]
    start_time = row[12][:-6]
    start_time = datetime.datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S')
    event_name = row[8]
    if CurrentDate > start_time:
        cur.execute(
            f"Update bookings SET booking_status='Completed' where event_id={event_id} and booking_status='Booked';")
        if CurrentDate > end_time:
            cur.execute(
                f"Update events SET event_status='COMPLETED' where event_id={event_id};")
            cur.execute(
                f"Select * from rewardpoints where event_id={event_id};")
            rewards = cur.fetchall()
            print(f"Event:{event_name} is completed")
            for reward in rewards:
                reward_id = reward[0]
                account_id = reward[1]
                cur.execute(
                    f"Select reward_points from accounts where account_id={account_id}")
                prev_reward_point = float(cur.fetchall()[0][0])
                cur.execute(
                    f"Update rewardpoints SET reward_points_status='Approved' where reward_points_id={reward_id}")
                cur.execute(
                    f"Select reward_points_amount from rewardpoints where reward_points_id={reward_id}")
                new_reward_points = prev_reward_point + \
                    float(cur.fetchall()[0][0])
                cur.execute(
                    f"Update accounts SET reward_points={new_reward_points} where account_id={account_id}")
                print(
                    f"\tAccount-id:{account_id} ==> Previous Reward Points:{prev_reward_point} Current Reward Points:{new_reward_points}")


cur.close()
con.close()
