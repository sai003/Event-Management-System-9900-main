import connexion
import six
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from swagger_server.models.event import Event  # noqa: E501
from swagger_server.models.event_list import EventList  # noqa: E501
from swagger_server.models.event_status_update import EventStatusUpdate
from swagger_server.models.event_not_found_error import EventNotFoundError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server import util

port = 5432  # Change according to port in Docker
#host = 'localhost'
host = 'eventastic-db'

_update_allow_list = ["event_title", "event_category",
                      "event_short_desc", "event_desc", "event_img", "tags", "event_location"]


def create_event(body):  # noqa: E501
    """Used to create an Event.
     # noqa: E501
    :param body: Event object containing the Event details.
    :type body: dict | bytes
    :rtype: Event
    """
    try:
        if connexion.request.is_json:
            body = Event.from_dict(connexion.request.get_json())  # noqa: E501

        if (len(str(body.account_id)) == 0 or len(str(body.host_id)) == 0 or len(str(body.venue_id)) == 0):
            error = InvalidInputError(code=400, type="InvalidInputError",
                                      message="The following mandatory fields were not provided: Account ID or Host ID or Venue ID")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        if body.tags is None:
            tags_string = ""
        else:
            tags_string = ""
            if body.tags:
                tag_length = len(body.tags)
                i = 0
                for tag in body.tags:
                    if i < tag_length-1:
                        tags_string = tags_string + tag.name + ','
                    else:
                        tags_string = tags_string + tag.name
                    i += 1

        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        if body.event_id != None:
            cur.execute("SELECT * FROM events where event_id = '" +
                        str(body.event_id)+"';")
            record = cur.fetchone()
            if record != None:
                error = InvalidInputError(code=409, type="InvalidInputError",
                                          message="The provided event already exists in database.")
                cur.close()
                con.close()
                return error, 400, {'Access-Control-Allow-Origin': '*'}

        insert_string = "INSERT INTO events VALUES (default, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING event_id;"
        cur.execute(insert_string, (body.host_id, body.account_id, body.venue_id, body.gen_seat_price,
                                    body.front_seat_price, body.mid_seat_price, body.back_seat_price, body.event_title, body.event_category,
                                    body.event_short_desc, body.event_desc, body.event_start_datetime, body.event_end_datetime, body.event_location,
                                    body.event_img, body.event_status, tags_string))
        body.event_id = cur.fetchone()[0]
        #print("New ID is:\n")
        # print(body.event_id)

        if body.gen_seat_price != -1:
            cur.execute(
                f"select seating_number from venue_seating where seating_type='general' and venue_id={body.venue_id}")
            gen_seats = cur.fetchone()[0]
            for i in range(1, gen_seats+1):
                qr = str(body.venue_id)+"-"+str(body.event_id) + \
                    "-"+str(body.account_id)+"-G_"+str(i)
                cur.execute(
                    f"INSERT INTO tickets values (default, {body.venue_id}, {body.event_id}, -1, 'G_{i}', 'Available', '{qr}', 'General', {body.gen_seat_price});")

        if body.front_seat_price != -1:
            cur.execute(
                f"select seating_number from venue_seating where seating_type='front' and venue_id={body.venue_id}")
            front_seats = cur.fetchone()[0]
            for i in range(1, front_seats+1):
                qr = str(body.venue_id)+"-"+str(body.event_id) + \
                    "-"+str(body.account_id)+"-F_"+str(i)
                cur.execute(
                    f"INSERT INTO tickets values (default, {body.venue_id}, {body.event_id}, -1, 'F_{i}', 'Available', '{qr}', 'Front', {body.front_seat_price});")

        if body.mid_seat_price != -1:
            cur.execute(
                f"select seating_number from venue_seating where seating_type='middle' and venue_id={body.venue_id}")
            middle_seats = cur.fetchone()[0]
            for i in range(1, middle_seats+1):
                qr = str(body.venue_id)+"-"+str(body.event_id) + \
                    "-"+str(body.account_id)+"-M_"+str(i)
                cur.execute(
                    f"INSERT INTO tickets values (default, {body.venue_id}, {body.event_id}, -1, 'M_{i}', 'Available', '{qr}', 'Middle', {body.mid_seat_price});")

        if body.back_seat_price != -1:
            cur.execute(
                f"select seating_number from venue_seating where seating_type='back' and venue_id={body.venue_id}")
            back_seats = cur.fetchone()[0]
            for i in range(1, back_seats+1):
                qr = str(body.venue_id)+"-"+str(body.event_id) + \
                    "-"+str(body.account_id)+"-B_"+str(i)
                cur.execute(
                    f"INSERT INTO tickets values (default, {body.venue_id}, {body.event_id}, -1, 'B_{i}', 'Available', '{qr}', 'Back', {body.back_seat_price});")

        cur.close()
        con.close()
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def create_event_options():  # noqa: E501
    """Used to respond to browser with Access-Control-Allow-Methods header. Required for POST.
     # noqa: E501
    :rtype: None
    """
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }
    return None, 200, response_headers


