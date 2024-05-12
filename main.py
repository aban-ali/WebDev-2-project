from flask import Flask
from flask import request, render_template, redirect, url_for, send_from_directory
from app.database import db
from app.config import Development
from app.tasks import daily_reminder, monthly_reminder, celery_init_app
from celery.schedules import crontab

def createApp():
    app=Flask(__name__)
    app.config.from_object(Development)
    db.init_app(app)
    with app.app_context():
        db.create_all()
    return app

app=createApp()
app.app_context().push()
celery_app = celery_init_app(app)

from app.controllers import *

jwt.init_app(app)
cache.init_app(app)

@celery_app.on_after_configure.connect
def send_mails(sender, **kwargs):
    try:
        sender.add_periodic_task(crontab(hour=19,minute=29),daily_reminder.s())
        sender.add_periodic_task(crontab(hour=19, minute=29, day_of_month=28),monthly_reminder.s())
    except Exception as err:
        print(err)

if __name__=="__main__":
    app.run(debug=True)





#  REDIS CMD
#  docker run -p 6379:6379 -h 127.0.0.2 redis