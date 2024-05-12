class Development():
    DEBUG= True
    UPLOAD_FOLDER="uploads"
    STATIC_FOLDER="static"
    SQLALCHEMY_DATABASE_URI="sqlite:///database.sqlite3"
    JWT_SECRET_KEY = "Mistborn:The Final Empire"
    JWT_JSON_KEY = "token"
    JWT_REFRESH_JSON_KEY = "refresh_token"
    CACHE_TYPE="RedisCache"
    CACHE_REDIS_HOST="127.0.0.2"
    CACHE_REDIS_PORT="6379"
    CACHE_REDIS_DB = 1

class celeryconfig():
    broker_url = "redis://127.0.0.2:6379/2"
    result_backend = "redis://127.0.0.2:6379/3"
    timezone = "Asia/Kolkata"
    broker_connection_retry_on_startup=True