def get_event_details(event_id):  # noqa: E501
    """Retrieve Event details by Event ID.
     # noqa: E501
    :param event_id: ID of the Event to be retrieved.
    :type event_id: int
    :rtype: Event
    """

    try:
        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        cur.execute('SELECT * FROM events where event_id = ' + str(event_id))
        record = cur.fetchone()
        if record != None:
            event = dict()
            event['event_id'] = str(record[0])
            event['host_id'] = str(record[1])
            event['account_id'] = str(record[2])
            event['venue_id'] = str(record[3])
            event['gen_seat_price'] = str(record[4])
            event['front_seat_price'] = str(record[5])
            event['mid_seat_price'] = str(record[6])
            event['back_seat_price'] = str(record[7])
            event['event_title'] = str(record[8])
            event['event_category'] = str(record[9])
            event['event_short_desc'] = str(record[10])
            event['event_desc'] = str(record[11])
            event['event_start_datetime'] = str(record[12])
            event['event_end_datetime'] = str(record[13])
            event['event_location'] = str(record[14])
            event['event_img'] = str(record[15])
            event['event_status'] = str(record[16])
            tags = str(record[17]).split(',')
            tags_list = list()
            for t in tags:
                tags_list.append({"name": str(t)})
            event['tags'] = tags_list
        else:
            error = EventNotFoundError(
                code=404, type="EventNotFoundError",
                message="The following Event ID does not exist: " + str(event_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        cur.close()
        con.close()
        return event, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        cur.close()
        con.close()
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_events(event_title=None, event_category=None, event_desc=None, host_id=None, event_status=None):  # noqa: E501
    """Retrieve a List of Events. Search by Event Title, Event category or Event Description.
     # noqa: E501
    :param event_title: The Event Title to search for.
    :type event_title: str
    :param event_category: The Event Category to search for.
    :type event_category: str
    :param event_desc: The Event Description to search for.
    :type event_desc: str
    :rtype: EventList
    """

    try:
        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        if (event_title != None and event_desc != None and event_category != None):
            cur.execute("SELECT * FROM events where event_title ~* '"+str(event_title)+"' and event_desc ~* '" +
                        str(event_desc)+"' and event_category ~* '"+str(event_category)+"';")  # all 3
        elif (event_title != None and event_desc != None):
            cur.execute("SELECT * FROM events where event_title ~* '"+str(event_title) +
                        "' and event_desc ~* '"+str(event_desc)+"';")  # title and desc
        elif (event_title != None and event_category != None):
            cur.execute("SELECT * FROM events where event_title ~* '"+str(event_title) +
                        "' and event_category ~* '"+str(event_category)+"';")  # title and category
        elif (event_desc != None and event_category != None):
            cur.execute("SELECT * FROM events where event_desc ~* '"+str(event_desc) +
                        "' and event_category ~* '"+str(event_category)+"';")  # desc and category
        elif (event_title != None):
            cur.execute("SELECT * FROM events where event_title ~* '" +
                        str(event_title)+"';")  # only event title
        elif (event_category != None):
            cur.execute("SELECT * FROM events where event_category ~* '" +
                        str(event_category)+"';")  # only event category
        elif (event_desc != None):
            cur.execute("SELECT * FROM events where event_desc ~* '" +
                        str(event_desc)+"';")  # only event desc
        elif (host_id != None and event_status != None):
            cur.execute("SELECT * FROM events where host_id = '"+str(host_id) +
                        "' and event_status ~* '"+str(event_status)+"';")  # host id and event status
        elif (host_id != None):
            cur.execute("SELECT * FROM events where host_id = '" +
                        str(host_id)+"';")  # only host id
        elif (event_status != None):
            cur.execute("SELECT * FROM events where event_status ~* '" +
                        str(event_status)+"';")  # only event status
        else:
            cur.execute("SELECT * FROM events")

        records = cur.fetchall()

        events = []
        for record in records:
            if record != None:
                event = dict()
                event['event_id'] = str(record[0])
                event['host_id'] = str(record[1])
                event['account_id'] = str(record[2])
                event['venue_id'] = str(record[3])
                event['gen_seat_price'] = str(record[4])
                event['front_seat_price'] = str(record[5])
                event['mid_seat_price'] = str(record[6])
                event['back_seat_price'] = str(record[7])

                event['event_title'] = str(record[8])
                event['event_category'] = str(record[9])
                event['event_short_desc'] = str(record[10])
                event['event_desc'] = str(record[11])
                event['event_start_datetime'] = str(record[12])
                event['event_end_datetime'] = str(record[13])
                event['event_location'] = str(record[14])
                event['event_img'] = str(record[15])
                event['event_status'] = str(record[16])
                tags = str(record[17]).split(',')
                tags_list = list()
                for t in tags:
                    tags_list.append({"name": str(t)})
                event['tags'] = tags_list
                events.append(event)

        cur.close()
        con.close()
        return events, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        cur.close()
        con.close()
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_event(event_id, body):  # noqa: E501
    """Used to update the Event details. Replaces the Event resource.
     # noqa: E501
    :param event_id: ID of the Event to be updated.
    :type event_id: int
    :param body: Event object to update. Performs a complete replace of the Event details.
    :type body: dict | bytes
    :rtype: Event
    """
    if connexion.request.is_json:
        body = Event.from_dict(connexion.request.get_json())

    # check if Event Exists
    check = get_event_details(event_id)
    # if error code is not 200 OK, return error
    if check[1] != 200:
        return check

    try:
        # Create the sql update statement
        sql = "UPDATE events SET"
        for attr, value in body.__dict__.items():
            tmp_attr = attr[1:]
            if tmp_attr in _update_allow_list and value:
                if tmp_attr == "tags":
                    value = formatTags(value)
                sql = sql + \
                    " {} = '{}',".format(tmp_attr, value.replace("'", "''"))
        sql = sql[:-1] + " WHERE event_id = {}".format(event_id)

        # Execute the sql update statement
        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        cur.execute(sql)
        cur.close()
        con.close()
    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        cur.close()
        con.close()
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}

    # return the updated record
    result = get_event_details(event_id)
    return result


def update_event_options(event_id):  # noqa: E501
    """Used to respond to browser with Access-Control-Allow-Methods header. Required for PUT.
     # noqa: E501
    :param event_id: ID of the Event to be updated.
    :type event_id: int
    :rtype: None
    """
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }
    return None, 200, response_headers


