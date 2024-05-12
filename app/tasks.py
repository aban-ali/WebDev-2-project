from celery import Celery, Task
from .config import celeryconfig
from celery import shared_task
from .database import User,Book,Genre
from flask import render_template
from datetime import date

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(celeryconfig)
    return celery_app

@shared_task(ignore_result=True)
def daily_reminder():   
    users = User.query.all()
    subject="Regarding Mistborn, the one stop for all readers"
    for user in users:
        if user.role != 'Admin' and (date.today() != user.last_seen):
            temp= render_template("mail_user.html", name=user.name)
            send_message(user.email,subject, temp)
            #send_message(user.email, subject, user.name)
    return "OK"

@shared_task(ignore_result=True)
def monthly_reminder():
    user = User.query.filter_by(role= 'Admin').first()
    books=Book.query.all()
    genres=Genre.query.all()
    students=User.query.filter_by(role="Student").all()
    faculty=User.query.filter_by(role="Faculty").all()
    temp=render_template('mail_admin.html',books=books,genres=genres,students=students,faculty=faculty)
    subject="Regaring Monthly results of the library"
    send_message(user.email, subject, temp)
    return "OK"


##----------------------------------SMTP------------------------------------------

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = 'mistbornlibrary@gmail.com'
SENDER_PASSWORD = 'zkbw otbu bdsn fczn'


def send_message(to, subject, temp):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(temp, 'html'))
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg=msg)