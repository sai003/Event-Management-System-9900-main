import connexion
import six
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from swagger_server.models.ticket_list import TicketList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util

port = 5432  # Change according to port in Docker
#host = 'localhost'
host='eventastic-db'

def list_tickets(event_id=None, ticket_status=None, booking_id=None):  # noqa: E501
    """Retrieve a List of Tickets. Search by Event ID and Ticket Status.

     # noqa: E501

    :param event_id: The Event ID to search for.
    :type event_id: str
    :param ticket_status: The Ticket Status to search for.
    :type ticket_status: str
    :param booking_id: The Booking ID to search for.
    :type booking_id: str

    :rtype: TicketList
    """
    try:
        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        if (event_id == None and ticket_status == None and booking_id == None):
            ticket_status = 'Available'

      
        select = "SELECT * FROM tickets where "
        if event_id != None: select += f" event_id = {event_id} and "
        if booking_id != None: select += f" booking_id = {booking_id} and "
        if ticket_status != None: select += f" ticket_status = '{ticket_status}' and "
        select = select[:-4]
        cur.execute(select)

        tickets_list = list()

        records = cur.fetchall()
        if len(records) != 0:
            for record in records:
                ticket = dict()
                ticket['ticket_id'] = int(record[0])
                ticket['venue_id'] = int(record[1])
                ticket['event_id'] = int(record[2])
                ticket['booking_id'] = int(record[3])

                ticket['ticket_ref'] = str(record[4])
                ticket['ticket_status'] = str(record[5])
                ticket['qr_code'] = str(record[6])
                ticket['ticket_type'] = str(record[7]) 
                ticket['ticket_price'] = float(record[8]) 

                for item in ticket.keys():
                    if ticket[item] == "None":
                        ticket[item] = "" 

                tickets_list.append(ticket)

        cur.close()
        con.close()
        return tickets_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}
