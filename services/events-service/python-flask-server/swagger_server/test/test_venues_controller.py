# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.models.venue import Venue  # noqa: E501
from swagger_server.models.venue_list import VenueList  # noqa: E501
from swagger_server.models.venue_not_found_error import VenueNotFoundError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestVenuesController(BaseTestCase):
    """VenuesController integration test stubs"""

    def test_create_venue(self):
        """Test case for create_venue

        Used to create a Venue.
        """
        body = Venue()
        response = self.client.open(
            '/v1/venues',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_venue_details(self):
        """Test case for get_venue_details

        Retrieve Venue details by Venue ID.
        """
        response = self.client.open(
            '/v1/venues/{venue_id}'.format(venue_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_venues(self):
        """Test case for list_venues

        Retrieve a List of Venues. Search by Venue Name.
        """
        query_string = [('venue_name', 'venue_name_example')]
        response = self.client.open(
            '/v1/venues',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
