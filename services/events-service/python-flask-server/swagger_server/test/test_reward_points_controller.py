# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.reward_points import RewardPoints  # noqa: E501
from swagger_server.models.reward_points_list import RewardPointsList  # noqa: E501
from swagger_server.models.reward_points_not_found_error import RewardPointsNotFoundError  # noqa: E501
from swagger_server.models.reward_points_status_update import RewardPointsStatusUpdate  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestRewardPointsController(BaseTestCase):
    """RewardPointsController integration test stubs"""

    def test_create_reward_points(self):
        """Test case for create_reward_points

        Used to create a Reward Points.
        """
        body = RewardPoints()
        response = self.client.open(
            '/v1/reward_points',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_reward_points_details(self):
        """Test case for get_reward_points_details

        Retrieve Reward Points details by Reward Points ID.
        """
        response = self.client.open(
            '/v1/reward_points/{reward_points_id}'.format(reward_points_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_reward_points(self):
        """Test case for list_reward_points

        Retrieve a List of Reward Points.
        """
        query_string = [('event_id', 'event_id_example'),
                        ('booking_id', 'booking_id_example'),
                        ('reward_points_status', 'reward_points_status_example'),
                        ('account_id', 'account_id_example')]
        response = self.client.open(
            '/v1/reward_points',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_reward_points_status(self):
        """Test case for update_reward_points_status

        Used to update the Status of a single Event e.g. Cancel an Event.
        """
        body = RewardPointsStatusUpdate()
        response = self.client.open(
            '/v1/reward_points/{reward_points_id}'.format(reward_points_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
