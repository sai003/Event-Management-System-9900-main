import connexion
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


from swagger_server.models.email import Email
from swagger_server.models.unexpected_service_error import UnexpectedServiceError


API_KEY = "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"


def send_email(body):
    if connexion.request.is_json:
        body = Email.from_dict(connexion.request.get_json())
    try:
        to_emails = []
        for rec in body.email_to:
            tmp = (rec.email_address, rec.name)
            to_emails.append(tmp)

        # Include EvenTastic on all outbound emails
        to_emails.append(('eventastic.comp9900@gmail.com', 'EvenTastic'))
        message = Mail(
            from_email=(body.email_from["email_address"], body.email_from["name"]),
            to_emails=to_emails,
            subject=body.email_subject,
            html_content=body.email_content)

        sendgrid_client = SendGridAPIClient(API_KEY)
        response = sendgrid_client.send(message)
        return "Email request sent", response.status_code, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def send_email_options():
    """Used to respond to browser with Access-Control-Allow-Methods header. Required for POST.

    :rtype: None
    """
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': 86400 
    }
    return None, 200, response_headers