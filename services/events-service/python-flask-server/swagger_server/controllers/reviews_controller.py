import connexion
import six
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.review import Review  # noqa: E501
from swagger_server.models.review_interaction import ReviewInteraction  # noqa: E501
from swagger_server.models.review_interaction_not_found_error import ReviewInteractionNotFoundError  # noqa: E501
from swagger_server.models.review_list import ReviewList  # noqa: E501
from swagger_server.models.review_not_found_error import ReviewNotFoundError  # noqa: E501
from swagger_server.models.review_interaction_not_found_error import ReviewInteractionNotFoundError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util

port = 5432  # Change according to port in Docker
#host = 'localhost'
host='eventastic-db'

_review_update_allow_list = ["upvotes", "flag_count", "reply_text", "review_status"]

def create_review(body):  # noqa: E501
    """Used to create a Review.

     # noqa: E501

    :param body: Review object containing the Review details.
    :type body: dict | bytes

    :rtype: Review
    """
    try:
        if connexion.request.is_json:
            body = Review.from_dict(connexion.request.get_json())  # noqa: E501

        if (len(str(body.event_id)) == 0 or len(str(body.reviewer_account_id)) == 0):
            error = InvalidInputError(code=400, type="InvalidInputError",
                                      message="The following mandatory fields were not provided: Event ID or Account ID")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        if body.event_id != None and body.reviewer_account_id != None:
            cur.execute("SELECT * FROM reviews where event_id = '"+str(body.event_id) +
                        "' and reviewer_account_id = '"+str(body.reviewer_account_id)+"';")
            record = cur.fetchone()
            if record != None:
                error = InvalidInputError(code=409, type="InvalidInputError",
                                          message="User has already written a review for this event.")
                cur.close()
                con.close()
                return error, 400, {'Access-Control-Allow-Origin': '*'}
        #When a new review is created, default values are:
        body.upvotes = 0
        body.flag_count = 0
        body.review_status = 'Active'
        body.reply_text = ''
        # body.review_interaction = {}
        insert_string = "INSERT INTO reviews VALUES (default, %s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING review_id;"
        cur.execute(insert_string, (body.event_id, body.reviewer_account_id, body.upvotes, body.rating,\
                                    body.review_text, body.review_timestamp, body.flag_count,\
                                    body.review_status, body.reply_text))
        body.review_id = cur.fetchone()[0]
        cur.execute('SELECT reward_points FROM accounts where account_id = ' + str(body.reviewer_account_id))
        record = cur.fetchone()
        if record != None:
            reward_points = float(record[0])
            # print(reward_points)
            new_reward_points = str(reward_points + 1)
            cur.execute(f"UPDATE accounts set reward_points = {new_reward_points} where account_id = {body.reviewer_account_id}")
        cur.close()
        con.close()
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def create_review_interaction(body):  # noqa: E501
    """Used to create a Review Intercation record.

     # noqa: E501

    :param body: Review Interaction object containing the Review Interaction details.
    :type body: dict | bytes

    :rtype: ReviewInteraction
    """
    
    try:
        if connexion.request.is_json:
            body = ReviewInteraction.from_dict(connexion.request.get_json())  # noqa: E501
    

        if (len(str(body.interaction_account_id)) == 0):
            error = InvalidInputError(code=400, type="InvalidInputError",
                                      message="The following mandatory fields were not provided: Interaction Account ID. Please login")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        con = psycopg2.connect(database='eventastic', user='postgres',
                               password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        insert_string = "INSERT INTO interactions VALUES (default, %s,%s,%s,%s) RETURNING interaction_id;"
        cur.execute(insert_string, (body.review_id, body.interaction_account_id,body.review_upvoted,body.review_flagged))
        body.interaction_id = cur.fetchone()[0]

        cur.close()
        con.close()
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error
        error = UnexpectedServiceError(
            code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def list_reviews(event_id=None, interaction_acount_id=None):  # noqa: E501
    """Retrieve a List of Reviews. Search by Event ID and Interaction Account ID.

     # noqa: E501

    :param event_id: The Event to search.
    :type event_id: str
    :param interaction_acount_id: The ID of the user who is reading the review.
    :type interaction_acount_id: str

    :rtype: ReviewList
    """
    try:
        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        reviews_list = list()

        if event_id == None and interaction_acount_id == None:
            cur.execute(f"SELECT * FROM reviews where flag_count >= 0 and review_status = 'Active' ")
            records = cur.fetchall()
            if len(records) > 0:
                for record in records:
                    review = dict()
                    review['review_id'] = int(record[0])
                    review['event_id'] = int(record[1])
                    review['reviewer_account_id'] = int(record[2])
                    review['upvotes'] = int(record[3])
                    review['rating'] = int(record[4])
                    review['review_text'] = str(record[5])
                    review['review_timestamp'] = str(record[6])
                    review['flag_count'] = int(record[7])
                    review['review_status'] = str(record[8])
                    review['reply_text'] = str(record[9])
                    
                    reviews_list.append(review)

        elif event_id != None:
            cur.execute(f"SELECT * FROM reviews where event_id = {event_id} and review_status = 'Active' ")
            records = cur.fetchall()
            if len(records) > 0:
                for record in records:
                    review = dict()
                    review['review_id'] = int(record[0])
                    review_id = review['review_id']
                    review['event_id'] = int(record[1])
                    review['reviewer_account_id'] = int(record[2])
                    review['upvotes'] = int(record[3])
                    review['rating'] = int(record[4])
                    review['review_text'] = str(record[5])
                    review['review_timestamp'] = str(record[6])
                    review['flag_count'] = int(record[7])
                    review['review_status'] = str(record[8])
                    review['reply_text'] = str(record[9])

                    interaction = dict()
                    if interaction_acount_id != None:
                        cur.execute(f"SELECT * FROM interactions where review_id={review_id} and interaction_account_id={interaction_acount_id} ")
                        inter_record = cur.fetchone()
                        if inter_record != None:
                            interaction['interaction_id'] = int(inter_record[0])
                            interaction['review_id'] = int(inter_record[1])
                            interaction['interaction_account_id'] = int(inter_record[2])
                            interaction['review_upvoted'] = bool(inter_record[3])
                            interaction['review_flagged'] = bool(inter_record[4])

                    review['review_interaction'] = interaction

                    reviews_list.append(review)        
                    

        cur.close()
        con.close()
        return reviews_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_review(review_id, body):  # noqa: E501
    """Used to update a Review. Replaces the Review resource.

     # noqa: E501

    :param review_id: ID of the Review to be updated.
    :type review_id: int
    :param body: Review object to update.
    :type body: dict | bytes

    :rtype: Review
    """
    try:
        if connexion.request.is_json:
            body = Review.from_dict(connexion.request.get_json())  # noqa: E501

        if (body.upvotes == None and body.flag_count == None and body.reply_text == None and body.review_status == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="Provide at least one of the following mandatory fields: upvotes or flag count or reply text or review status")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute(f"SELECT reviewer_account_id FROM reviews where review_id = {review_id}")
        record = cur.fetchone()
        if record == None:
            error = ReviewNotFoundError(code=404, type="ReviewNotFoundError", 
                    message="The following Review ID does not exist: " + str(review_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}
        reviewer_account_id = str(record[0])

        sql = "UPDATE reviews SET "
        value_list = []
        for attr, value in body.__dict__.items():
            tmp_attr = attr[1:]
            if tmp_attr in _review_update_allow_list and value:
                sql = sql + " {}=%s,".format(tmp_attr)
                value_list.append(value)
        sql = sql[:-1] + " WHERE review_id = {}".format(review_id)

        if len(value_list) > 0:
            print(sql)
            cur.execute(sql, value_list)

        if body.review_status == 'Removed':
            cur.execute('SELECT reward_points FROM accounts where account_id = ' + (reviewer_account_id))
            record = cur.fetchone()
            reward_points = float(record[0])
            new_reward_points = str(reward_points - 1)
            cur.execute(f"UPDATE accounts set reward_points = {new_reward_points} where account_id = {reviewer_account_id}")               

        cur.close()
        con.close()
        return {"message": "Review has been updated successfully."}, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}



def update_review_interaction(interaction_id, body):  # noqa: E501
    """Used to update a Review Interaction record.

     # noqa: E501

    :param interaction_id: ID of the Review Interaction record to be updated.
    :type interaction_id: int
    :param body: Review Interaction object to update.
    :type body: dict | bytes

    :rtype: ReviewInteraction
    """
    try:
        if connexion.request.is_json:
            body = ReviewInteraction.from_dict(connexion.request.get_json())  # noqa: E501

        con = psycopg2.connect(database= 'eventastic', user='postgres', password='postgrespw', host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        if (len(str(interaction_id)) == 0):
            error = InvalidInputError(code=400, type="InvalidInputError",
                                      message="The following mandatory fields were not provided: Interaction ID")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        cur.execute(f"SELECT interaction_id FROM interactions where interaction_id = {interaction_id}")
        record = cur.fetchone()
        if record == None:
            error = ReviewInteractionNotFoundError(code=404, type="ReviewInteractionNotFoundError", 
                    message="The following Interaction ID does not exist: " + str(interaction_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        # Perform Update
        update_string = "UPDATE interactions set "
        if body.review_upvoted != None:
            update_string += f" review_upvoted ='{body.review_upvoted}',"
        if body.review_flagged != None:
            update_string += f" review_flagged ='{body.review_flagged}',"

        update_string = list(update_string)
        update_string[-1] = " "
        update_string = "".join(update_string)
        update_string += f" where interaction_id = {interaction_id} RETURNING interaction_id;"
        cur.execute(update_string)

        body.interaction_id = cur.fetchone()[0]

        cur.close()
        con.close()
        return body, 200, {'Access-Control-Allow-Origin': '*'}
       
        
    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        cur.close()
        con.close()
        return error, 500, {'Access-Control-Allow-Origin': '*'}