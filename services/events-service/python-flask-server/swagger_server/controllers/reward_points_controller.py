import connexion
import six
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.reward_points import RewardPoints  # noqa: E501
from swagger_server.models.reward_points_list import RewardPointsList  # noqa: E501
from swagger_server.models.reward_points_not_found_error import RewardPointsNotFoundError  # noqa: E501
from swagger_server.models.reward_points_status_update import RewardPointsStatusUpdate  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util

port=5432 # update port of postgres running in Docker here
#host='localhost'
host='eventastic-db'

def create_reward_points(body):  # noqa: E501
    """Used to create a Reward Points.

     # noqa: E501

    :param body: Reward Points object containing the Reward Points details.
    :type body: dict | bytes

    :rtype: RewardPoints
    """    
    try: 
        if connexion.request.is_json:
            body = RewardPoints.from_dict(connexion.request.get_json())  # noqa: E501

        if (body.account_id == None or body.event_id == None or body.booking_id == None or body.reward_points_amount == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="The following mandatory fields were not provided: account ID or event ID or booking ID or amount")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        if (body.reward_points_status == None):
            body.reward_points_status = 'Pending'

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        insert_string = "INSERT INTO rewardpoints VALUES (default, %s,%s,%s,%s,%s) RETURNING reward_points_id;"
        cur.execute(insert_string, (body.account_id, body.event_id, body.booking_id, body.reward_points_amount, \
            body.reward_points_status ))
        body.reward_points_id = cur.fetchone()[0]

        cur.close()
        con.close()            
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_reward_points_details(reward_points_id):  # noqa: E501
    """Retrieve Reward Points details by Reward Points ID.

     # noqa: E501

    :param reward_points_id: ID of the Reward Points to be retrieved.
    :type reward_points_id: int

    :rtype: RewardPoints
    """
    try:

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        select_string = f"SELECT * FROM rewardpoints where reward_points_id = {reward_points_id} "
        cur.execute(select_string)

        record = cur.fetchone()
        if record != None:
            booking = dict()
            booking['reward_points_id'] = int(record[0])
            booking['account_id'] = int(record[1])
            booking['event_id'] = int(record[2])
            booking['booking_id'] = int(record[3])
            booking['reward_points_amount'] = float(record[4])
            booking['reward_points_status'] = str(record[5])

            for item in booking.keys():
                    if booking[item] == "None":
                        booking[item] = ""   
        else:
            error = RewardPointsNotFoundError(code=404, type="RewardPointsNotFoundError", 
                        message="The following Reward Points ID does not exist: " + str(reward_points_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}         
                    

        cur.close()
        con.close()
        return booking, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_reward_points(event_id=None, booking_id=None, reward_points_status=None, account_id=None):  # noqa: E501
    """Retrieve a List of Reward Points.

     # noqa: E501

    :param event_id: The Event ID to search for.
    :type event_id: str
    :param booking_id: The Booking ID to search for.
    :type booking_id: str
    :param reward_points_status: The Reward Points Status to search for.
    :type reward_points_status: str

    :rtype: RewardPointsList
    """
    try:

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        select_string = "SELECT * FROM rewardpoints"
        if event_id != None or booking_id != None or reward_points_status != None or account_id != None: select_string += " where"

        if event_id != None: select_string += f" event_id = {event_id} and "
        if account_id != None: select_string += f" account_id = {account_id} and "
        if booking_id != None: select_string += f" booking_id = {booking_id} and "
        if reward_points_status != None: select_string += f" reward_points_status  = '{reward_points_status}' and "
        
        if event_id != None or booking_id != None or reward_points_status != None or account_id != None: select_string = select_string[:-4]

        cur.execute(select_string)

        records = cur.fetchall()
        bookings_list = list()
        for record in records:
            booking = dict()
            booking['reward_points_id'] = int(record[0])
            booking['account_id'] = int(record[1])
            booking['event_id'] = int(record[2])
            booking['booking_id'] = int(record[3])
            booking['reward_points_amount'] = float(record[4])
            booking['reward_points_status'] = str(record[5])

            for item in booking.keys():
                    if booking[item] == "None":
                        booking[item] = ""            
                    
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


def update_reward_points_status(reward_points_id, body):  # noqa: E501
    """Used to update the Status of a single Event e.g. Cancel an Event.

     # noqa: E501

    :param reward_points_id: ID of the Reward Points to be updated.
    :type reward_points_id: int
    :param body: The patch operation to perform. Only Reward Points status update is supported.
    :type body: dict | bytes

    :rtype: RewardPoints
    """
    
    try:
        if connexion.request.is_json:
            body = RewardPointsStatusUpdate.from_dict(connexion.request.get_json())  # noqa: E501

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute(f"SELECT reward_points_id FROM rewardpoints where reward_points_id = {reward_points_id}")
        record = cur.fetchone()
        if record == None:
            error = RewardPointsNotFoundError(code=404, type="RewardPointsNotFoundError", 
                        message="The following Reward Points ID does not exist: " + str(reward_points_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}   

        cur.execute(f"UPDATE rewardpoints set reward_points_status = '{body.value}' where reward_points_id = {reward_points_id}")                 

        cur.close()
        con.close()
        return {"message": "Reward Points status has been updated successfully."}, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}