def update_event_status(event_id, body):  # noqa: E501
    """Used to update the Status of a single Event e.g. Cancel an Event.
     # noqa: E501
    :param event_id: ID of the Event to be updated.
    :type event_id: int
    :param body: The patch operation to perform. Only Event status update is supported.
    :type body: dict | bytes
    :rtype: Event
    """
    try:
        if connexion.request.is_json:
            body = EventStatusUpdate.from_dict(connexion.request.get_json())  # noqa: E501

        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        if (len(str(body.value)) == 0):
            error = InvalidInputError(code=400, type="InvalidInputError",
                                      message="The following mandatory fields were not provided: event-status value")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        # to check if the event id exists or not
        cur.execute('SELECT * FROM events where event_id = ' + str(event_id))
        record = cur.fetchone()
        if record == None:
            error = EventNotFoundError(code=404, type="EventNotFoundError",
                                       message="The following Event ID does not exist: " + str(event_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        # Perform Update
        cur.execute(
            f"UPDATE events set event_status='{body.value}' where event_id = {event_id} RETURNING event_id; ")
        event_id = cur.fetchone()[0]

        if body.value == 'Cancelled':
            cur.execute(
                f"SELECT booking_id FROM bookings where event_id = {event_id} and booking_status= 'Booked' ")
            records = cur.fetchall()
            if len(records) > 0:
                for booking in records:
                    cur.execute(
                        f"UPDATE bookings set booking_status = 'Cancelled' where booking_id = {booking[0]}")

            cur.execute(
                f"SELECT booking_id FROM rewardpoints where event_id = {event_id} and reward_points_status= 'Pending' ")
            records = cur.fetchall()
            if len(records) > 0:
                for booking in records:
                    cur.execute(
                        f"UPDATE rewardpoints set reward_points_status = 'Cancelled' where booking_id = {booking[0]}")

        cur.close()
        con.close()
        return body, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


# Transforms the JSON tag array into tag1, tag2, tag3 etc..
def formatTags(tags):
    formatted = ""
    for tag in tags:
        formatted = formatted + tag.name + ","
    return formatted[:-1]
