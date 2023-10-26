import connexion
import six
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from swagger_server.models.event_list import EventList
from swagger_server.models.unexpected_service_error import UnexpectedServiceError
import swagger_server.controllers.bookings_controller as bc
import swagger_server.controllers.events_controller as ec
from swagger_server import util


port = 5432
#host = 'localhost'
host='eventastic-db'
user ='postgres'
password='postgrespw'
database='eventastic'


def get_connection():
    con = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    return con


def get_recommendations(account_id, max_limit=None):
    """Retrieve Recommendations for the provided Account ID.

    :param account_id: The Account ID to retrieve recommendations for.
    :type account_id: int
    :param max_limit: The maximum number of results to be returned.
    :type max_limit: str

    :rtype: EventList
    """
    try:
        booked_events = get_booked_events(int(account_id))
        if booked_events[1] != 200:
            return booked_events

        preferences = get_user_preferences(int(account_id))
        if preferences[1] != 200:
            return preferences

        event_details = get_event_category_details()
        if event_details[1] != 200:
            return event_details

        ranked_ids = create_event_ranking(booked_events[0], preferences[0], event_details[0], max_limit)

        ranked_events = get_recommendation_list(ranked_ids)
        if ranked_events[1] != 200:
            return ranked_events
        
        return ranked_events[0], 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_booked_events(account_id):
    """Retrieve a list of Event IDs for Evets that have been booked by the account_id.

    :type account_id: int

    :rtype: List
    """
    # retrieve all bookings for the provided account_id
    bookings = bc.list_bookings(account_id=account_id, booking_status=None, event_id=None)

    # if there is an error, return the error
    if bookings[1] != 200:
        return bookings
      
    # filter out Cancelled Bookings
    EventIdList = []
    for booking in bookings[0]:
        if booking['booking_status'] != 'Cancelled':
            EventIdList.append(booking['event_id'])

    return list(set(EventIdList)), 200


def get_user_preferences(account_id):
    """Retrieve a list of User Preferences from their Account.

    :type account_id: int

    :rtype: List
    """
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT * FROM accounts WHERE account_id = ' + str(account_id))
        record = cur.fetchone()
        if record:
            preferences = record[11].split(',')
            con.close()
            return preferences, 200
        else:
            return "Account Not Found", 404

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_event_category_details():
    """Retrieve a list containing the Event Category and Tag Details for each event.

    :rtype: List
    """
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT event_id, event_category, tags FROM events')
        records = cur.fetchall()

        EventList = []
        for r in records:
            tmp = (r[0], r[1], r[2].split(','))
            EventList.append(tmp)
        con.close()

        return EventList, 200

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}   


def create_event_ranking(booked_events, preferences, event_details, max_limit):
    """Creates a List of Event IDs, ranked by importance

    :rtype: List
    """
    # result dict stores the scores for each Event
    result_dict = {}
    for event in event_details:
        result_dict[event[0]] = 0

    # Get the categories for previously booked Events
    user_categories = list(set([e[1] for e in event_details if e[0] in booked_events]))
    # find other Events with Matching Categories
    matching_categories = list(filter(lambda event: event[1] in user_categories, event_details))
    # Give a point to each Event that matches the categories from User Bookings
    for c in matching_categories:
        tmp = result_dict[c[0]] + 1
        result_dict[c[0]] = tmp

    # Give a point to each Event that matches the users Tag preferences
    for p in preferences:
        for e in event_details:
            if p in e[2]:
                tmp = result_dict[e[0]] + 1
                result_dict[e[0]] = tmp           
    
    # filter out prevous bookings
    resultList = list(filter(lambda event: event[0] not in booked_events, result_dict.items()))
    # sort the List
    resultList.sort(key = lambda x: x[1], reverse=True)
    if (max_limit):
        return resultList[:int(max_limit)]
    else: 
        return resultList


def get_recommendation_list(event_ids):
    """Creates a List of Events for the provided event_id list

    :rtype: List
    """
    EventList = []
    for id in event_ids:
        event = ec.get_event_details(id[0])
        if event[1] != 200:
            return event
        else:
            EventList.append(event[0])
    return EventList, 200