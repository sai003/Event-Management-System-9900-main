# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.ticket_list import TicketList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestTicketsController(BaseTestCase):
    """TicketsController integration test stubs"""

    def test_list_tickets(self):
        """Test case for list_tickets

        Retrieve a List of Tickets. Search by Event ID and Ticket Status.
        """
        query_string = [('event_id', 'event_id_example'),
                        ('ticket_status', 'ticket_status_example'),
                        ('booking_id', 'booking_id_example')]
        response = self.client.open(
            '/v1/tickets',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
