from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.String(120), index=True, unique=True)
    messages = db.relationship('Message', backref='author', lazy='dynamic')
    def __repr__(self):
        return '<User %r>' % (self.username)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2
        except NameError:
            return str(self.id)  # python 3

class Message(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Message %r>' % (self.content)