# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server.models.tag import Tag
from swagger_server import util


class Account(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """

    def __init__(self, account_id: int=None, account_type: str=None, user_desc: str=None, first_name: str=None, last_name: str=None, location: str=None, email: str=None, password: str=None, mobile: str=None, profile_pic: str=None, age: int=None, reward_points: str=None, tags: List[Tag]=None):  # noqa: E501
        """Account - a model defined in Swagger

        :param account_id: The account_id of this Account.  # noqa: E501
        :type account_id: int
        :param account_type: The account_type of this Account.  # noqa: E501
        :type account_type: str
        :param user_desc: The user_desc of this Account.  # noqa: E501
        :type user_desc: str
        :param first_name: The first_name of this Account.  # noqa: E501
        :type first_name: str
        :param last_name: The last_name of this Account.  # noqa: E501
        :type last_name: str
        :param location: The location of this Account.  # noqa: E501
        :type location: str
        :param email: The email of this Account.  # noqa: E501
        :type email: str
        :param password: The password of this Account.  # noqa: E501
        :type password: str
        :param mobile: The mobile of this Account.  # noqa: E501
        :type mobile: str
        :param profile_pic: The profile_pic of this Account.  # noqa: E501
        :type profile_pic: str
        :param age: The age of this Account.  # noqa: E501
        :type age: int
        :param reward_points: The reward_points of this Account.  # noqa: E501
        :type reward_points: str
        :param tags: The tags of this Account.  # noqa: E501
        :type tags: List[Tag]
        """
        self.swagger_types = {
            'account_id': int,
            'account_type': str,
            'user_desc': str,
            'first_name': str,
            'last_name': str,
            'location': str,
            'email': str,
            'password': str,
            'mobile': str,
            'profile_pic': str,
            'age': int,
            'reward_points': str,
            'tags': List[Tag]
        }

        self.attribute_map = {
            'account_id': 'account_id',
            'account_type': 'account_type',
            'user_desc': 'user_desc',
            'first_name': 'first_name',
            'last_name': 'last_name',
            'location': 'location',
            'email': 'email',
            'password': 'password',
            'mobile': 'mobile',
            'profile_pic': 'profile_pic',
            'age': 'age',
            'reward_points': 'reward_points',
            'tags': 'tags'
        }

        self._account_id = account_id
        self._account_type = account_type
        self._user_desc = user_desc
        self._first_name = first_name
        self._last_name = last_name
        self._location = location
        self._email = email
        self._password = password
        self._mobile = mobile
        self._profile_pic = profile_pic
        self._age = age
        self._reward_points = reward_points
        self._tags = tags

    @classmethod
    def from_dict(cls, dikt) -> 'Account':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Account of this Account.  # noqa: E501
        :rtype: Account
        """
        return util.deserialize_model(dikt, cls)

    @property
    def account_id(self) -> int:
        """Gets the account_id of this Account.


        :return: The account_id of this Account.
        :rtype: int
        """
        return self._account_id

    @account_id.setter
    def account_id(self, account_id: int):
        """Sets the account_id of this Account.


        :param account_id: The account_id of this Account.
        :type account_id: int
        """

        self._account_id = account_id

    @property
    def account_type(self) -> str:
        """Gets the account_type of this Account.


        :return: The account_type of this Account.
        :rtype: str
        """
        return self._account_type

    @account_type.setter
    def account_type(self, account_type: str):
        """Sets the account_type of this Account.


        :param account_type: The account_type of this Account.
        :type account_type: str
        """
        allowed_values = ["Customer", "Host", "Admin"]  # noqa: E501
        if account_type not in allowed_values:
            raise ValueError(
                "Invalid value for `account_type` ({0}), must be one of {1}"
                .format(account_type, allowed_values)
            )

        self._account_type = account_type

    @property
    def user_desc(self) -> str:
        """Gets the user_desc of this Account.


        :return: The user_desc of this Account.
        :rtype: str
        """
        return self._user_desc

    @user_desc.setter
    def user_desc(self, user_desc: str):
        """Sets the user_desc of this Account.


        :param user_desc: The user_desc of this Account.
        :type user_desc: str
        """

        self._user_desc = user_desc

    @property
    def first_name(self) -> str:
        """Gets the first_name of this Account.


        :return: The first_name of this Account.
        :rtype: str
        """
        return self._first_name

    @first_name.setter
    def first_name(self, first_name: str):
        """Sets the first_name of this Account.


        :param first_name: The first_name of this Account.
        :type first_name: str
        """
        if first_name is None:
            raise ValueError("Invalid value for `first_name`, must not be `None`")  # noqa: E501

        self._first_name = first_name

    @property
    def last_name(self) -> str:
        """Gets the last_name of this Account.


        :return: The last_name of this Account.
        :rtype: str
        """
        return self._last_name

    @last_name.setter
    def last_name(self, last_name: str):
        """Sets the last_name of this Account.


        :param last_name: The last_name of this Account.
        :type last_name: str
        """
        if last_name is None:
            raise ValueError("Invalid value for `last_name`, must not be `None`")  # noqa: E501

        self._last_name = last_name

    @property
    def location(self) -> str:
        """Gets the location of this Account.


        :return: The location of this Account.
        :rtype: str
        """
        return self._location

    @location.setter
    def location(self, location: str):
        """Sets the location of this Account.


        :param location: The location of this Account.
        :type location: str
        """

        self._location = location

    @property
    def email(self) -> str:
        """Gets the email of this Account.


        :return: The email of this Account.
        :rtype: str
        """
        return self._email

    @email.setter
    def email(self, email: str):
        """Sets the email of this Account.


        :param email: The email of this Account.
        :type email: str
        """
        if email is None:
            raise ValueError("Invalid value for `email`, must not be `None`")  # noqa: E501

        self._email = email

    @property
    def password(self) -> str:
        """Gets the password of this Account.


        :return: The password of this Account.
        :rtype: str
        """
        return self._password

    @password.setter
    def password(self, password: str):
        """Sets the password of this Account.


        :param password: The password of this Account.
        :type password: str
        """
        if password is None:
            raise ValueError("Invalid value for `password`, must not be `None`")  # noqa: E501

        self._password = password

    @property
    def mobile(self) -> str:
        """Gets the mobile of this Account.


        :return: The mobile of this Account.
        :rtype: str
        """
        return self._mobile

    @mobile.setter
    def mobile(self, mobile: str):
        """Sets the mobile of this Account.


        :param mobile: The mobile of this Account.
        :type mobile: str
        """

        self._mobile = mobile

    @property
    def profile_pic(self) -> str:
        """Gets the profile_pic of this Account.


        :return: The profile_pic of this Account.
        :rtype: str
        """
        return self._profile_pic

    @profile_pic.setter
    def profile_pic(self, profile_pic: str):
        """Sets the profile_pic of this Account.


        :param profile_pic: The profile_pic of this Account.
        :type profile_pic: str
        """

        self._profile_pic = profile_pic

    @property
    def age(self) -> int:
        """Gets the age of this Account.


        :return: The age of this Account.
        :rtype: int
        """
        return self._age

    @age.setter
    def age(self, age: int):
        """Sets the age of this Account.


        :param age: The age of this Account.
        :type age: int
        """

        self._age = age

    @property
    def reward_points(self) -> str:
        """Gets the reward_points of this Account.


        :return: The reward_points of this Account.
        :rtype: str
        """
        return self._reward_points

    @reward_points.setter
    def reward_points(self, reward_points: str):
        """Sets the reward_points of this Account.


        :param reward_points: The reward_points of this Account.
        :type reward_points: str
        """

        self._reward_points = reward_points

    @property
    def tags(self) -> List[Tag]:
        """Gets the tags of this Account.


        :return: The tags of this Account.
        :rtype: List[Tag]
        """
        return self._tags

    @tags.setter
    def tags(self, tags: List[Tag]):
        """Sets the tags of this Account.


        :param tags: The tags of this Account.
        :type tags: List[Tag]
        """

        self._tags = tags
