#!venv/bin/python
import logging
from app import app

if __name__ == "__main__":
    log = logging.getLogger('werkzeug')
    log.disabled = True
    #app.run(debug=True,host="0.0.0.0")
    app.run()
    app.logger.disabled = True
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024    # 5 Mb limit
