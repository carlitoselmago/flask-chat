#!venv/bin/python
import logging
from app import app

log = logging.getLogger('werkzeug')
log.disabled = True
app.run(debug=True,port="8080",host="0.0.0.0")
app.logger.disabled = True
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024    # 5 Mb limit
