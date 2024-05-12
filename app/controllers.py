from flask import request, render_template, redirect, url_for, send_from_directory, jsonify
from flask import current_app as app,send_from_directory,make_response
from datetime import date
from sqlalchemy import and_
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, current_user
from .database import *
from .graphql import *
import json
import pickle

jwt=JWTManager()

@app.route('/')
def login_register(msg=""):
    return render_template('index.html')

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()

    success, result = graphql_sync(
        schema,
        data
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

@app.get("/token/<user_id>")
def token(user_id):
    user=User.query.filter_by(id=user_id).first()
    if user:
        user.is_active=True
        db.session.commit()
        token=create_access_token(identity=user)
        return jsonify({"token":token}),200
    return jsonify("Enter correct Details")

@app.route("/dashboard",methods=["GET","POST"])
def dashboard():
    return render_template("user_dashboard.html")

@app.route("/error_page")
def error_page():
    return render_template("error.html")

@app.route('/validate', methods=["POST"])
@jwt_required()
def validate():
    try:
        return jsonify({"active_status":current_user.is_active,"role":current_user.role,"username":current_user.user_name})
    except:
        return jsonify({"active_status":False})

@app.route('/logout', methods=["POST"])
@jwt_required()
def logout():
    try:
        current_user.is_active=False
        current_user.last_seen=date.today()
        db.session.commit()
        return jsonify({"is_active":current_user.is_active})
    except:
        return jsonify({"is_active":current_user.is_active})

@app.route("/register", methods=["POST"])
def register():
    name=request.form["name"]
    email=request.form["email"]
    username=request.form["username"]
    password=request.form["pass"]
    role=request.form["btnradio"]
    new_user=User(user_name=username,name=name, password=password,email=email,role=role, books_borrowed=0, is_premium=False, is_active=False)
    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for("login_register"))

@app.route('/admin', methods=["GET","POST"])
def admin_login():
    if request.method=="POST":
        username=request.form["username"]
        password=request.form["pass"]
        try:
            name=request.form["name"]
            email=request.form["email"]
            role="Admin"
            admin=User(user_name=username,name=name,password=password,email=email,role=role,books_borrowed=0,is_active=False,is_premium=True)
            db.session.add(admin)
            db.session.commit()
        except:
            user=User.query.filter_by(user_name=username,role="Admin").first()
            if user and password==user.password:
                return redirect(url_for("admin_dashboard"))
            return render_template("error.html")
    return render_template("admin_login.html")


@app.route('/admin-dashboard')
def admin_dashboard():
    return render_template("admin_dashboard.html")

@app.route('/add_book', methods=["POST"])
def add_book():
    try:
        name=request.form["book_name"]
        book=Book.query.filter_by(name=name).first()
        book_pdf=request.files["book_file"]
        book_pdf.save(join("uploads",(str(book.id) + ".pdf")))
    finally:
        return redirect(url_for("admin_dashboard"))

def load_pdf(filename):
    with open(f"uploads/{filename}", "rb") as file:
        pdf_data = file.read()
    return pdf_data

@app.route('/pdf/<filename>')
def get_pdf(filename):
    pdf_data = cache.get(filename)
    if pdf_data is None:
        pdf_data = load_pdf(filename)
        pickleable_data = pickle.dumps(pdf_data)
        cache.set(filename, pickleable_data, timeout=600)
        return send_from_directory("uploads", filename)
    original_pdf_data=pickle.loads(pdf_data)
    response = make_response(original_pdf_data)
    response.headers['Content-Type'] = 'application/pdf'
    return response


@app.route("/<user>/books")
def admin_books_page(user):
    return render_template("list_books.html")

@app.route("/admin/users")
def admin_users_page():
    return render_template("admin_users.html")

@app.post("/clearcache")
@jwt_required()
def clear_cache():
    if current_user.role=='Admin':
        cache.clear()
        return "true"
    else:   return "false"

@app.route("/book/<book_name>")
def book(book_name):
    data={"book_name":book_name}
    return render_template("book.html",data=json.dumps(data))

@app.get("/image/<file>")
def get_image(file):
    return send_from_directory('static/images',file+".jpg")

#-------------------------------KINDOF API----------------------------------------------
@app.route("/search/book/<name>", methods=["POST"])
def search_book(name):
    books=Book.query.filter(Book.name.ilike(f'%{name}%')).all()
    genre=Genre.query.filter(Genre.name.ilike(f'{name}')).first()
    genre=genre.books if genre else ""
    print(genre)
    res={"by_name":[],"by_genre":[]}
    for book in books:
        book=book.__dict__
        res["by_name"].append({"name":book["name"],"des":book["description"],"date":book["release_date"]})
    for book in genre:
        book=book.__dict__
        res["by_genre"].append({"name":book["name"],"des":book["description"],"date":book["release_date"]})    
    print(res)
    return jsonify(res)

@app.route("/search/user/<name>", methods=["POST"])
def search_user(name):
    username=User.query.filter(User.user_name.ilike(f'%{name}%')).all()
    uname=User.query.filter(User.name.ilike(f'%{name}%')).all()
    email=User.query.filter(User.email.ilike(f'%{name}%')).all()
    res={"by_username":[],"by_name":[],"by_email":[]}
    for user in username:
        count=len(user.books)
        user=user.__dict__
        res["by_username"].append({"name":user['name'],"username":user['user_name'],"email":user['email'],"role":user['role'],"held":user['books_borrowed'],"is_premium":user['is_premium'],"books":count})
    for user in uname:
        count=len(user.books)
        user=user.__dict__
        res["by_name"].append({"name":user['name'],"username":user['user_name'],"email":user['email'],"role":user['role'],"held":user['books_borrowed'],"is_premium":user['is_premium'],"books":count})
    for user in email:
        count=len(user.books)
        user=user.__dict__
        res["by_email"].append({"name":user['name'],"username":user['user_name'],"email":user['email'],"role":user['role'],"held":user['books_borrowed'],"is_premium":user['is_premium'],"books":count})
    return jsonify({"result":res})

#-------------------FLASK-JWT-EXTENDED CONFIGURATION-------------------------------------
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).first()