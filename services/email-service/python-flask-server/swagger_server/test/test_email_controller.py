# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.email import Email  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestEmailController(BaseTestCase):
    """EmailController integration test stubs"""

    def test_send_email(self):
        """Test case for send_email

        Used to send an Email.
        """
        body = Email()
        response = self.client.open(
            '/v1/email',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_send_email_options(self):
        """Test case for send_email_options

        Used to respond to browser with Access-Control-Allow-Methods header. Required for POST.
        """
        response = self.client.open(
            '/v1/email',
            method='OPTIONS')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
