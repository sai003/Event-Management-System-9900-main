import connexion
import six
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 
from datetime import datetime

from swagger_server.models.booking import Booking  # noqa: E501
from swagger_server.models.booking_list import BookingList  # noqa: E501
from swagger_server.models.booking_not_found_error import BookingNotFoundError  # noqa: E501
from swagger_server.models.booking_status_update import BookingStatusUpdate  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util

port=5432 # update port of postgres running in Docker here
#host='localhost'
host='eventastic-db'

def create_booking(body):  # noqa: E501
    """Used to create a Booking.

     # noqa: E501

    :param body: Booking object containing the Booking details.
    :type body: dict | bytes

    :rtype: Booking
    """
    
    try: 
        if connexion.request.is_json:
            body = Booking.from_dict(connexion.request.get_json())  # noqa: E501

        if body.account_id == None or body.event_id == None or body.total_cost == None or body.ticket_details == None:
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="The following mandatory fields were not provided: account ID or event ID or total cost or tickets list")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        # to check at least one ticket type was provided
        if len(body.ticket_details) == 0:
            error = InvalidInputError(code=401, type="InvalidInputError", 
                    message="The following mandatory fields were not provided: tickets list")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        # to check at least one ticket type has value > 0
        status = 0
        for key in body.ticket_details:
            if body.ticket_details[key] > 0: status = 1
        if status == 0:
            error = InvalidInputError(code=402, type="InvalidInputError", 
                    message="No ticket seats were selected")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        # to check that tickets table has enough number of seats available
        for key in body.ticket_details:
            cur.execute(f"SELECT count(ticket_id) FROM tickets WHERE ticket_status = 'Available' and \
                event_id = {body.event_id} and ticket_type = '{key}' ;")
            record = cur.fetchone()
            if record[0] < body.ticket_details[key]:
                error = InvalidInputError(code=403, type="InvalidInputError", 
                        message=f"Not enough available seats for the selected type: {key}")
                return error, 400, {'Access-Control-Allow-Origin': '*'}
        
        date_string = datetime.now().strftime("%d%m%y%H%M%S")
        qr_code = str(body.account_id) + "_" + str(body.event_id) + "_" + date_string
        body.qr_code = qr_code
        body.card_name = body.card_name.replace("'", "''")

        # inserting into bookings table
        cur.execute(f"INSERT INTO bookings values (default, {body.account_id}, {body.event_id}, 'Booked', {body.total_cost}, \
            '{body.card_name}', '{body.card_number}', '{qr_code}' )\
                    RETURNING booking_id;")
        body.booking_id = cur.fetchone()[0]
        # updating corresponding ticket seats in tickets table
        for key in body.ticket_details:
            cur.execute(f"UPDATE tickets SET ticket_status='Purchased', booking_id={body.booking_id} WHERE \
                ticket_status = 'Available' and event_id = {body.event_id} and ticket_type = '{key}' \
                and ticket_id in (SELECT ticket_id FROM tickets WHERE ticket_status = 'Available' and \
                event_id = {body.event_id} and ticket_type = '{key}' ORDER BY ticket_id LIMIT {body.ticket_details[key]} ) ;")

        body.booking_status = 'Booked'
        cur.execute(f"SELECT email FROM accounts where account_id = {body.account_id}")
        body.booking_email = cur.fetchone()[0]

        tickets = dict()
        cur.execute(f"SELECT ticket_ref FROM tickets where event_id = {body.event_id} and booking_id={body.booking_id}")
        records = cur.fetchall()
        for record in records:
            tickets[str(record[0])] = 1
        body.ticket_details = tickets

        cur.close()
        con.close()            
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'} 


