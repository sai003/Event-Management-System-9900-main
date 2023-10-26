# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.review import Review  # noqa: E501
from swagger_server.models.review_interaction import ReviewInteraction  # noqa: E501
from swagger_server.models.review_interaction_not_found_error import ReviewInteractionNotFoundError  # noqa: E501
from swagger_server.models.review_list import ReviewList  # noqa: E501
from swagger_server.models.review_not_found_error import ReviewNotFoundError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestReviewsController(BaseTestCase):
    """ReviewsController integration test stubs"""

    def test_create_review(self):
        """Test case for create_review

        Used to create a Review.
        """
        body = Review()
        response = self.client.open(
            '/v1/reviews',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_create_review_interaction(self):
        """Test case for create_review_interaction

        Used to create a Review Intercation record.
        """
        body = ReviewInteraction()
        response = self.client.open(
            '/v1/review_interaction',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_list_reviews(self):
        """Test case for list_reviews

        Retrieve a List of Reviews. Search by Event ID and Interaction Account ID.
        """
        query_string = [('event_id', 'event_id_example'),
                        ('interaction_acount_id', 'interaction_acount_id_example')]
        response = self.client.open(
            '/v1/reviews',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_review(self):
        """Test case for update_review

        Used to update a Review. Replaces the Review resource.
        """
        body = Review()
        response = self.client.open(
            '/v1/reviews/{review_id}'.format(review_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_review_interaction(self):
        """Test case for update_review_interaction

        Used to update a Review Interaction record.
        """
        body = ReviewInteraction()
        response = self.client.open(
            '/v1/review_interaction/{interaction_id}'.format(interaction_id=789),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
