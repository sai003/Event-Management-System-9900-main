# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class Ticket(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """

    def __init__(self, ticket_id: int=None, venue_id: int=None, event_id: int=None, booking_id: int=None, ticket_ref: str=None, ticket_status: str=None, qr_code: str=None, ticket_type: str=None, ticket_price: float=None):  # noqa: E501
        """Ticket - a model defined in Swagger

        :param ticket_id: The ticket_id of this Ticket.  # noqa: E501
        :type ticket_id: int
        :param venue_id: The venue_id of this Ticket.  # noqa: E501
        :type venue_id: int
        :param event_id: The event_id of this Ticket.  # noqa: E501
        :type event_id: int
        :param booking_id: The booking_id of this Ticket.  # noqa: E501
        :type booking_id: int
        :param ticket_ref: The ticket_ref of this Ticket.  # noqa: E501
        :type ticket_ref: str
        :param ticket_status: The ticket_status of this Ticket.  # noqa: E501
        :type ticket_status: str
        :param qr_code: The qr_code of this Ticket.  # noqa: E501
        :type qr_code: str
        :param ticket_type: The ticket_type of this Ticket.  # noqa: E501
        :type ticket_type: str
        :param ticket_price: The ticket_price of this Ticket.  # noqa: E501
        :type ticket_price: float
        """
        self.swagger_types = {
            'ticket_id': int,
            'venue_id': int,
            'event_id': int,
            'booking_id': int,
            'ticket_ref': str,
            'ticket_status': str,
            'qr_code': str,
            'ticket_type': str,
            'ticket_price': float
        }

        self.attribute_map = {
            'ticket_id': 'ticket_id',
            'venue_id': 'venue_id',
            'event_id': 'event_id',
            'booking_id': 'booking_id',
            'ticket_ref': 'ticket_ref',
            'ticket_status': 'ticket_status',
            'qr_code': 'QR_code',
            'ticket_type': 'ticket_type',
            'ticket_price': 'ticket_price'
        }

        self._ticket_id = ticket_id
        self._venue_id = venue_id
        self._event_id = event_id
        self._booking_id = booking_id
        self._ticket_ref = ticket_ref
        self._ticket_status = ticket_status
        self._qr_code = qr_code
        self._ticket_type = ticket_type
        self._ticket_price = ticket_price

    @classmethod
    def from_dict(cls, dikt) -> 'Ticket':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Ticket of this Ticket.  # noqa: E501
        :rtype: Ticket
        """
        return util.deserialize_model(dikt, cls)

    @property
    def ticket_id(self) -> int:
        """Gets the ticket_id of this Ticket.


        :return: The ticket_id of this Ticket.
        :rtype: int
        """
        return self._ticket_id

    @ticket_id.setter
    def ticket_id(self, ticket_id: int):
        """Sets the ticket_id of this Ticket.


        :param ticket_id: The ticket_id of this Ticket.
        :type ticket_id: int
        """

        self._ticket_id = ticket_id

    @property
    def venue_id(self) -> int:
        """Gets the venue_id of this Ticket.


        :return: The venue_id of this Ticket.
        :rtype: int
        """
        return self._venue_id

    @venue_id.setter
    def venue_id(self, venue_id: int):
        """Sets the venue_id of this Ticket.


        :param venue_id: The venue_id of this Ticket.
        :type venue_id: int
        """

        self._venue_id = venue_id

    @property
    def event_id(self) -> int:
        """Gets the event_id of this Ticket.


        :return: The event_id of this Ticket.
        :rtype: int
        """
        return self._event_id

    @event_id.setter
    def event_id(self, event_id: int):
        """Sets the event_id of this Ticket.


        :param event_id: The event_id of this Ticket.
        :type event_id: int
        """

        self._event_id = event_id

    @property
    def booking_id(self) -> int:
        """Gets the booking_id of this Ticket.


        :return: The booking_id of this Ticket.
        :rtype: int
        """
        return self._booking_id

    @booking_id.setter
    def booking_id(self, booking_id: int):
        """Sets the booking_id of this Ticket.


        :param booking_id: The booking_id of this Ticket.
        :type booking_id: int
        """

        self._booking_id = booking_id

    @property
    def ticket_ref(self) -> str:
        """Gets the ticket_ref of this Ticket.


        :return: The ticket_ref of this Ticket.
        :rtype: str
        """
        return self._ticket_ref

    @ticket_ref.setter
    def ticket_ref(self, ticket_ref: str):
        """Sets the ticket_ref of this Ticket.


        :param ticket_ref: The ticket_ref of this Ticket.
        :type ticket_ref: str
        """

        self._ticket_ref = ticket_ref

    @property
    def ticket_status(self) -> str:
        """Gets the ticket_status of this Ticket.


        :return: The ticket_status of this Ticket.
        :rtype: str
        """
        return self._ticket_status

    @ticket_status.setter
    def ticket_status(self, ticket_status: str):
        """Sets the ticket_status of this Ticket.


        :param ticket_status: The ticket_status of this Ticket.
        :type ticket_status: str
        """
        allowed_values = ["Available", "Purchased", "Cancelled"]  # noqa: E501
        if ticket_status not in allowed_values:
            raise ValueError(
                "Invalid value for `ticket_status` ({0}), must be one of {1}"
                .format(ticket_status, allowed_values)
            )

        self._ticket_status = ticket_status

    @property
    def qr_code(self) -> str:
        """Gets the qr_code of this Ticket.


        :return: The qr_code of this Ticket.
        :rtype: str
        """
        return self._qr_code

    @qr_code.setter
    def qr_code(self, qr_code: str):
        """Sets the qr_code of this Ticket.


        :param qr_code: The qr_code of this Ticket.
        :type qr_code: str
        """

        self._qr_code = qr_code

    @property
    def ticket_type(self) -> str:
        """Gets the ticket_type of this Ticket.


        :return: The ticket_type of this Ticket.
        :rtype: str
        """
        return self._ticket_type

    @ticket_type.setter
    def ticket_type(self, ticket_type: str):
        """Sets the ticket_type of this Ticket.


        :param ticket_type: The ticket_type of this Ticket.
        :type ticket_type: str
        """
        allowed_values = ["General", "Front", "Middle", "Back"]  # noqa: E501
        if ticket_type not in allowed_values:
            raise ValueError(
                "Invalid value for `ticket_type` ({0}), must be one of {1}"
                .format(ticket_type, allowed_values)
            )

        self._ticket_type = ticket_type

    @property
    def ticket_price(self) -> float:
        """Gets the ticket_price of this Ticket.


        :return: The ticket_price of this Ticket.
        :rtype: float
        """
        return self._ticket_price

    @ticket_price.setter
    def ticket_price(self, ticket_price: float):
        """Sets the ticket_price of this Ticket.


        :param ticket_price: The ticket_price of this Ticket.
        :type ticket_price: float
        """

        self._ticket_price = ticket_price