def get_booking_details(booking_id):  # noqa: E501
    """Retrieve Booking details by Booking ID.

     # noqa: E501

    :param booking_id: ID of the Booking to be retrieved.
    :type booking_id: int

    :rtype: Booking
    """
    try:
        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute(f"SELECT b.booking_id, b.account_id, b.event_id, b.booking_status, a.email, b.total_cost ,\
            b.card_name, b.card_number, b.qr_code, rp.reward_points_id, rp.reward_points_amount \
            FROM bookings b join accounts a on a.account_id = b.account_id \
            left join rewardpoints rp on b.booking_id = rp.booking_id where b.booking_id = {booking_id}")
        record = cur.fetchone()
        if record == None:
            error = BookingNotFoundError(code=404, type="BookingNotFoundError", 
                    message="The following Booking ID does not exist: " + str(booking_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        booking = dict()
        booking['booking_id'] = int(record[0])
        b_id = booking['booking_id']
        booking['account_id'] = int(record[1])
        booking['event_id'] = int(record[2])
        booking['booking_status'] = str(record[3])
        booking['booking_email'] = str(record[4])
        booking['total_cost'] = float(record[5])
        booking['card_name'] = str(record[6])
        booking['card_number'] = str(record[7])
        booking['qr_code'] = str(record[8])

        if record[9] == None:
            booking['reward_points_id'] = -1
            booking['reward_points'] = -1
        else:
            booking['reward_points_id'] = int(record[9])
            booking['reward_points'] = float(record[10])

        for item in booking.keys():
                if booking[item] == "None":
                    booking[item] = ""
            
        cur.execute(f"SELECT ticket_type, count(ticket_type) from tickets \
                    where booking_id = {b_id} group by booking_id, ticket_type")
        t_records = cur.fetchall()
        ticket_list = dict()
        for t_row in t_records:
            ticket_list[str(t_row[0])] = int(t_row[1])
        booking['ticket_details'] = ticket_list
                    

        cur.close()
        con.close()
        return booking, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_bookings(account_id=None, booking_status=None, event_id=None):  # noqa: E501
    """Retrieve a List of Bookings. Search by Account ID and Booking Status.

     # noqa: E501

    :param account_id: The Account ID to search for.
    :type account_id: str
    :param booking_status: The Booking Status to search for.
    :type booking_status: str

    :rtype: BookingList
    """
    try:
        if account_id == None and booking_status == None and event_id == None:
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="Please provide at least one of the mandatory fields: account id or event id or booking status")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        select_string = "SELECT b.booking_id, b.account_id, b.event_id, b.booking_status, a.email, b.total_cost, \
            b.card_name, b.card_number, b.qr_code, rp.reward_points_id, rp.reward_points_amount \
            FROM bookings b join accounts a on a.account_id = b.account_id \
            join events e on e.event_id = b.event_id left join rewardpoints rp on b.booking_id = rp.booking_id where "
        if account_id != None: select_string += f" b.account_id = {account_id} and "
        if event_id != None: select_string += f" b.event_id = {event_id} and "
        if booking_status != None: select_string += f" b.booking_status = '{booking_status}' and "
        select_string = select_string[:-4]
        select_string += " order by e.event_start_datetime asc "

        cur.execute(select_string)

        records = cur.fetchall()
        bookings_list = list()
        for record in records:
            booking = dict()
            booking['booking_id'] = int(record[0])
            b_id = booking['booking_id']
            booking['account_id'] = int(record[1])
            booking['event_id'] = int(record[2])
            booking['booking_status'] = str(record[3])
            booking['booking_email'] = str(record[4])
            booking['total_cost'] = float(record[5])
            booking['card_name'] = str(record[6])
            booking['card_number'] = str(record[7])
            booking['qr_code'] = str(record[8])
            
            if record[9] == None:
                booking['reward_points_id'] = -1
                booking['reward_points'] = -1
            else:
                booking['reward_points_id'] = int(record[9])
                booking['reward_points'] = float(record[10])

            for item in booking.keys():
                    if booking[item] == "None":
                        booking[item] = ""
            
            cur.execute(f"SELECT ticket_type, count(ticket_type) from tickets \
                    where booking_id = {b_id} group by booking_id, ticket_type")
            t_records = cur.fetchall()
            ticket_list = dict()
            for t_row in t_records:
                ticket_list[str(t_row[0])] = int(t_row[1]) 
            booking['ticket_details'] = ticket_list
                    
            bookings_list.append(booking)

        cur.close()
        con.close()
        return bookings_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_booking_status(booking_id, body):  # noqa: E501
    """Used to update the Status of a single Booking e.g. Cancel a Booking.

     # noqa: E501

    :param booking_id: ID of the Booking to be updated.
    :type booking_id: int
    :param body: The patch operation to perform. Only Booking status update is supported.
    :type body: dict | bytes

    :rtype: Booking
    """

    try:
        if connexion.request.is_json:
            body = BookingStatusUpdate.from_dict(connexion.request.get_json())  # noqa: E501

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute(f"SELECT booking_id FROM bookings where booking_id = {booking_id}")
        record = cur.fetchone()
        if record == None:
            error = BookingNotFoundError(code=404, type="BookingNotFoundError", 
                    message="The following Booking ID does not exist: " + str(booking_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        cur.execute(f"UPDATE bookings set booking_status = '{body.value}' where booking_id = {booking_id}")
        if body.value == 'Cancelled':
            cur.execute(f"UPDATE tickets set ticket_status = 'Available', booking_id = -1 where booking_id = {booking_id}")                    

        cur.close()
        con.close()
        return {"message": "Booking has been updated successfully."}, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}
