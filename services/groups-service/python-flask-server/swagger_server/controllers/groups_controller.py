import connexion
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from swagger_server.models.group import Group
from swagger_server.models.group_member import GroupMember
from swagger_server.models.tag import Tag
from swagger_server.models.group_not_found_error import GroupNotFoundError
from swagger_server.models.group_status_update import GroupStatusUpdate
from swagger_server.models.unexpected_service_error import UnexpectedServiceError

port = 5432
#host = 'localhost'
host='eventastic-db'
user ='postgres'
password='postgrespw'
database='eventastic'


_update_allow_list = ["group_name", "group_desc", "group_img"]


def get_connection():
    con = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    return con


def create_group(body):
    if connexion.request.is_json:
        body = Group.from_dict(connexion.request.get_json())
        print(body)
    try:
        con = get_connection()
        cur = con.cursor()
        sql = "INSERT INTO groups VALUES (default, %s,%s,%s,%s,%s) RETURNING id;"
        cur.execute(sql, (
            body.group_host_id, body.event_id, body.group_name, 
                body.group_desc, body.group_img))
        body.group_id = cur.fetchone()[0]
        con.close()
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def create_group_member(group_id, body):
    if connexion.request.is_json:
        body = GroupMember.from_dict(connexion.request.get_json())
    try:
        # check if Group Exists
        check = get_group_details(group_id)
        # if error code is not 200 OK, return error
        if check[1] != 200:
            return check

        con = get_connection()
        cur = con.cursor()
        sql = "INSERT INTO group_members VALUES (default, %s,%s,%s,%s,%s) RETURNING id;"
        cur.execute(sql, (
            body.account_id, group_id, body.join_status, 
                body.join_desc, tags_to_string(body.interest_tags)))
        body.group_membership_id = cur.fetchone()[0]
        con.close()
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_group_details(group_id):
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT * FROM groups where id = ' + str(group_id))
        record = cur.fetchone()
        if record:
            group_details = record_to_group(record)
            group_details.group_members = list_group_members(group_id)[0]
            con.close()
            return group_details, 200, {'Access-Control-Allow-Origin': '*'}
        else:
            con.close()
            error = GroupNotFoundError(code=404, type="GroupNotFoundError", 
                message="The following Group ID does not exist: " + str(group_id))
            return error, 404, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_group_members(group_id):
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT * FROM group_members where group_id = ' + str(group_id))
        records = cur.fetchall()
        group_members = records_to_members(records)
        con.close()
        return group_members, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_member_details(group_membership_id):
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT * FROM group_members where id = ' + str(group_membership_id))
        record = cur.fetchone()
        if record:
            member_details = record_to_member(record)
            con.close()
            return member_details, 200, {'Access-Control-Allow-Origin': '*'}
        else:
            con.close()
            error = GroupNotFoundError(code=404, type="GroupNotFoundError", 
                message="The following Group Member ID does not exist: " + str(group_membership_id))
            return error, 404, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_groups(event_id=None, account_id=None):
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT * FROM groups')
        records = cur.fetchall()
        groups_list = records_to_groups(records)
        for group in groups_list:
            group.group_members = list_group_members(group.group_id)[0]

        if event_id and not account_id:
            filtered = list(filter(lambda group: group.event_id == int(event_id), groups_list))
            con.close()
            return filtered, 200, {'Access-Control-Allow-Origin': '*'}
        elif account_id and not event_id:
            user_group_ids = get_user_group_ids(account_id)[0]
            filtered = list(filter(lambda group: group.group_id in user_group_ids, groups_list))
            con.close()
            return filtered, 200, {'Access-Control-Allow-Origin': '*'}
        elif account_id and event_id:
            # first, filter by event_id
            filtered1 = list(filter(lambda group: group.event_id == int(event_id), groups_list))
            # second, filter by account_id
            user_group_ids = get_user_group_ids(account_id)[0]
            filtered2 = list(filter(lambda group: group.group_id in user_group_ids, filtered1))
            con.close()
            return filtered2, 200, {'Access-Control-Allow-Origin': '*'}
        else:
            con.close()
            return groups_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_group(group_id, body):
    if connexion.request.is_json:
        body = Group.from_dict(connexion.request.get_json())
    
    try:
        # check if Group Exists
        check = get_group_details(group_id)
        # if error code is not 200 OK, return error
        if check[1] != 200:
            return check

        # Create the sql update statement
        sql = "UPDATE groups SET"
        value_list = []
        for attr, value in body.__dict__.items():
            tmp_attr = attr[1:]
            if tmp_attr in _update_allow_list and value:
                sql = sql + " {}=%s,".format(tmp_attr)
                value_list.append(value)
        sql = sql[:-1] + " WHERE id = {}".format(group_id)

        print(sql)
        # Execute the sql update statement
        con = get_connection()
        cur = con.cursor()
        cur.execute(sql, value_list)
        con.close()
    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        if con:
            con.close()
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}

    # return the updated record
    result = get_group_details(group_id)
    return result


def update_group_member_status(group_id, group_membership_id, body):
    if connexion.request.is_json:
        body = GroupStatusUpdate.from_dict(connexion.request.get_json())

    try:
        # check if Group Member Exists
        check = get_member_details(group_membership_id)
        # if error code is not 200 OK, return error
        if check[1] != 200:
            return check

        # Execute the sql statement
        con = get_connection()
        cur = con.cursor()
        sql = "UPDATE group_members set join_status='{}' where id = {}".format(body.value, group_membership_id)
        cur.execute(sql)
        con.close()

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        if con:
            con.close()
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}

    # return the updated record
    result = get_member_details(group_membership_id)
    return result


# returns a list of Group IDs that the User is a member of.
def get_user_group_ids(account_id):
    try:
        con = get_connection()
        cur = con.cursor()
        cur.execute('SELECT * FROM group_members where account_id = ' + str(account_id))
        records = cur.fetchall()
        group_id_list = []
        for rec in records:
            group_id_list.append(rec[2])
        con.close()
        return group_id_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        print(str(e))
        if con:
            con.close()
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


# maps a collection of database records to a List of Groups
def records_to_groups(records):
    group_list = []
    for record in records:
        group_list.append(record_to_group(record))
    return group_list


# maps a collection of database records to a List of GroupMembers
def records_to_members(records):
    member_list = []
    for record in records:
        member_list.append(record_to_member(record))
    return member_list


# maps a database record to a Group
def record_to_group(record):
    group = Group()
    group.group_id=record[0]
    group.group_host_id=record[1]
    group.event_id=record[2]
    group.group_name=record[3]
    group.group_desc=record[4]
    group.group_img=record[5]
    return group


# maps a database record to a GroupMember
def record_to_member(record):
    member = GroupMember()
    member.group_membership_id=record[0]
    member.account_id=record[1]
    member.group_id=record[2]
    member.join_status=record[3]
    member.join_desc=record[4]
    member.interest_tags=string_to_tags(record[5])
    return member


# Transforms the JSON tag array into tag1, tag2, tag3 etc..
def tags_to_string(tags):
    formatted = ""
    for tag in tags:
        formatted = formatted + tag.name + ","
    return formatted[:-1]


# Transforms the a string of tags tag1, tag2, tag3 etc.. into JSON Tags
def string_to_tags(tag_str):
    tags = tag_str.split(',')
    tags_list = []
    for tag in tags:
        tmp = Tag()
        tmp.name = tag
        tags_list.append(tmp)
    return tags_list