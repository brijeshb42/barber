import logging
import sys
import string
import random

from flask import Flask, render_template, flash, url_for, \
    redirect, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, \
    check_password_hash
from werkzeug.contrib.fixers import ProxyFix

from flask.ext.cache import Cache

from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, UserMixin, \
    login_required, login_user, logout_user, current_user

from flask_wtf import Form
from wtforms import StringField, PasswordField, \
    BooleanField, IntegerField
from wtforms.validators import DataRequired, Regexp

from config import config

from .image import download_from_url, IMG_DIR_ABS

__version__ = "0.1.0"
__author__ = "Brijesh Bittu <brijeshb42@gmail.com>"

"""User login management."""
login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.login_message_category = "danger"
login_manager.login_message = "You need to login."
login_manager.login_view = "login"


"""App setup."""
app = Flask(
    __name__,
    template_folder="../templates/",
    static_url_path="/static",
    static_folder="../templates/static/")
app.wsgi_app = ProxyFix(app.wsgi_app)
db = SQLAlchemy(app)
app.config.from_object(config["default"])
login_manager.init_app(app)
cache = Cache(config={"CACHE_TYPE": "simple"})
cache.init_app(app)
logger = logging.Logger(config["default"].APP_NAME)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))

"""DB Models."""


class AuthUser(db.Model, UserMixin):
    __tablename__ = "auth_users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(
        db.String(40), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(128))

    @property
    def password(self):
        raise AttributeError(u"Password is not a readable attribute.")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User %s>" % self.username or "None"


class ImageSize(db.Model):
    __tablename__ = "image_sizes"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return "<ImageSize %s, Width: %d, Height: %d>" % (
            self.name or "None",
            self.width or 0,
            self.height or 0
            )

    @staticmethod
    @cache.cached()
    def all():
        return ImageSize.query.all()


"""UI Forms."""


class LoginForm(Form):
    username = StringField(u"Username", validators=[
        DataRequired(message="Provide a username.")])
    password = PasswordField(u"Password", validators=[
        DataRequired(message="Provide a password.")])
    remember_me = BooleanField(u"Remember Me")


class SizeForm(Form):
    name = StringField("Image Type Name", validators=[
        DataRequired(message="Provide a name."),
        Regexp("^[A-Za-z]+$", message="Provide a single word only.")])
    width = IntegerField("Image Width", validators=[
        DataRequired(message="Image cannot survive without a width.")])
    height = IntegerField("Image Height", validators=[
        DataRequired(message="Image cannot survive without a height.")])


@login_manager.user_loader
def load_user(user_id):
    logging.debug("Querying users.")
    return AuthUser.query.get(int(user_id))


def get_random_part(length):
    """Get a random 5 letter string."""
    random_pad = "".join(
        random.choice(string.ascii_lowercase) for i in range(length))
    return random_pad


@app.route("/")
@login_required
def index():
    url = request.args.get("url","")
    return render_template(
        "index.html",
        sizes=ImageSize.all(),
        url=url)


@app.route("/faq")
@login_required
def faq():
    return render_template("faq.html")


@app.route("/sizes", methods=["GET", "POST"])
@login_required
def sizes():
    form = SizeForm()
    if form.validate_on_submit():
        img = ImageSize(
            name=form.name.data.lower(),
            width=form.width.data,
            height=form.height.data
        )
        db.session.add(img)
        db.session.commit()
        cache.clear()
        flash("%s saved with %d width and %d height." % (
            img.name, img.width, img.height), "info")
        return redirect(url_for("index"))
    return render_template(
        "sizes.html",
        form=form,
        sizes=ImageSize.all())


@app.route("/sizes/edit/<int:sid>", methods=["GET", "POST"])
@login_required
def sizes_edit(sid):
    img = ImageSize.query.get(sid)
    if not img:
        flash("Invalid size.", "error")
        return redirect(url_for("sizes"))
    form = SizeForm()
    form.name.data = img.name
    form.width.data = img.width
    form.height.data = img.height
    if form.validate_on_submit():
        img.width = form.width.data
        img.height = form.height.data
        db.session.add(img)
        db.session.commit()
        cache.clear()
        flash("%s updated with %d width and %d height." % (
            img.name, img.width, img.height), "info")
        return redirect(url_for("sizes"))
    return render_template(
        "sizes.html",
        form=form,
        title="Edit %s" % img.name)


@app.route("/sizes/delete/<int:sid>", methods=["POST"])
@login_required
def sizes_delete(sid):
    sz = ImageSize.query.get(sid)
    if not sz:
        flash("Invalid size.", "error")
        return redirect(url_for("sizes"))
    db.session.delete(sz)
    db.session.commit()
    cache.clear()
    flash("%s deleted." % sz.name, "success")
    return redirect(url_for("sizes"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user is not None and current_user.is_authenticated():
        return redirect(url_for("index"))
    form = LoginForm()
    if form.validate_on_submit():
        user = AuthUser.query.filter_by(username=form.username.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            return redirect(request.args.get("next", "") or
                            url_for("index"))
        flash(u"Invalid combination", "warning")
    return render_template("auth/login.html", form=form)


@app.route("/img", methods=["POST"])
def image():
    data = request.get_json(cache=True, force=True)
    if "img" in data:
        status, message = download_from_url(data["img"], data["sizes"])
        if status:
            return jsonify(message=message, type="success")
        else:
            jsonify(type="error", message="Image not provided.")
    return jsonify(type="error", message="Image not provided.")


@app.route('/images/<path:filename>')
def custom_static(filename):
    return send_from_directory(IMG_DIR_ABS, filename)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)
