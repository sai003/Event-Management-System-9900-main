# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.booking import Booking  # noqa: E501
from swagger_server.models.booking_list import BookingList  # noqa: E501
from swagger_server.models.booking_not_found_error import BookingNotFoundError  # noqa: E501
from swagger_server.models.booking_status_update import BookingStatusUpdate  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestBookingsController(BaseTestCase):
    """BookingsController integration test stubs"""

    def test_create_booking(self):
        """Test case for create_booking

        Used to create a Booking.
        """
        body = Booking()
        response = self.client.open(
            '/v1/bookings',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_booking_details(self):
        """Test case for get_booking_details

        Retrieve Booking details by Booking ID.
        """
        response = self.client.open(
            '/v1/bookings/{booking_id}'.format(booking_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_bookings(self):
        """Test case for list_bookings

        Retrieve a List of Bookings. Search by Account ID and Booking Status.
        """
        query_string = [('account_id', 'account_id_example'),
                        ('booking_status', 'booking_status_example'),
                        ('event_id', 'event_id_example')]
        response = self.client.open(
            '/v1/bookings',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_booking_status(self):
        """Test case for update_booking_status

        Used to update the Status of a single Booking e.g. Cancel a Booking.
        """
        body = BookingStatusUpdate()
        response = self.client.open(
            '/v1/bookings/{booking_id}'.format(booking_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
