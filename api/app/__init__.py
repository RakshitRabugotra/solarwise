"""
Initialize Flask application and register blueprints for each set of routes:
"""

from flask import Flask
from flask.json.provider import DefaultJSONProvider
import numpy as np

# Custom modules
from config import ApplicationConfig

# Import the extensions
from .extensions import bcrypt, db, migrate


class NumpyJSONProvider(DefaultJSONProvider):
    """Custom JSON provider that handles numpy data types"""
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.bool_, bool)):
            return bool(obj)
        return super().default(obj)

# Create the app instance
app = Flask(__name__)

# Set the configurations from external object
app.config.from_object(ApplicationConfig)

# Configure Flask to use custom JSON provider for numpy types
app.json = NumpyJSONProvider(app)

# Initialize extensions
bcrypt.init_app(app)
# Initialize the Database
db.init_app(app)

with app.app_context():
    db.create_all()

# Initialize the migrator
migrate.init_app(app, db)

# Import and register blueprints
from .routes.admin import admin_bp
from .routes.data import data_bp

# from .routes.<TODO: endpoint route here> import auth_bp

# Register blueprints
app.register_blueprint(admin_bp, url_prefix="/_/admin")

# The APIS for db access
app.register_blueprint(data_bp, url_prefix="/api/data")
