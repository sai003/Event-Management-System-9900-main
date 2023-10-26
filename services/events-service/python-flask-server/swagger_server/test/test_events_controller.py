# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.event import Event  # noqa: E501
from swagger_server.models.event_list import EventList  # noqa: E501
from swagger_server.models.event_not_found_error import EventNotFoundError  # noqa: E501
from swagger_server.models.event_status_update import EventStatusUpdate  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestEventsController(BaseTestCase):
    """EventsController integration test stubs"""

    def test_create_event(self):
        """Test case for create_event

        Used to create an Event.
        """
        body = Event()
        response = self.client.open(
            '/v1/events',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_event_details(self):
        """Test case for get_event_details

        Retrieve Event details by Event ID.
        """
        response = self.client.open(
            '/v1/events/{event_id}'.format(event_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_events(self):
        """Test case for list_events

        Retrieve a List of Events. Search by Event Title, Event category or Event Description.
        """
        query_string = [('event_title', 'event_title_example'),
                        ('event_category', 'event_category_example'),
                        ('event_desc', 'event_desc_example'),
                        ('host_id', 'host_id_example'),
                        ('event_status', 'event_status_example')]
        response = self.client.open(
            '/v1/events',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_event(self):
        """Test case for update_event

        Used to update the Event details. Replaces the Event resource.
        """
        body = Event()
        response = self.client.open(
            '/v1/events/{event_id}'.format(event_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_event_status(self):
        """Test case for update_event_status

        Used to update the Status of a single Event e.g. Cancel an Event.
        """
        body = EventStatusUpdate()
        response = self.client.open(
            '/v1/events/{event_id}'.format(event_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
