# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.account import Account  # noqa: E501
from swagger_server.models.account_list import AccountList  # noqa: E501
from swagger_server.models.account_not_found_error import AccountNotFoundError  # noqa: E501
from swagger_server.models.credit_card import CreditCard  # noqa: E501
from swagger_server.models.host_details import HostDetails  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.reward_points_update import RewardPointsUpdate  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestAccountsController(BaseTestCase):
    """AccountsController integration test stubs"""

    def test_create_account(self):
        """Test case for create_account

        Used to create an Account.
        """
        body = Account()
        response = self.client.open(
            '/v1/accounts',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_account_details(self):
        """Test case for get_account_details

        Retrieve Account details by Account ID.
        """
        response = self.client.open(
            '/v1/accounts/{account_id}'.format(account_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_credit_card(self):
        """Test case for get_credit_card

        Used to retrive the Credit Card details for an Account.
        """
        response = self.client.open(
            '/v1/accounts/{account_id}/credit_card'.format(account_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_host_details(self):
        """Test case for get_host_details

        Used to retrive the Host details for an Account.
        """
        response = self.client.open(
            '/v1/accounts/{account_id}/host_details'.format(account_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_accounts(self):
        """Test case for list_accounts

        Retrieve a List of Accounts. Filter by email address, first name or last name.
        """
        query_string = [('email', 'email_example'),
                        ('first_name', 'first_name_example'),
                        ('last_name', 'last_name_example')]
        response = self.client.open(
            '/v1/accounts',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_host_details(self):
        """Test case for list_host_details

        Retrieve a List of Host Details. Filter by status.
        """
        query_string = [('host_status', 'host_status_example')]
        response = self.client.open(
            '/v1/host_details',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_account(self):
        """Test case for update_account

        Used to update the Account details. Replaces the Account resource.
        """
        body = Account()
        response = self.client.open(
            '/v1/accounts/{account_id}'.format(account_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_credit_card(self):
        """Test case for update_credit_card

        Used to update the Credit Card details for an Account.
        """
        body = CreditCard()
        response = self.client.open(
            '/v1/accounts/{account_id}/credit_card'.format(account_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_host_details(self):
        """Test case for update_host_details

        Used to update the host details for an Account.
        """
        body = HostDetails()
        response = self.client.open(
            '/v1/accounts/{account_id}/host_details'.format(account_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_reward_points(self):
        """Test case for update_reward_points

        Used to update the Reward Points total for an account.
        """
        body = RewardPointsUpdate()
        response = self.client.open(
            '/v1/accounts/{account_id}'.format(account_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
