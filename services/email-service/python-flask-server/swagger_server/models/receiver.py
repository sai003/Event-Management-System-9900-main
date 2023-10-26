# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class Receiver(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """

    def __init__(self, email_address: str=None, name: str=None):  # noqa: E501
        """Receiver - a model defined in Swagger

        :param email_address: The email_address of this Receiver.  # noqa: E501
        :type email_address: str
        :param name: The name of this Receiver.  # noqa: E501
        :type name: str
        """
        self.swagger_types = {
            'email_address': str,
            'name': str
        }

        self.attribute_map = {
            'email_address': 'email_address',
            'name': 'name'
        }

        self._email_address = email_address
        self._name = name

    @classmethod
    def from_dict(cls, dikt) -> 'Receiver':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Receiver of this Receiver.  # noqa: E501
        :rtype: Receiver
        """
        return util.deserialize_model(dikt, cls)

    @property
    def email_address(self) -> str:
        """Gets the email_address of this Receiver.


        :return: The email_address of this Receiver.
        :rtype: str
        """
        return self._email_address

    @email_address.setter
    def email_address(self, email_address: str):
        """Sets the email_address of this Receiver.


        :param email_address: The email_address of this Receiver.
        :type email_address: str
        """

        self._email_address = email_address

    @property
    def name(self) -> str:
        """Gets the name of this Receiver.


        :return: The name of this Receiver.
        :rtype: str
        """
        return self._name

    @name.setter
    def name(self, name: str):
        """Sets the name of this Receiver.


        :param name: The name of this Receiver.
        :type name: str
        """

        self._name = name