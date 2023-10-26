import connexion
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.models.venue import Venue  # noqa: E501
from swagger_server.models.venue_list import VenueList  # noqa: E501
from swagger_server.models.venue_not_found_error import VenueNotFoundError  # noqa: E501
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from werkzeug.utils import secure_filename

port = 5432
#host='localhost'
host='eventastic-db'

def create_venue(body):  # noqa: E501
    """Used to create a Venue.

     # noqa: E501

    :param body: Venue object containing Venue details.
    :type body: dict | bytes

    :rtype: Venue
    """
    try:
        if connexion.request.is_json:
            body = Venue.from_dict(connexion.request.get_json())  # noqa: E501

        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        # print(body)
        insert_string = "INSERT INTO venues VALUES (default, %s,%s,%s,%s) RETURNING venue_id;"
        cur.execute(insert_string, (body.venue_name, body.venue_desc,
                                    body.venue_img, body.venue_address))
        body.venue_id = cur.fetchone()[0]

        for seating in body.seating:
            cur.execute(
                f"INSERT INTO venue_seating values (default,{body.venue_id},'{seating.seating_type}',{seating.seating_number});")

        return body, 201, {'Access-Control-Allow-Origin': '*'}
    except Exception as err:
        cur.close()
        con.close()
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(err))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_venue_details(venue_id):  # noqa: E501
    """Retrieve Venue details by Venue ID.

     # noqa: E501

    :param venue_id: ID of the Venue to be retrieved.
    :type venue_id: int

    :rtype: Venue
    """
    try:
        # attempt to get Venue from the store/database
        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        cur.execute(f"select * from venues where venue_id={venue_id}")
        venue = cur.fetchone()
        if venue == None:
            # return 401 if error if Venue does not exist
            cur.close()
            con.close()
            return VenueNotFoundError(
                code=401, type="VenueNotFoundError",
                message="The following Venue does not exist: " + str(venue_id)), 401, {'Access-Control-Allow-Origin': '*'}

        cur.execute(
            f"select seating_type, seating_number from venue_seating where venue_id={venue_id}")
        venue_seatings = cur.fetchall()
        for i in range(len(venue_seatings)):
            seat_record = venue_seatings[i]
            venue_seatings[i] = {
                'seating_type': seat_record[0], 'seating_number': seat_record[1]}

        venue = {'seating': venue_seatings, 'venue_id': venue[0], 'venue_name': venue[1],
                 'venue_desc': venue[2], 'venue_img': venue[3], 'venue_address': venue[4]}

        cur.close()
        con.close()

        # If successful, return the Venue object
        return venue, 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        cur.close()
        con.close()
        # catch any unexpected runtime error and return as 500 error
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_venues(venue_name=None):  # noqa: E501
    """Retrieve a List of Venues. Search by Venue Name.

     # noqa: E501

    :param venue_name: The Venue Name to search for.
    :type venue_name: str

    :rtype: VenueList
    """
    try:
        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute("select * from venues")
        venue_list = cur.fetchall()

        for j in range(len(venue_list)):
            cur.execute(
                f"select seating_type, seating_number from venue_seating where venue_id={venue_list[j][0]}")
            venue_seatings = cur.fetchall()
            for i in range(len(venue_seatings)):
                seat_record = venue_seatings[i]
                venue_seatings[i] = {
                    'seating_type': seat_record[0], 'seating_number': seat_record[1]}
            venue_list[j] = {'seating': venue_seatings, 'venue_id': venue_list[j][0], 'venue_name': venue_list[j]
                             [1], 'venue_desc': venue_list[j][2], 'venue_img': venue_list[j][3], 'venue_address': venue_list[j][4]}

        # filter the list of venues by venue name
        if venue_name:
            filtered = list(filter(lambda venue: venue_name.lower()
                            in venue['venue_name'].lower(), venue_list))
            return filtered, 200, {'Access-Control-Allow-Origin': '*'}

        # otherwise, just return the unfiltered list of Venues
        return venue_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        cur.close()
        con.close()
        # catch any unexpected runtime error and return as 500 error
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}
