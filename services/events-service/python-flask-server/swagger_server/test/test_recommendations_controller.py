# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.event_list import EventList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestRecommendationsController(BaseTestCase):
    """RecommendationsController integration test stubs"""

    def test_get_recommendations(self):
        """Test case for get_recommendations

        Retrieve Recommendations for the provided Account ID.
        """
        query_string = [('max_limit', 'max_limit_example')]
        response = self.client.open(
            '/v1/recommendations/{account_id}'.format(account_id=789),
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
