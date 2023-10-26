# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.group import Group  # noqa: E501
from swagger_server.models.group_list import GroupList  # noqa: E501
from swagger_server.models.group_member import GroupMember  # noqa: E501
from swagger_server.models.group_not_found_error import GroupNotFoundError  # noqa: E501
from swagger_server.models.group_status_update import GroupStatusUpdate  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestGroupsController(BaseTestCase):
    """GroupsController integration test stubs"""

    def test_create_group(self):
        """Test case for create_group

        Used to create an Group.
        """
        body = Group()
        response = self.client.open(
            '/v1/groups',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_create_group_member(self):
        """Test case for create_group_member

        Used to create a new Group Memeber for a Group.
        """
        body = GroupMember()
        response = self.client.open(
            '/v1/groups/{group_id}/members'.format(group_id=789),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_group_details(self):
        """Test case for get_group_details

        Retrieve Group details by Group ID.
        """
        response = self.client.open(
            '/v1/groups/{group_id}'.format(group_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_groups(self):
        """Test case for list_groups

        Retrieve a List of Groups. Search by Event ID or Account ID.
        """
        query_string = [('event_id', 'event_id_example'),
                        ('account_id', 'account_id_example')]
        response = self.client.open(
            '/v1/groups',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_group(self):
        """Test case for update_group

        Used to update the Group details. Replaces the Group resource.
        """
        body = Group()
        response = self.client.open(
            '/v1/groups/{group_id}'.format(group_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_group_member_status(self):
        """Test case for update_group_member_status

        Used to PATCH the status of a Group Membership.
        """
        body = GroupStatusUpdate()
        response = self.client.open(
            '/v1/groups/{group_id}/members/{group_membership_id}'.format(group_id=789, group_membership_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
